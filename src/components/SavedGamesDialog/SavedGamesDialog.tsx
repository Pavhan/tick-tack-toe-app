import { useEffect, useRef, useState } from 'react';
import Button from '@/components/Button/Button';
import { useClickOutside } from '@/hooks/useClickOutside';
import { CloseIcon } from '@/icons';
import { deleteAllGames, deleteGame, getSavedGames } from '@/lib/savedGames';
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);

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

  useClickOutside(dialogContentRef, onClose, isOpen);

  const loadGames = () => {
    setSavedGames(getSavedGames());
  };

  const handleDeleteGame = (gameId: string) => {
    deleteGame(gameId);
    loadGames();
  };

  const handleDeleteAll = () => {
    if (savedGames.length === 0) return;

    deleteAllGames();
    loadGames();
    onClose();
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
