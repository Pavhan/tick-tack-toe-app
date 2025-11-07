import { PlayerValues } from './types';
import type { BoardCell, Player } from './types';

export const PLAYER_CONFIG = {
  [PlayerValues.X]: {
    value: 'X' as Player,
    color: 'text-amber-500',
    borderColor: 'border-amber-500',
    transparentBackground: 'bg-amber-500/10',
  },
  [PlayerValues.O]: {
    value: 'O' as Player,
    color: 'text-cyan-500',
    borderColor: 'border-cyan-500',
    transparentBackground: 'bg-cyan-500/10',
  },
} as const;

export const getNextPlayer = (isXNext: boolean): Player => {
  return isXNext ? PlayerValues.X : PlayerValues.O;
};

export const getPlayerColor = (player: BoardCell): string => {
  if (player === PlayerValues.X) return PLAYER_CONFIG.X.color;
  if (player === PlayerValues.O) return PLAYER_CONFIG.O.color;
  return '';
};

export const getPlayerBorderColor = (player: BoardCell): string => {
  if (player === PlayerValues.X) return PLAYER_CONFIG.X.borderColor;
  if (player === PlayerValues.O) return PLAYER_CONFIG.O.borderColor;
  return '';
};

export const getPlayerTransparentBackground = (player: BoardCell): string => {
  if (player === PlayerValues.X) return PLAYER_CONFIG.X.transparentBackground;
  if (player === PlayerValues.O) return PLAYER_CONFIG.O.transparentBackground;
  return '';
};
