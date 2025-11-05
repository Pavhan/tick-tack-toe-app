import { useCallback, useState } from 'react';
import { gameService } from '@/api/gameService';
import type { ApiError, GameStatus, GameWinner, Player } from '@/lib/types';

export const useGame = () => {
  const [error, setError] = useState<string | null>(null);

  const createGame = useCallback(async (boardSize: number) => {
    setError(null);

    try {
      const response = await gameService.createGame(boardSize);
      return response.data.id;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Failed to create game');
      return null;
    }
  }, []);

  const addMove = useCallback(async (gameId: number, position: number, player: Player) => {
    try {
      await gameService.addMove(gameId, position, player);
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Failed to add move');
      return false;
    }
  }, []);

  const updateGame = useCallback(
    async (
      gameId: number,
      updates: {
        status?: GameStatus;
        winner?: GameWinner | null;
      },
    ) => {
      try {
        await gameService.updateGame(gameId, updates);
        return true;
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.error?.message || 'Failed to update game');
        return false;
      }
    },
    [],
  );

  return {
    error,
    createGame,
    addMove,
    updateGame,
    clearError: () => setError(null),
  };
};
