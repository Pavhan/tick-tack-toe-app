import type { Request, Response } from 'express';

import * as gameService from '@/services/gameService.js';
import {
  errorResponse,
  successResponse,
  validateCreateGameRequest,
  validateGameId,
  validateGameListQuery,
  validateMakeMoveRequest,
  validateUpdateGameRequest,
} from '@/utils/index.js';

// Simple async handler
function asyncHandler(fn: (req: Request, res: Response) => Promise<void>) {
  return (req: Request, res: Response, next: any): void => {
    Promise.resolve(fn(req, res)).catch(next);
  };
}

/**
 * Create a new game
 * POST /api/games
 */
export const createGame = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { board_size } = validateCreateGameRequest(req.body);
    const boardSize = board_size || 3;
    const game = gameService.createGame(boardSize);
    res.status(201).json(successResponse(game, 'Game created successfully'));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message, 400));
  }
});

/**
 * Get all games
 * GET /api/games
 */
export const getAllGames = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { status } = validateGameListQuery(req.query);

    const games = gameService.getGames(status);

    res.json(successResponse(games));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message, 400));
  }
});

/**
 * Get game by ID
 * GET /api/games/:id
 */
export const getGame = asyncHandler(async (req: Request, res: Response) => {
  try {
    const gameId = validateGameId(req.params.id);
    const game = gameService.getGameById(gameId);
    res.json(successResponse(game));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message, 400));
  }
});

/**
 * Get game with moves
 * GET /api/games/:id/full
 */
export const getGameWithMoves = asyncHandler(async (req: Request, res: Response) => {
  try {
    const gameId = validateGameId(req.params.id);
    const game = gameService.getGameWithMoves(gameId);
    res.json(successResponse(game));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message, 400));
  }
});

/**
 * Update game
 * PATCH /api/games/:id
 */
export const updateGame = asyncHandler(async (req: Request, res: Response) => {
  try {
    const gameId = validateGameId(req.params.id);
    const updates = validateUpdateGameRequest(req.body);

    const sanitizedUpdates = {
      ...(updates.status !== undefined ? { status: updates.status } : {}),
      ...(updates.winner != null ? { winner: updates.winner } : {}),
    } as Parameters<typeof gameService.updateGame>[1];

    const game = gameService.updateGame(gameId, sanitizedUpdates);
    res.json(successResponse(game, 'Game updated successfully'));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message, 400));
  }
});

/**
 * Delete game
 * DELETE /api/games/:id
 */
export const deleteGame = asyncHandler(async (req: Request, res: Response) => {
  try {
    const gameId = validateGameId(req.params.id);
    gameService.deleteGame(gameId);
    res.json(successResponse(null, 'Game deleted successfully'));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message, 400));
  }
});

/**
 * Add a move to a game
 * POST /api/games/:id/moves
 */
export const addMove = asyncHandler(async (req: Request, res: Response) => {
  try {
    const gameId = validateGameId(req.params.id);
    const { position, player } = validateMakeMoveRequest(req.body);
    const move = gameService.addMove(gameId, position, player);
    res.status(201).json(successResponse(move, 'Move added successfully'));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message, 400));
  }
});

/**
 * Get moves for a game
 * GET /api/games/:id/moves
 */
export const getGameMoves = asyncHandler(async (req: Request, res: Response) => {
  try {
    const gameId = validateGameId(req.params.id);
    const moves = gameService.getGameMoves(gameId);
    res.json(successResponse(moves));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message, 400));
  }
});
