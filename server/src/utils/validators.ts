import type {
  CreateGameRequest,
  GameListQuery,
  GameStatus,
  MakeMoveRequest,
  UpdateGameRequest,
} from '@/types/index.js';

/**
 * Validates query parameters for game list endpoint
 */
export const validateGameListQuery = (query: any): GameListQuery => {
  if (!query || typeof query !== 'object') {
    throw new Error('Invalid query parameters! Expected an object.');
  }

  if (!query.status) return {} as GameListQuery;
  if (typeof query.status !== 'string') {
    throw new Error('Invalid status parameter! Expected a string.');
  }

  switch (query.status.toLowerCase()) {
    case 'in_progress':
    case 'completed':
    case 'abandoned':
      return { status: query.status as GameStatus };
    default:
      throw new Error('Invalid status value! Expected "in_progress", "completed", or "abandoned".');
  }
};

/**
 * Validates create game request body
 */
export const validateCreateGameRequest = (body: any): CreateGameRequest => {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid request body! Expected an object.');
  }

  if (body.board_size !== undefined) {
    if (typeof body.board_size !== 'number' || body.board_size < 3 || body.board_size > 10) {
      throw new Error('Invalid board_size! Expected a number between 3 and 10.');
    }
  }

  return body as CreateGameRequest;
};

/**
 * Validates update game request body
 */
export const validateUpdateGameRequest = (body: any): UpdateGameRequest => {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid request body! Expected an object.');
  }

  if (body.status !== undefined) {
    if (typeof body.status !== 'string') {
      throw new Error('Invalid status! Expected a string.');
    }
    if (!['in_progress', 'completed', 'abandoned'].includes(body.status)) {
      throw new Error('Invalid status value! Expected "in_progress", "completed", or "abandoned".');
    }
  }

  if (body.winner !== undefined && body.winner !== null) {
    if (typeof body.winner !== 'string') {
      throw new Error('Invalid winner! Expected a string or null.');
    }
    if (!['X', 'O', 'draw'].includes(body.winner)) {
      throw new Error('Invalid winner value! Expected "X", "O", or "draw".');
    }
  }

  if (body.current_player !== undefined) {
    if (typeof body.current_player !== 'string') {
      throw new Error('Invalid current_player! Expected a string.');
    }
    if (!['X', 'O'].includes(body.current_player)) {
      throw new Error('Invalid current_player value! Expected "X" or "O".');
    }
  }

  return body as UpdateGameRequest;
};

/**
 * Validates make move request body
 */
export const validateMakeMoveRequest = (body: any): MakeMoveRequest => {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid request body! Expected an object.');
  }

  if (typeof body.position !== 'number' || body.position < 0) {
    throw new Error('Invalid position! Expected a non-negative number.');
  }

  if (typeof body.player !== 'string' || !['X', 'O'].includes(body.player)) {
    throw new Error('Invalid player! Expected "X" or "O".');
  }

  return body as MakeMoveRequest;
};

/**
 * Validates game ID parameter
 */
export const validateGameId = (id: any): number => {
  const gameId = parseInt(id, 10);

  if (isNaN(gameId) || gameId < 0) {
    throw new Error('Invalid game ID! Expected a non-negative integer.');
  }

  return gameId;
};
