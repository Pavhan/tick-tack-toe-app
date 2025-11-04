import React from 'react';
import { Button } from '@/components/Button/Button';
import { cn } from '@/lib/utils';

const MIN_BOARD_SIZE = 3;
const MAX_BOARD_SIZE = 10;

interface BoardSizeSelectorProps {
  boardSize: number;
  winLength: number;
  disabled: boolean;
  onSizeChange: (size: number) => void;
}

export const BoardSizeSelector: React.FC<BoardSizeSelectorProps> = ({
  boardSize,
  winLength,
  disabled,
  onSizeChange,
}) => {
  return (
    <div>
      <h3>
        Board Size: {boardSize}x{boardSize}
      </h3>
      <p className="mb-3 text-sm">(win with {winLength} in a row)</p>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: MAX_BOARD_SIZE - MIN_BOARD_SIZE + 1 }, (_, i) => MIN_BOARD_SIZE + i).map((size) => (
          <Button
            key={size}
            onClick={() => onSizeChange(size)}
            disabled={disabled}
            variant="secondary"
            className={cn('w-10 px-0', {
              'border-blue-600 bg-blue-600 text-white hover:bg-blue-600': boardSize === size,
            })}
          >
            {size}
          </Button>
        ))}
      </div>
    </div>
  );
};
