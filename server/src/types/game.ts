export type Player = 'X' | 'O';
export type GameStatus = 'in_progress' | 'completed' | 'abandoned';
export type GameWinner = 'X' | 'O' | 'draw';

export interface Game {
  id: number;
  board_size: number;
  status: GameStatus;
  winner: GameWinner | null;
  current_player: Player;
  created_at: string;
  updated_at: string;
}

export interface GameMove {
  id: number;
  game_id: number;
  move_number: number;
  position: number;
  player: Player;
  created_at: string;
}

export interface CreateGameRequest {
  board_size?: number;
}

export interface MakeMoveRequest {
  position: number;
  player: Player;
}

export interface UpdateGameRequest {
  status?: GameStatus;
  winner?: GameWinner | null;
  current_player?: Player;
}

export interface GameWithMoves extends Game {
  moves: GameMove[];
}

export interface GameListItem extends Game {
  move_count: number;
}
export interface GameListQuery {
  status?: GameStatus;
}
