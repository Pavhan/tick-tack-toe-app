import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/Button/Button';
import { PlayerIcon } from '@/components/PlayerIcon/PlayerIcon';
import { useClickOutside } from '@/hooks/useClickOutside';
import { CloseIcon } from '@/icons';
import { getPlayerBorderColor, getPlayerTransparentBackground } from '@/lib/constants';
import { deleteAllGames, deleteGame, getSavedGames } from '@/lib/savedGames';
import type { SavedGame } from '@/lib/types';
import { cn, formatDate } from '@/lib/utils';

type SavedGamesDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoadGame: (game: SavedGame) => void;
  refreshKey: number;
};

export function SavedGamesDialog({ isOpen, onClose, onLoadGame, refreshKey }: SavedGamesDialogProps) {
  const [savedGames, setSavedGames] = useState<SavedGame[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);

  const handleDeleteGame = (gameId: string) => {
    deleteGame(gameId);
    setSavedGames([]);
  };

  const handleDeleteAll = () => {
    if (savedGames.length === 0) return;

    deleteAllGames();
    setSavedGames([]);
    onClose();
  };

  const handleLoadGame = (game: SavedGame) => {
    onLoadGame(game);
    onClose();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      setSavedGames(getSavedGames());
    } else {
      dialog.close();
    }
  }, [isOpen, refreshKey]);

  useClickOutside(dialogContentRef, onClose, isOpen);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={cn(
        'fixed top-1/2 left-1/2 w-3xl max-w-full -translate-x-1/2 -translate-y-1/2',
        'rounded-lg p-0 shadow-xl backdrop:bg-black/50 backdrop:backdrop-blur-xs',
      )}
    >
      <div ref={dialogContentRef}>
        <div className="flex items-center justify-between border-b border-gray-200 p-3">
          <h3>Saved Games</h3>
          <button onClick={onClose} className="cursor-pointer text-gray-400 transition-colors hover:text-gray-600">
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
              {savedGames.map((game) => {
                if (!game.winner || game.winner === 'Draw') return null;

                return (
                  <div
                    key={game.id}
                    className={cn(
                      'flex flex-col gap-2 rounded-lg border py-1 pr-1 pl-3',
                      getPlayerBorderColor(game.winner),
                      getPlayerTransparentBackground(game.winner),
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm">
                        Winner is: <PlayerIcon value={game.winner} className="size-4" />
                        <span className="text-xs text-gray-500">({formatDate(game.timestamp)})</span>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={() => handleLoadGame(game)} variant="primary">
                          Load
                        </Button>
                        <Button onClick={() => handleDeleteGame(game.id)} variant="danger">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
}
