export type Player = 'X' | 'O';
export type BoardCell = Player | null;

export const PlayerValues = {
  X: 'X' as Player,
  O: 'O' as Player,
} as const;

export type Winner = Player | 'Draw' | null;

export type GameState = {
  board: BoardCell[];
  isXNext: boolean;
  winner: Winner;
};

export type HistoryEntry = {
  player: Player;
  position: number;
  gameState: GameState;
};

export type SavedGame = {
  id: string;
  boardSize: number;
  history: HistoryEntry[];
  winner: Winner;
  timestamp: number;
};

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    statusCode: number;
  };
}

export type GameStatus = 'in_progress' | 'completed' | 'abandoned';
export type GameWinner = 'X' | 'O' | 'draw';

export interface BackendGame {
  id: number;
  board_size: number;
  status: GameStatus;
  winner: GameWinner | null;
  current_player: Player;
  created_at: string;
  updated_at: string;
}

export interface BackendMove {
  id: number;
  game_id: number;
  move_number: number;
  position: number;
  player: Player;
  created_at: string;
}

export interface BackendGameWithMoves extends BackendGame {
  moves: BackendMove[];
}

export interface BackendGameListItem extends BackendGame {
  move_count: number;
}
