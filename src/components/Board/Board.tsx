import React from 'react';
import { BoardButton } from '@/components/BoardButton/BoardButton';

export type Player = 'X' | 'O' | null;
export type Winner = Player | 'Draw' | null;

interface BoardProps {
  board: Player[];
  boardSize: number;
  winner: Winner;
  onSquareClick: (index: number) => void;
}

export const Board: React.FC<BoardProps> = ({ board, boardSize, winner, onSquareClick }) => (
  <div className="rounded-lg border-4 border-gray-600 bg-gray-100 p-2">
    {Array.from({ length: boardSize }, (_, rowIndex) => (
      <div key={rowIndex} className="flex">
        {Array.from({ length: boardSize }, (_, colIndex) => (
          <BoardButton
            key={colIndex}
            value={board[rowIndex * boardSize + colIndex]}
            onClick={() => onSquareClick(rowIndex * boardSize + colIndex)}
            disabled={!!winner || !!board[rowIndex * boardSize + colIndex]}
          />
        ))}
      </div>
    ))}
  </div>
);
