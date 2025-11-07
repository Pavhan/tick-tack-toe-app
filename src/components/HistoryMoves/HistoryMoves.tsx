import { getPlayerColor } from '@/lib/constants';
import type { HistoryEntry } from '@/lib/types';
import { cn } from '@/lib/utils';

type HistoryMovesProps = {
  history: HistoryEntry[];
  currentHistoryIndex: number | null;
  boardSize: number;
  onHistoryClick: (index: number) => void;
};

const HistoryMoves = (props: HistoryMovesProps) => {
  const { history, currentHistoryIndex, boardSize, onHistoryClick } = props;

  const getPositionLabel = (position: number): string => {
    const row = Math.floor(position / boardSize) + 1;
    const col = (position % boardSize) + 1;
    return `(${row}, ${col})`;
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="-mx-2 grow flex-col gap-2 overflow-y-auto px-2 pb-2">
      <h3>History Moves</h3>
      <ul className="flex flex-col gap-1">
        {history.map((entry, index) => (
          <li key={index}>
            <button
              onClick={() => onHistoryClick(index)}
              title={`Go to move ${index + 1}`}
              className={cn(
                'w-full cursor-pointer rounded px-2 py-1 text-left text-xs',
                'bg-gray-100 transition-colors hover:bg-white',
                {
                  'bg-blue-100 font-semibold hover:bg-blue-200': currentHistoryIndex === index,
                },
              )}
            >
              <span className="font-medium">Move {index + 1}:</span>{' '}
              <span className={cn('font-semibold', getPlayerColor(entry.player))}>{entry.player}</span>{' '}
              <span className="text-gray-600">{getPositionLabel(entry.position)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryMoves;
