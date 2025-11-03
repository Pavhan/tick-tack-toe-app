import React from 'react';
import { cn } from '../../lib/utils';
import type { Player } from '../Board/Board';
import { OIcon, XIcon } from '../Icons';

interface BoardIconProps {
  value: Player;
}

export const BoardIcon: React.FC<BoardIconProps> = ({ value }) => (
  <span
    className={cn({
      'text-blue-500': value === 'X',
      'text-red-500': value === 'O',
    })}
  >
    {value === 'X' && <XIcon className="w-full h-full" />}
    {value === 'O' && <OIcon className="w-full h-full" />}
  </span>
);
