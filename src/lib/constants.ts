import type { Player } from './types';

export const PLAYERS = {
  X: 'X',
  O: 'O',
} as const;

export const PLAYER_CONFIG = {
  [PLAYERS.X]: {
    value: 'X' as Player,
    color: 'text-amber-500',
    borderColor: 'border-amber-500',
    transparentBackground: 'bg-amber-500/10',
  },
  [PLAYERS.O]: {
    value: 'O' as Player,
    color: 'text-cyan-500',
    borderColor: 'border-cyan-500',
    transparentBackground: 'bg-cyan-500/10',
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

export const getPlayerBorderColor = (player: Player): string => {
  if (player === PLAYERS.X) return PLAYER_CONFIG.X.borderColor;
  if (player === PLAYERS.O) return PLAYER_CONFIG.O.borderColor;
  return '';
};

export const getPlayerTransparentBackground = (player: Player): string => {
  if (player === PLAYERS.X) return PLAYER_CONFIG.X.transparentBackground;
  if (player === PLAYERS.O) return PLAYER_CONFIG.O.transparentBackground;
  return '';
};
