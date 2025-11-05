import { useCallback, useState } from 'react';
import { gameService } from '@/api/gameService';
import type { ApiError, BackendGameListItem, GameStatus } from '@/lib/types';

export const useGames = () => {
  const [games, setGames] = useState<BackendGameListItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async (params?: { status?: GameStatus }) => {
    try {
      const response = await gameService.getGames(params);
      setGames(response.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error?.message || 'Failed to add move');
      return false;
    }
  }, []);

  return {
    games,
    error,
    fetchGames,
  };
};
