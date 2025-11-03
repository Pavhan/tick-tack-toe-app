import React from 'react';
import type { Winner } from '@/components/Board/Board';
import { BoardIcon } from '@/components/BoardIcon/BoardButton';

interface GameInfoProps {
  winner: Winner;
  isXNext: boolean;
}

export const GameInfo: React.FC<GameInfoProps> = ({ winner, isXNext }) => (
  <div>
    {winner ? (
      <p className="animate-pulse text-2xl font-bold text-green-600">
        {winner === 'Draw' ? "It's a Draw!" : `Winner is: ${winner}!`}
      </p>
    ) : (
      <p className="flex items-center gap-2 text-2xl font-bold">
        Next player:{' '}
        <span className="inline-block size-8">
          <BoardIcon value={isXNext ? 'X' : 'O'} />
        </span>
      </p>
    )}
  </div>
);
