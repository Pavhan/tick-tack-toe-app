import * as gameController from '@/controllers/gameController.js';
import express from 'express';

const router = express.Router();

/**
 * Get all games
 * GET /api/games
 */
router.get('/', gameController.getAllGames);

/**
 * Create a new game
 * POST /api/games
 */
router.post('/', gameController.createGame);

/**
 * Get game by ID
 * GET /api/games/:id
 */
router.get('/:id', gameController.getGame);

/**
 * Get game with all moves
 * GET /api/games/:id/full
 */
router.get('/:id/full', gameController.getGameWithMoves);

/**
 * Update game
 * PATCH /api/games/:id
 */
router.patch('/:id', gameController.updateGame);

/**
 * Delete game
 * DELETE /api/games/:id
 */
router.delete('/:id', gameController.deleteGame);

/**
 * Get moves for a game
 * GET /api/games/:id/moves
 */
router.get('/:id/moves', gameController.getGameMoves);

/**
 * Add a move to a game
 * POST /api/games/:id/moves
 */
router.post('/:id/moves', gameController.addMove);

export default router;
