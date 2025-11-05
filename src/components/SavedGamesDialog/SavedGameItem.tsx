import Button from '@/components/Button';
import PlayerIcon from '@/components/PlayerIcon';
import { getPlayerBorderColor, getPlayerTransparentBackground } from '@/lib/constants';
import type { SavedGame } from '@/lib/types';
import { cn, formatDate } from '@/lib/utils';

type SavedGameItemProps = {
  game: SavedGame;
  onDeleteGame: (gameId: string) => void;
  onLoadGame: (game: SavedGame) => void;
};

const SavedGameItem = (props: SavedGameItemProps) => {
  const { game, onDeleteGame, onLoadGame } = props;

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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-sm">
          Winner is: <PlayerIcon value={game.winner} className="size-4" />
          <span className="text-xs text-gray-500">({formatDate(game.timestamp)})</span>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => onLoadGame(game)} variant="primary">
            Load
          </Button>
          <Button onClick={() => onDeleteGame(game.id)} variant="danger">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SavedGameItem;
