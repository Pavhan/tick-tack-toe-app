import { useEffect, useRef, useState } from 'react';
import { gameService } from '@/api/gameService';
import { transformBackendGameToSavedGame } from '@/api/transformers';
import Button from '@/components/Button';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useGames } from '@/hooks/useGames';
import { CloseIcon } from '@/icons';
import type { SavedGame } from '@/lib/types';
import { cn } from '@/lib/utils';
import SavedGameItem from './SavedGameItem';

type SavedGamesDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoadGame: (game: SavedGame) => void;
  refreshKey: number;
};

const SavedGamesDialog = (props: SavedGamesDialogProps) => {
  const { isOpen, onClose, onLoadGame, refreshKey } = props;
  const [savedGames, setSavedGames] = useState<SavedGame[]>([]);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const { games, fetchGames } = useGames();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      loadGames();
    } else {
      dialog.close();
    }
  }, [isOpen, refreshKey]);

  useClickOutside({ ref: dialogContentRef, handler: onClose, enabled: isOpen });

  const loadGames = async () => {
    setError(null);
    await fetchGames({ status: 'completed' });
  };

  useEffect(() => {
    if (games.length > 0) {
      const fetchFullGames = async () => {
        try {
          const fullGames = await Promise.all(
            games.map(async (game) => {
              try {
                const response = await gameService.getGameWithMoves(game.id);
                return transformBackendGameToSavedGame(response.data);
              } catch (err) {
                setError(`Failed to load saved games: ${err instanceof Error ? err.message : String(err)}`);
              }
            }),
          );
          setSavedGames(fullGames.filter((g): g is SavedGame => g !== null));
          setError(null);
        } catch (err) {
          setError(`Failed to load saved games: ${err instanceof Error ? err.message : String(err)}`);
        }
      };
      fetchFullGames();
    } else {
      setSavedGames([]);
    }
  }, [games]);

  const handleDeleteGame = async (gameId: string) => {
    try {
      setError(null);
      await gameService.deleteGame(Number(gameId));
      await loadGames();
    } catch (err) {
      setError(`Failed to delete game: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleDeleteAll = async () => {
    if (savedGames.length === 0) return;

    try {
      setError(null);
      await Promise.all(savedGames.map((game) => gameService.deleteGame(Number(game.id))));
      await loadGames();
      onClose();
    } catch (err) {
      setError(`Failed to delete all games: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleLoadGame = (game: SavedGame) => {
    onLoadGame(game);
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={cn(
        'fixed top-1/2 left-1/2 w-3xl max-w-full -translate-x-1/2 -translate-y-1/2 p-3',
        'bg-transparent backdrop:bg-black/50 backdrop:backdrop-blur-xs',
      )}
    >
      <div ref={dialogContentRef} className="rounded-lg bg-white p-0 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-3">
          <h3>Saved Games</h3>
          <button
            onClick={onClose}
            type="button"
            className="cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="max-h-[calc(100vh-150px)] grow overflow-y-auto p-3">
          {error && (
            <div className="mb-3">
              <ErrorMessage message={error} onRetry={loadGames} />
            </div>
          )}

          {savedGames.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-gray-500">No saved games yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {savedGames.map((game) => (
                <SavedGameItem key={game.id} game={game} onDeleteGame={handleDeleteGame} onLoadGame={handleLoadGame} />
              ))}
            </div>
          )}
        </div>

        {savedGames.length > 0 && (
          <div className="flex items-center justify-center border-t border-gray-200 p-3">
            <Button onClick={handleDeleteAll} variant="danger">
              Delete All
            </Button>
          </div>
        )}
      </div>
    </dialog>
  );
};

export default SavedGamesDialog;
