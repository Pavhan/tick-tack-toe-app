import React from 'react';
import { PlayerIcon } from '@/components/PlayerIcon/PlayerIcon';
import type { Player } from '@/lib/types';
import { cn } from '@/lib/utils';

interface BoardButtonProps {
  value: Player;
  onClick: () => void;
  disabled: boolean;
}

export const BoardButton: React.FC<BoardButtonProps> = ({ value, onClick, disabled }) => (
  <button
    className={cn(
      'm-0.5 flex size-8 cursor-pointer items-center justify-center md:size-12',
      'border-2 border-neutral-400 bg-white font-bold transition-all',
      'hover:bg-gray-200 disabled:cursor-not-allowed hover:disabled:bg-white',
    )}
    onClick={onClick}
    disabled={disabled}
  >
    <PlayerIcon value={value} />
  </button>
);
