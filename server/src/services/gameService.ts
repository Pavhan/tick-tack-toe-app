import { getDatabase } from '@/db/connection.js';
import type { Game, GameListItem, GameMove, GameStatus, GameWinner, GameWithMoves, Player } from '@/types/index.js';

// Simple error classes
class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

class NotFoundError extends ApiError {
  constructor(message: string) {
    super(404, message);
  }
}

/**
 * Create a new game
 */
export function createGame(boardSize = 3): Game {
  const db = getDatabase();

  const result = db
    .prepare(
      `INSERT INTO games (board_size, status, current_player) 
       VALUES (?, 'in_progress', 'X')`,
    )
    .run(boardSize);

  const game = db.prepare('SELECT * FROM games WHERE id = ?').get(result.lastInsertRowid) as Game;

  return game;
}

/**
 * Get game by ID
 */
export function getGameById(gameId: number): Game {
  const db = getDatabase();

  const game = db.prepare('SELECT * FROM games WHERE id = ?').get(gameId) as Game | undefined;

  if (!game) {
    throw new NotFoundError(`Game with ID ${gameId} not found`);
  }

  return game;
}

/**
 * Get game with all moves
 */
export function getGameWithMoves(gameId: number): GameWithMoves {
  const db = getDatabase();

  const game = getGameById(gameId);

  const moves = db
    .prepare(
      `SELECT * FROM game_moves 
       WHERE game_id = ? 
       ORDER BY move_number ASC`,
    )
    .all(gameId) as GameMove[];

  return {
    ...game,
    moves,
  };
}

/**
 * Get all games with filtering
 */
export function getGames(status?: GameStatus): GameListItem[] {
  const db = getDatabase();

  let query = `
    SELECT 
      g.*,
      COUNT(gm.id) as move_count
    FROM games g
    LEFT JOIN game_moves gm ON g.id = gm.game_id
  `;

  const params: unknown[] = [];

  if (status) {
    query += ' WHERE g.status = ?';
    params.push(status);
  }

  query += ' GROUP BY g.id ORDER BY g.created_at DESC LIMIT 100';

  const games = db.prepare(query).all(...params) as GameListItem[];

  return games;
}

/**
 * Update game
 */
export function updateGame(gameId: number, updates: { status?: GameStatus; winner?: GameWinner }): Game {
  const db = getDatabase();

  // Verify game exists
  getGameById(gameId);

  const updateFields: string[] = [];
  const updateValues: unknown[] = [];

  if (updates.status !== undefined) {
    updateFields.push('status = ?');
    updateValues.push(updates.status);
  }

  if (updates.winner !== undefined) {
    updateFields.push('winner = ?');
    updateValues.push(updates.winner);
  }

  if (updateFields.length === 0) {
    throw new ApiError(400, 'No valid fields to update');
  }

  updateValues.push(gameId);

  db.prepare(`UPDATE games SET ${updateFields.join(', ')} WHERE id = ?`).run(...updateValues);

  return getGameById(gameId);
}

/**
 * Delete game
 */
export function deleteGame(gameId: number): void {
  const db = getDatabase();

  getGameById(gameId);

  db.prepare('DELETE FROM games WHERE id = ?').run(gameId);
}

/**
 * Add a move to a game
 */
export function addMove(gameId: number, position: number, player: Player): GameMove {
  const db = getDatabase();

  const game = getGameById(gameId);

  // Validate game is in progress
  if (game.status !== 'in_progress') {
    throw new ApiError(400, 'Cannot add move to a game that is not in progress');
  }

  // Validate it's the correct player's turn
  if (game.current_player !== player) {
    throw new ApiError(400, `It's ${game.current_player}'s turn, not ${player}'s`);
  }

  // Validate position is not already taken
  const existingMove = db
    .prepare('SELECT * FROM game_moves WHERE game_id = ? AND position = ?')
    .get(gameId, position) as GameMove | undefined;

  if (existingMove) {
    throw new ApiError(400, `Position ${position} is already taken`);
  }

  // Get next move number
  const { max_move } = db
    .prepare('SELECT COALESCE(MAX(move_number), 0) as max_move FROM game_moves WHERE game_id = ?')
    .get(gameId) as { max_move: number };

  const moveNumber = max_move + 1;

  // Insert move
  const result = db
    .prepare(
      `INSERT INTO game_moves (game_id, move_number, position, player)
       VALUES (?, ?, ?, ?)`,
    )
    .run(gameId, moveNumber, position, player);

  // Update current player
  const nextPlayer: Player = player === 'X' ? 'O' : 'X';
  db.prepare('UPDATE games SET current_player = ? WHERE id = ?').run(nextPlayer, gameId);

  const move = db.prepare('SELECT * FROM game_moves WHERE id = ?').get(result.lastInsertRowid) as GameMove;

  return move;
}

/**
 * Get moves for a game
 */
export function getGameMoves(gameId: number): GameMove[] {
  const db = getDatabase();

  // Verify game exists
  getGameById(gameId);

  const moves = db
    .prepare(
      `SELECT * FROM game_moves 
       WHERE game_id = ? 
       ORDER BY move_number ASC`,
    )
    .all(gameId) as GameMove[];

  return moves;
}
