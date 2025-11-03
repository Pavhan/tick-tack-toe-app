import React from 'react';
import { BoardIcon } from '../BoardIcon/BoardButton';

type Player = 'X' | 'O' | null;

interface BoardButtonProps {
  value: Player;
  onClick: () => void;
  disabled: boolean;
}

export const BoardButton: React.FC<BoardButtonProps> = ({ value, onClick, disabled }) => (
  <button
    className="size-12 bg-white border-neutral-400 border-2 font-bold cursor-pointer transition-all m-0.5 disabled:cursor-not-allowed hover:bg-gray-200 p-2 hover:disabled:bg-white"
    onClick={onClick}
    disabled={disabled}
  >
    <BoardIcon value={value} />
  </button>
);
