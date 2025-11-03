import React from 'react';
import type { Winner } from '../Board/Board';
import { BoardIcon } from '../BoardIcon/BoardButton';

interface GameInfoProps {
  winner: Winner;
  isXNext: boolean;
}

export const GameInfo: React.FC<GameInfoProps> = ({ winner, isXNext }) => (
  <div>
    {winner ? (
      <p className="font-bold text-green-600 animate-pulse text-2xl">
        {winner === 'Draw' ? "It's a Draw!" : `Winner is: ${winner}!`}
      </p>
    ) : (
      <p className="font-bold text-2xl flex items-center gap-2">
        Next player:{' '}
        <span className="size-8 inline-block">
          <BoardIcon value={isXNext ? 'X' : 'O'} />
        </span>
      </p>
    )}
  </div>
);
