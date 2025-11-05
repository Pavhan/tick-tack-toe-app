import { Player } from './types';

export const PLAYER_CONFIG = {
  [Player.X]: {
    value: 'X' as Player,
    color: 'text-amber-500',
    borderColor: 'border-amber-500',
    transparentBackground: 'bg-amber-500/10',
  },
  [Player.O]: {
    value: 'O' as Player,
    color: 'text-cyan-500',
    borderColor: 'border-cyan-500',
    transparentBackground: 'bg-cyan-500/10',
  },
} as const;

export const getNextPlayer = (isXNext: boolean): Player => {
  return isXNext ? Player.X : Player.O;
};

export const getPlayerColor = (player: Player): string => {
  if (player === Player.X) return PLAYER_CONFIG.X.color;
  if (player === Player.O) return PLAYER_CONFIG.O.color;
  return '';
};

export const getPlayerBorderColor = (player: Player): string => {
  if (player === Player.X) return PLAYER_CONFIG.X.borderColor;
  if (player === Player.O) return PLAYER_CONFIG.O.borderColor;
  return '';
};

export const getPlayerTransparentBackground = (player: Player): string => {
  if (player === Player.X) return PLAYER_CONFIG.X.transparentBackground;
  if (player === Player.O) return PLAYER_CONFIG.O.transparentBackground;
  return '';
};
