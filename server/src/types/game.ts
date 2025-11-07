type DateTimeISO = string;

const PlayerValues = {
  x: 'X',
  o: 'O',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Player = (typeof PlayerValues)[keyof typeof PlayerValues];

const GameWinnerValues = {
  x: 'X',
  o: 'O',
  draw: 'draw',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GameWinner = (typeof GameWinnerValues)[keyof typeof GameWinnerValues];

const GameStatusValues = {
  InProgress: 'in_progress',
  Completed: 'completed',
  Abandoned: 'abandoned',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GameStatus = (typeof GameStatusValues)[keyof typeof GameStatusValues];

export interface Game {
  id: number;
  board_size: number;
  status: GameStatus;
  winner: GameWinner | null;
  current_player: Player;
  created_at: DateTimeISO;
  updated_at: DateTimeISO;
}

export interface GameMove {
  id: number;
  game_id: number;
  move_number: number;
  position: number;
  player: Player;
  created_at: DateTimeISO;
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
