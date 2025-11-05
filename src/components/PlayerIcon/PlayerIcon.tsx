import { OIcon, XIcon } from '@/icons';
import { getPlayerColor } from '@/lib/constants';
import { Player } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PlayerIconProps {
  value: Player;
  className?: string;
}

const PlayerIcon = (props: PlayerIconProps) => {
  const { value, className } = props;
  return (
    <span className={cn('inline-block size-8', { [getPlayerColor(value)]: value !== null }, className)}>
      {value === Player.X && <XIcon className="h-full w-full" />}
      {value === Player.O && <OIcon className="h-full w-full" />}
    </span>
  );
};

export default PlayerIcon;
