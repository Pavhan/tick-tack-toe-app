import React from 'react';
import { BoardButton } from '../BoardButton/BoardButton';

export type Player = 'X' | 'O' | null;
export type Winner = Player | 'Draw' | null;

interface BoardProps {
  board: Player[];
  winner: Winner;
  onSquareClick: (index: number) => void;
}

export const Board: React.FC<BoardProps> = ({ board, winner, onSquareClick }) => {
  return (
    <div className="border-gray-600 border-4 rounded-lg bg-gray-100 p-2 min-w-40 inline-block">
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
};
