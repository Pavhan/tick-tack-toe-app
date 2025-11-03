import React from 'react';
import type { Player } from '@/components/Board/Board';
import { OIcon, XIcon } from '@/icons';
import { cn } from '@/lib/utils';

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
    {value === 'X' && <XIcon className="h-full w-full" />}
    {value === 'O' && <OIcon className="h-full w-full" />}
  </span>
);
