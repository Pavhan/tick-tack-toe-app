export const PlayerValues = {
  X: 'X',
  O: 'O',
  None: null,
} as const;

export type Player = (typeof PlayerValues)[keyof typeof PlayerValues];
export type Winner = Player | 'Draw' | null;

export type GameState = {
  board: Player[];
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
