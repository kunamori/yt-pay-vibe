import Database from 'better-sqlite3';
import path from 'path';

export interface Submission {
  id: number;
  userName: string;
  driveFileId: string;
  driveFileUrl: string;
  uploadedAt: string;
}

let db: Database.Database | null = null;

export function getDatabase() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'data', 'submissions.db');
    db = new Database(dbPath);
    
    // Create submissions table if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userName TEXT NOT NULL,
        driveFileId TEXT NOT NULL,
        driveFileUrl TEXT NOT NULL,
        uploadedAt TEXT NOT NULL
      )
    `);
  }
  return db;
}

export function createSubmission(userName: string, driveFileId: string, driveFileUrl: string): Submission {
  const db = getDatabase();
  const uploadedAt = new Date().toISOString();
  
  const stmt = db.prepare(`
    INSERT INTO submissions (userName, driveFileId, driveFileUrl, uploadedAt)
    VALUES (?, ?, ?, ?)
  `);
  
  const result = stmt.run(userName, driveFileId, driveFileUrl, uploadedAt);
  
  return {
    id: Number(result.lastInsertRowid),
    userName,
    driveFileId,
    driveFileUrl,
    uploadedAt,
  };
}

export function getAllSubmissions(): Submission[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM submissions ORDER BY uploadedAt DESC');
  return stmt.all() as Submission[];
}

export function getSubmissionById(id: number): Submission | undefined {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM submissions WHERE id = ?');
  return stmt.get(id) as Submission | undefined;
}
