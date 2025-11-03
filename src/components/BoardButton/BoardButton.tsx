import React from 'react';
import { cn } from '../../lib/utils';

type Player = 'X' | 'O' | null;

interface BoardButtonProps {
  value: Player;
  onClick: () => void;
  disabled: boolean;
}

export const BoardButton: React.FC<BoardButtonProps> = ({ value, onClick, disabled }) => {
  return (
    <button
      className={cn(
        'size-12 bg-white border-neutral-400 border-2 font-bold cursor-pointer transition-backckground m-0.5 text-2xl disabled:cursor-not-allowed hover:bg-gray-200',
        {
          [value && value === 'X' ? 'text-blue-500' : '']: true,
          [value && value === 'O' ? 'text-red-500' : '']: true,
        },
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {value}
    </button>
  );
};
