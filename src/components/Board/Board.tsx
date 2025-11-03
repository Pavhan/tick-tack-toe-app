import React from 'react';
import { BoardButton } from '@/components/BoardButton/BoardButton';

export type Player = 'X' | 'O' | null;
export type Winner = Player | 'Draw' | null;

interface BoardProps {
  board: Player[];
  winner: Winner;
  onSquareClick: (index: number) => void;
}

export const Board: React.FC<BoardProps> = ({ board, winner, onSquareClick }) => (
  <div className="inline-block min-w-40 rounded-lg border-4 border-gray-600 bg-gray-100 p-2">
    {[0, 1, 2].map((rowIndex) => (
      <div key={rowIndex} className="flex">
        {[0, 1, 2].map((colIndex) => (
          <BoardButton
            key={colIndex}
            value={board[rowIndex * 3 + colIndex]}
            onClick={() => onSquareClick(rowIndex * 3 + colIndex)}
            disabled={!!winner || !!board[rowIndex * 3 + colIndex]}
          />
        ))}
      </div>
    ))}
  </div>
);
