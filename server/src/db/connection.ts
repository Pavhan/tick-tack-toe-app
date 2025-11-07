import { logger } from '@/utils/logger.js';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get database path from environment or use default
const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../data/tictactoe.db');

let db: Database.Database | null = null;
let isInitialized = false;

/**
 * Sets up the database connection by ensuring the directory exists
 * and configuring the database with proper settings
 */
export function setupDatabaseConnection(): void {
  if (isInitialized) {
    return;
  }

  try {
    // Ensure the data directory exists
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      logger('Created database directory:', dbDir);
    }

    // Initialize the database connection
    db = new Database(DB_PATH);

    // Enable foreign keys
    db.pragma('foreign_keys = ON');

    // Set WAL mode for better concurrency
    db.pragma('journal_mode = WAL');

    isInitialized = true;
    logger('Database connection configured successfully:', DB_PATH);
  } catch (error) {
    logger('Failed to setup database connection:', error);
    throw error;
  }
}

/**
 * Get database connection. Throws an error if the database is not initialized.
 */
export function getDatabase(): Database.Database {
  if (!isInitialized) {
    throw new Error('Database connection not initialized.');
  }

  if (!db) {
    throw new Error('Database connection was initialized but is null.');
  }

  return db;
}

export default getDatabase;
