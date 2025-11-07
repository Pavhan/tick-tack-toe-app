import type {
  ApiResponse,
  BackendGame,
  BackendGameListItem,
  BackendGameWithMoves,
  BackendMove,
  GameStatus,
  GameWinner,
  Player,
} from '@/lib/types';
import { apiClient } from './client';

export const gameService = {
  // Get all games
  async getGames(params?: { status?: GameStatus }): Promise<ApiResponse<BackendGameListItem[]>> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);

    const queryString = query.toString();
    const endpoint = queryString ? `/api/games?${queryString}` : '/api/games';

    return apiClient.get(endpoint);
  },

  // Create new game
  async createGame(boardSize: number = 3): Promise<ApiResponse<BackendGame>> {
    return apiClient.post<ApiResponse<BackendGame>>('/api/games', {
      board_size: boardSize,
    });
  },

  // Get game by ID
  async getGame(gameId: number): Promise<ApiResponse<BackendGame>> {
    return apiClient.get<ApiResponse<BackendGame>>(`/api/games/${gameId}`);
  },

  // Get game with all moves
  async getGameWithMoves(gameId: number): Promise<ApiResponse<BackendGameWithMoves>> {
    return apiClient.get<ApiResponse<BackendGameWithMoves>>(`/api/games/${gameId}/full`);
  },

  // Update game
  async updateGame(
    gameId: number,
    updates: {
      status?: GameStatus;
      winner?: GameWinner | null;
      current_player?: Player;
    },
  ): Promise<ApiResponse<BackendGame>> {
    return apiClient.patch<ApiResponse<BackendGame>>(`/api/games/${gameId}`, updates);
  },

  // Delete game
  async deleteGame(gameId: number): Promise<ApiResponse<null>> {
    return apiClient.delete<ApiResponse<null>>(`/api/games/${gameId}`);
  },

  // Add move to game
  async addMove(gameId: number, position: number, player: Player): Promise<ApiResponse<BackendMove>> {
    return apiClient.post<ApiResponse<BackendMove>>(`/api/games/${gameId}/moves`, {
      position,
      player,
    });
  },

  // Get moves for a game
  async getMoves(gameId: number): Promise<ApiResponse<BackendMove[]>> {
    return apiClient.get<ApiResponse<BackendMove[]>>(`/api/games/${gameId}/moves`);
  },
};
