import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export interface AdminSession {
  username: string;
  expiresAt: number;
}

// In-memory session store (for production, use Redis or a database)
const sessions = new Map<string, AdminSession>();

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    throw new Error('Admin credentials not configured');
  }

  // Check if password is hashed (starts with $2a$ or $2b$ for bcrypt)
  const isPasswordHashed = adminPassword.startsWith('$2');
  
  if (isPasswordHashed) {
    return username === adminUsername && await bcrypt.compare(password, adminPassword);
  } else {
    // For development/testing, allow plain text comparison
    return username === adminUsername && password === adminPassword;
  }
}

export function createSession(username: string): string {
  const sessionId = generateSessionId();
  const expiresAt = Date.now() + SESSION_DURATION;

  sessions.set(sessionId, {
    username,
    expiresAt,
  });

  return sessionId;
}

export function getSession(sessionId: string): AdminSession | null {
  const session = sessions.get(sessionId);
  
  if (!session) {
    return null;
  }

  // Check if session has expired
  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId);
    return null;
  }

  return session;
}

export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId);
}

export async function getCurrentSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return null;
  }

  return getSession(sessionId);
}

export async function setSessionCookie(sessionId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000, // in seconds
    path: '/',
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
