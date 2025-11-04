import React from 'react';
import { PlayerIcon } from '@/components/PlayerIcon/PlayerIcon';
import type { Player } from '@/lib/types';
import { cn } from '@/lib/utils';

interface BoardButtonProps {
  value: Player;
  onClick: () => void;
  disabled: boolean;
  isViewingHistory?: boolean;
  isHighlighted?: boolean;
}

export const BoardButton: React.FC<BoardButtonProps> = ({
  value,
  onClick,
  disabled,
  isHighlighted = false,
  isViewingHistory = false,
}) => (
  <button
    className={cn(
      'm-0.5 flex size-8 items-center justify-center md:size-12',
      'border-2 border-neutral-400 bg-white font-bold transition-all',
      'hover:disabled:bg-white',
      {
        'border-2 border-yellow-500 bg-yellow-100 hover:disabled:bg-yellow-100': isHighlighted,
        'cursor-pointer hover:bg-gray-200': !isViewingHistory,
        'disabled:pointer-events-none': isViewingHistory || disabled,
      },
    )}
    onClick={onClick}
    disabled={disabled}
  >
    <PlayerIcon value={value} />
  </button>
);
