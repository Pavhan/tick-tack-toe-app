import { useEffect, useRef, useState } from 'react';
import { BoardSizeSelector } from '@/components/BoardSizeSelector/BoardSizeSelector';
import { Button } from '@/components/Button/Button';
import { cn } from '@/lib/utils';

type RightPanelProps = {
  boardSize: number;
  board: (string | null)[];
  getWinLength: (size: number) => number;
  onBoardSizeChange: (size: number) => void;
  onResetGame: () => void;
};

function RightPanel({ boardSize, board, getWinLength, onBoardSizeChange, onResetGame }: RightPanelProps) {
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
      <Button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        variant="secondary"
        className="absolute -left-4 z-60 -translate-x-full md:hidden"
      >
        {isMenuOpen ? 'Close' : 'Menu'}
      </Button>
      <BoardSizeSelector
        boardSize={boardSize}
        winLength={getWinLength(boardSize)}
        disabled={board.some((square) => square !== null)}
        onSizeChange={onBoardSizeChange}
      />
      <Button onClick={onResetGame} variant="primary">
        Reset Game
      </Button>
    </aside>
  );
}

export default RightPanel;
