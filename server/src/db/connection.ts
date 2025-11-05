import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get database path from environment or use default
const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../data/tictactoe.db');

// Ensure the data directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`📁 Created database directory: ${dbDir}`);
}

let db: Database.Database | null = null;

/**
 * Get or create database connection
 */
export function getDatabase(): Database.Database {
  if (!db) {
    try {
      db = new Database(DB_PATH);

      // Enable foreign keys
      db.pragma('foreign_keys = ON');

      // Set WAL mode for better concurrency
      db.pragma('journal_mode = WAL');

      console.log(`✅ Connected to database: ${DB_PATH}`);
    } catch (error) {
      console.error('❌ Failed to connect to database:', error);
      throw error;
    }
  }

  return db;
}

export default getDatabase;
