import type { SavedGame } from './types';

const STORAGE_KEY = 'ticTacToe_savedGames';

export const getSavedGames = (): SavedGame[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveGame = (game: SavedGame): void => {
  const games = getSavedGames();
  games.unshift(game);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
};

export const deleteGame = (gameId: string): void => {
  const games = getSavedGames();
  const filteredGames = games.filter((game) => game.id !== gameId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredGames));
};

export const deleteAllGames = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
