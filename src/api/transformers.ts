import type {
  BackendGame,
  BackendGameWithMoves,
  BackendMove,
  BoardCell,
  HistoryEntry,
  SavedGame,
  Winner,
} from '@/lib/types';

/**
 * Convert backend winner format to frontend format
 */
export const transformWinner = (backendWinner: BackendGame['winner']): Winner => {
  if (backendWinner === null) return null;
  if (backendWinner === 'draw') return 'Draw';
  return backendWinner;
};

/**
 * Convert frontend winner to backend format
 */
export const transformWinnerToBackend = (winner: Winner): BackendGame['winner'] => {
  if (winner === null) return null;
  if (winner === 'Draw') return 'draw';
  return winner;
};

/**
 * Reconstruct game board from moves
 */
export const reconstructBoard = (moves: BackendMove[], boardSize: number): BoardCell[] => {
  const board: BoardCell[] = Array(boardSize * boardSize).fill(null);

  for (const move of moves) {
    board[move.position] = move.player;
  }

  return board;
};

/**
 * Transform backend moves to frontend history
 */
export const transformMovesToHistory = (
  moves: BackendMove[],
  boardSize: number,
  finalWinner: Winner,
): HistoryEntry[] => {
  const history: HistoryEntry[] = [];

  for (let i = 0; i < moves.length; i++) {
    const currentMoves = moves.slice(0, i + 1);
    const board = reconstructBoard(currentMoves, boardSize);
    const isXNext = moves[i].player === 'X' ? false : true;

    // Determine winner at this point (only set on last move if game complete)
    const winner = i === moves.length - 1 ? finalWinner : null;

    const historyEntry: HistoryEntry = {
      player: moves[i].player,
      position: moves[i].position,
      gameState: {
        board,
        isXNext,
        winner,
      },
    };

    history.push(historyEntry);
  }

  return history;
};

/**
 * Transform backend game to frontend SavedGame
 */
export const transformBackendGameToSavedGame = (backendGame: BackendGameWithMoves): SavedGame => {
  const winner = transformWinner(backendGame.winner);
  const history = transformMovesToHistory(backendGame.moves, backendGame.board_size, winner);

  return {
    id: backendGame.id.toString(),
    boardSize: backendGame.board_size,
    history,
    winner,
    timestamp: new Date(backendGame.created_at).getTime(),
  };
};
