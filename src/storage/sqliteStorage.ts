import Database from 'better-sqlite3';
import path from 'path';

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'urls.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS urls (
    short_code TEXT PRIMARY KEY,
    long_url TEXT NOT NULL UNIQUE
  );
`);

export function save(longUrl: string, shortCode: string): void {
  db.prepare('INSERT INTO urls (short_code, long_url) VALUES (?, ?)').run(shortCode, longUrl);
}

export function findByShortCode(shortCode: string): string | null {
  const row = db.prepare('SELECT long_url FROM urls WHERE short_code = ?').get(shortCode) as { long_url: string } | undefined;
  return row ? row.long_url : null;
}

export function findByLongUrl(longUrl: string): string | null {
  const row = db.prepare('SELECT short_code FROM urls WHERE long_url = ?').get(longUrl) as { short_code: string } | undefined;
  return row ? row.short_code : null;
}
