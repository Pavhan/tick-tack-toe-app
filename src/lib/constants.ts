import type { Player } from './types';

export const PLAYERS = {
  X: 'X',
  O: 'O',
} as const;

export const PLAYER_CONFIG = {
  [PLAYERS.X]: {
    value: 'X' as Player,
    color: 'text-blue-500',
  },
  [PLAYERS.O]: {
    value: 'O' as Player,
    color: 'text-red-500',
  },
} as const;

export const getNextPlayer = (isXNext: boolean): Player => {
  return isXNext ? PLAYERS.X : PLAYERS.O;
};

export const getPlayerColor = (player: Player): string => {
  if (player === PLAYERS.X) return PLAYER_CONFIG.X.color;
  if (player === PLAYERS.O) return PLAYER_CONFIG.O.color;
  return '';
};
