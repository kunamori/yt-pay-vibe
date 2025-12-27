import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie, getCurrentSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not logged in' },
        { status: 401 }
      );
    }

    await clearSessionCookie();

    return NextResponse.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
