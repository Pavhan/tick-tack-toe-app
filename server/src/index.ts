import config from '@/config';
import { initializeDatabase } from '@/db/index.js';
import gameRoutes from '@/routes/gameRoutes.js';
import dotenv from 'dotenv';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

// Initialize database
try {
  initializeDatabase();
} catch (error) {
  console.error('Failed to initialize database:', error);
  process.exit(1);
}

const app = express();

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/games', gameRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      statusCode: 404,
    },
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err.message);

  const statusCode = (err as any).statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      statusCode,
    },
  });
});

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`);
});

export default app;
