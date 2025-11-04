import { useEffect, useRef, useState } from 'react';
import { BoardSizeSelector } from '@/components/BoardSizeSelector/BoardSizeSelector';
import { Button } from '@/components/Button/Button';
import { HistoryMoves } from '@/components/HistoryMoves/HistoryMoves';
import type { HistoryEntry } from '@/lib/types';
import { cn } from '@/lib/utils';

type RightPanelProps = {
  boardSize: number;
  board: (string | null)[];
  getWinLength: (size: number) => number;
  history: HistoryEntry[];
  currentHistoryIndex: number | null;
  isViewingHistory: boolean;
  onBoardSizeChange: (size: number) => void;
  onResetGame: () => void;
  onHistoryClick: (index: number) => void;
  onContinueGame: () => void;
};

function RightPanel({
  boardSize,
  board,
  getWinLength,
  history,
  currentHistoryIndex,
  isViewingHistory,
  onBoardSizeChange,
  onResetGame,
  onHistoryClick,
  onContinueGame,
}: RightPanelProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const asideRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (asideRef.current && !asideRef.current.contains(event.target as Node) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

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
      <div className="flex grow flex-col gap-4">
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

        <HistoryMoves
          history={history}
          currentHistoryIndex={currentHistoryIndex}
          boardSize={boardSize}
          onHistoryClick={onHistoryClick}
        />
      </div>

      {isViewingHistory && (
        <div className="rounded border border-yellow-400 bg-yellow-50 p-3">
          <p className="mb-2 text-xs text-yellow-800">Viewing History</p>
          <Button onClick={onContinueGame} variant="primary" className="w-full">
            Continue Game
          </Button>
        </div>
      )}
      <Button onClick={onResetGame} variant="primary">
        Reset Game
      </Button>
    </aside>
  );
}

export default RightPanel;
