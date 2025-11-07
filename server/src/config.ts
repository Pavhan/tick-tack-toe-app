/**
 * Server configuration
 */
export const config = {
  // Server
  port: parseInt(process.env.PORT || '3001', 10),
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // Database
  databasePath: process.env.DATABASE_PATH || './server/data/tictactoe.db',

  // API
  api: {
    prefix: '/api',
    version: 'v1',
  },

  // Game settings
  game: {
    minBoardSize: 3,
    maxBoardSize: 10,
    defaultBoardSize: 3,
  },
} as const;

export default config;
