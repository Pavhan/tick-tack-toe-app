import React from 'react';
import { OIcon, XIcon } from '@/icons';
import { getPlayerColor, PLAYERS } from '@/lib/constants';
import type { Player } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PlayerIconProps {
  value: Player;
  className?: string;
}

export const PlayerIcon: React.FC<PlayerIconProps> = ({ value, className }) => (
  <span className={cn('inline-block size-8', { [getPlayerColor(value)]: value !== null }, className)}>
    {value === PLAYERS.X && <XIcon className="h-full w-full" />}
    {value === PLAYERS.O && <OIcon className="h-full w-full" />}
  </span>
);
