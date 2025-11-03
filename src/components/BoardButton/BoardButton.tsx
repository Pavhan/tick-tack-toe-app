import React from 'react';
import { BoardIcon } from '@/components/BoardIcon/BoardButton';

type Player = 'X' | 'O' | null;

interface BoardButtonProps {
  value: Player;
  onClick: () => void;
  disabled: boolean;
}

export const BoardButton: React.FC<BoardButtonProps> = ({ value, onClick, disabled }) => (
  <button
    className="m-0.5 size-12 cursor-pointer border-2 border-neutral-400 bg-white p-2 font-bold transition-all hover:bg-gray-200 disabled:cursor-not-allowed hover:disabled:bg-white"
    onClick={onClick}
    disabled={disabled}
  >
    <BoardIcon value={value} />
  </button>
);
