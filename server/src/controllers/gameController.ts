import * as gameService from '@/services/gameService.js';
import type { CreateGameRequest, GameListQuery, MakeMoveRequest } from '@/types/index.js';
import { errorResponse, successResponse } from '@/utils/index.js';
import type { Request, Response } from 'express';

// Simple async handler
function asyncHandler(fn: (req: Request, res: Response) => Promise<void | Response>) {
  return (req: Request, res: Response, next: any): void => {
    Promise.resolve(fn(req, res)).catch(next);
  };
}

/**
 * Create a new game
 * POST /api/games
 */
export const createGame = asyncHandler(async (req: Request, res: Response) => {
  const { board_size } = req.body as CreateGameRequest;
  const boardSize = board_size || 3;
  const game = gameService.createGame(boardSize);
  res.status(201).json(successResponse(game, 'Game created successfully'));
});

/**
 * Get all games
 * GET /api/games
 */
export const getAllGames = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query as GameListQuery;

  const games = gameService.getGames(status);

  res.json(successResponse(games));
});

/**
 * Get game by ID
 * GET /api/games/:id
 */
export const getGame = asyncHandler(async (req: Request, res: Response) => {
  const gameId = parseInt(req.params.id, 10);

  if (isNaN(gameId)) {
    res.status(400).json(errorResponse('Invalid game ID', 400));
    return;
  }

  const game = gameService.getGameById(gameId);

  res.json(successResponse(game));
});

/**
 * Get game with moves
 * GET /api/games/:id/full
 */
export const getGameWithMoves = asyncHandler(async (req: Request, res: Response) => {
  const gameId = parseInt(req.params.id, 10);

  if (isNaN(gameId)) {
    res.status(400).json(errorResponse('Invalid game ID', 400));
    return;
  }

  const game = gameService.getGameWithMoves(gameId);

  res.json(successResponse(game));
});

/**
 * Update game
 * PATCH /api/games/:id
 */
export const updateGame = asyncHandler(async (req: Request, res: Response) => {
  const gameId = parseInt(req.params.id, 10);

  if (isNaN(gameId)) {
    res.status(400).json(errorResponse('Invalid game ID', 400));
    return;
  }

  const updates = req.body;

  const game = gameService.updateGame(gameId, updates);

  res.json(successResponse(game, 'Game updated successfully'));
});

/**
 * Delete game
 * DELETE /api/games/:id
 */
export const deleteGame = asyncHandler(async (req: Request, res: Response) => {
  const gameId = parseInt(req.params.id, 10);

  if (isNaN(gameId)) {
    res.status(400).json(errorResponse('Invalid game ID', 400));
    return;
  }

  gameService.deleteGame(gameId);

  res.json(successResponse(null, 'Game deleted successfully'));
});

/**
 * Add a move to a game
 * POST /api/games/:id/moves
 */
export const addMove = asyncHandler(async (req: Request, res: Response) => {
  const gameId = parseInt(req.params.id, 10);

  if (isNaN(gameId)) {
    res.status(400).json(errorResponse('Invalid game ID', 400));
    return;
  }

  const { position, player } = req.body as MakeMoveRequest;
  const move = gameService.addMove(gameId, position, player);
  res.status(201).json(successResponse(move, 'Move added successfully'));
});

/**
 * Get moves for a game
 * GET /api/games/:id/moves
 */
export const getGameMoves = asyncHandler(async (req: Request, res: Response) => {
  const gameId = parseInt(req.params.id, 10);

  if (isNaN(gameId)) {
    res.status(400).json(errorResponse('Invalid game ID', 400));
    return;
  }

  const moves = gameService.getGameMoves(gameId);

  res.json(successResponse(moves));
});
