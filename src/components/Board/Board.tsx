import React from 'react';
import { BoardButton } from '@/components/BoardButton/BoardButton';
import type { Player, Winner } from '@/lib/types';

interface BoardProps {
  board: Player[];
  boardSize: number;
  winner: Winner;
  isViewingHistory: boolean;
  highlightedPosition?: number | null;
  onSquareClick: (index: number) => void;
}

export const Board: React.FC<BoardProps> = ({
  board,
  boardSize,
  winner,
  isViewingHistory,
  highlightedPosition,
  onSquareClick,
}) => (
  <div className="max-w-full overflow-auto rounded-lg border-4 border-gray-600 bg-gray-100 p-2">
    {Array.from({ length: boardSize }, (_, rowIndex) => (
      <div key={rowIndex} className="flex">
        {Array.from({ length: boardSize }, (_, colIndex) => {
          const index = rowIndex * boardSize + colIndex;
          return (
            <BoardButton
              key={colIndex}
              value={board[index]}
              onClick={() => onSquareClick(index)}
              disabled={!!winner || !!board[index]}
              isHighlighted={highlightedPosition === index}
              isViewingHistory={isViewingHistory}
            />
          );
        })}
      </div>
    ))}
  </div>
);
