import React from 'react';

type Player = 'X' | 'O' | null;

interface GameInfoProps {
  winner: Player | 'Draw' | null;
  isXNext: boolean;
}

export const GameInfo: React.FC<GameInfoProps> = ({ winner, isXNext }) => {
  return (
    <div>
      {winner ? (
        <p className="font-weight-bold text-green-600 animate-pulse text-2xl">
          {winner === 'Draw' ? "It's a Draw!" : `Winner: ${winner}!`}
        </p>
      ) : (
        <p className="font-weight-bold text-2xl">Next player: {isXNext ? 'X' : 'O'}</p>
      )}
    </div>
  );
};
