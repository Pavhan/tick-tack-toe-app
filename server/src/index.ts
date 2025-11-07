import config from '@/config';
import { initializeDatabase } from '@/db/index.js';
import gameRoutes from '@/routes/gameRoutes.js';
import { logger } from '@/utils/logger.js';
import dotenv from 'dotenv';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import type { Server } from 'http';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import YAML from 'yamljs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createApp() {
  // Load environment variables
  dotenv.config({ path: path.join(__dirname, '../.env') });

  // Initialize database
  await initializeDatabase();

  const app = express();

  // Load OpenAPI specification
  const openapiDocument = YAML.load(path.join(__dirname, '../openapi.yaml'));

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Swagger UI
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(openapiDocument, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Tic-Tac-Toe API Documentation',
    }),
  );

  // Redirect root to API docs
  app.get('/', (_req: Request, res: Response) => {
    res.redirect('/api-docs');
  });

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
    logger('Error:', err.message);

    const statusCode = (err as any).statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: {
        message: err.message || 'Internal server error',
        statusCode,
      },
    });
  });

  return app;
}

async function startServer(app: express.Application): Promise<Server> {
  return new Promise((resolve) => {
    const server = app.listen(config.port, () => {
      logger('Server running on http://localhost:', config.port);
      resolve(server);
    });
  });
}

async function main() {
  let server: Server | undefined;

  try {
    const app = await createApp();
    server = await startServer(app);

    // Handle graceful shutdown
    process.on('SIGTERM', () => shutdown(server));
    process.on('SIGINT', () => shutdown(server));
  } catch (error) {
    logger('Failed to start server:', error);
    throw error;
  }
}

async function shutdown(server: Server | undefined) {
  if (server) {
    server.close(() => {
      logger('Server shut down gracefully');
      process.exit(0);
    });

    // Force close after 5s if graceful shutdown fails
    setTimeout(() => {
      logger('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 5000);
  }
}

// Start the application
if (process.env.NODE_ENV !== 'test') {
  main().catch((err) => {
    logger('Fatal error:', err);
    process.exit(1);
  });
}

export default createApp;
