export type Player = 'X' | 'O' | null;
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
