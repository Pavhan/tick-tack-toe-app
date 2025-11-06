import { OIcon, XIcon } from '@/icons';
import { getPlayerColor } from '@/lib/constants';
import { PlayerValues } from '@/lib/types';
import type { BoardCell } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PlayerIconProps {
  value: BoardCell;
  className?: string;
}

const PlayerIcon = (props: PlayerIconProps) => {
  const { value, className } = props;

  return (
    <span className={cn('inline-block size-8', { [getPlayerColor(value)]: value !== null }, className)}>
      {value === PlayerValues.X && <XIcon className="h-full w-full" />}
      {value === PlayerValues.O && <OIcon className="h-full w-full" />}
    </span>
  );
};

export default PlayerIcon;
