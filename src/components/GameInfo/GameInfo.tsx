import React from 'react';
import { PlayerIcon } from '@/components/PlayerIcon/PlayerIcon';
import { getNextPlayer } from '@/lib/constants';
import type { Winner } from '@/lib/types';

interface GameInfoProps {
  winner: Winner;
  isXNext: boolean;
}

export const GameInfo: React.FC<GameInfoProps> = ({ winner, isXNext }) => (
  <div className="mb-3">
    {winner ? (
      <p className="flex items-center justify-center gap-2 text-2xl font-bold text-green-600">
        {winner === 'Draw' ? (
          "It's a Draw!"
        ) : (
          <>
            Winner is: <PlayerIcon value={winner} />
          </>
        )}
      </p>
    ) : (
      <p className="flex items-center justify-center gap-2 text-2xl font-bold">
        Next player: <PlayerIcon value={getNextPlayer(isXNext)} />
      </p>
    )}
  </div>
);
