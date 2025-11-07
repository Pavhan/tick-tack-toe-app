import { logger } from '@/utils/logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDatabase, setupDatabaseConnection } from './connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Initialize database by setting up connection and running schema SQL file
 */
export function initializeDatabase(): void {
  try {
    // First ensure the database connection is set up
    setupDatabaseConnection();

    const db = getDatabase();
    const schemaPath = path.join(__dirname, 'schema.sql');

    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }

    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Execute the schema SQL
    db.exec(schema);

    logger('Database schema initialized successfully');
  } catch (error) {
    logger('Failed to initialize database:', error);
    throw error;
  }
}

export default initializeDatabase;
