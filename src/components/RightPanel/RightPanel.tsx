import { useRef, useState } from 'react';
import BoardSizeSelector from '@/components/BoardSizeSelector';
import Button from '@/components/Button';
import HistoryMoves from '@/components/HistoryMoves';
import { useClickOutside } from '@/hooks/useClickOutside';
import type { BoardCell, HistoryEntry, Winner } from '@/lib/types';
import { cn } from '@/lib/utils';

type RightPanelProps = {
  boardSize: number;
  board: BoardCell[];
  getWinLength: (size: number) => number;
  history: HistoryEntry[];
  currentHistoryIndex: number | null;
  winner: Winner;
  onBoardSizeChange: (size: number) => void;
  onResetGame: () => void;
  onHistoryClick: (index: number) => void;
  onOpenSavedGames: () => void;
};

const RightPanel = (props: RightPanelProps) => {
  const {
    boardSize,
    board,
    getWinLength,
    history,
    currentHistoryIndex,
    winner,
    onBoardSizeChange,
    onResetGame,
    onHistoryClick,
    onOpenSavedGames,
  } = props;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const asideRef = useRef<HTMLElement>(null);

  useClickOutside({ ref: asideRef, handler: () => setIsMenuOpen(false), enabled: isMenuOpen });

  return (
    <aside
      ref={asideRef}
      className={cn(
        'fixed top-0 right-0 bottom-0 z-50 flex w-52 flex-col gap-4 p-4 transition-transform',
        'border-t border-l border-gray-300 bg-neutral-200',
        'md:translate-x-0 md:border-t-0',
        {
          'translate-x-0': isMenuOpen,
          'translate-x-full': !isMenuOpen,
        },
      )}
    >
      <div className="flex max-h-[calc(100vh-80px)] grow flex-col space-y-4 divide-y divide-gray-300">
        <div className="flex flex-col gap-4 pb-4">
          <Button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            variant="secondary"
            className="absolute -left-4 z-60 -translate-x-full md:hidden"
          >
            {isMenuOpen ? 'Close' : 'Settings'}
          </Button>
          <BoardSizeSelector
            boardSize={boardSize}
            winLength={getWinLength(boardSize)}
            disabled={board.some((square) => square !== null)}
            onSizeChange={onBoardSizeChange}
          />

          <Button onClick={onResetGame} variant={winner ? 'primary' : 'danger'}>
            {winner ? 'New Game' : 'Reset Game'}
          </Button>
        </div>

        <HistoryMoves
          history={history}
          currentHistoryIndex={currentHistoryIndex}
          boardSize={boardSize}
          onHistoryClick={onHistoryClick}
        />
      </div>

      <Button onClick={onOpenSavedGames} variant="secondary" className="w-full">
        View Saved Games
      </Button>
    </aside>
  );
};

export default RightPanel;
