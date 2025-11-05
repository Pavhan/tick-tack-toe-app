import Button from '@/components/Button/Button';
import type { ButtonVariant } from '@/components/Button/Button';
import { InfoIcon } from '@/icons';
import { cn } from '@/lib/utils';

interface AlertProps {
  description: string;
  button: {
    text: string;
    onClick: () => void;
    variant?: ButtonVariant;
  };
}

const Alert = (props: AlertProps) => {
  const { description, button } = props;

  return (
    <div
      className={cn(
        'flex w-full flex-wrap items-center justify-between gap-2',
        'rounded border border-yellow-400 bg-yellow-50 p-3 text-yellow-800',
      )}
    >
      <div className="flex items-center gap-2">
        <span className="size-6 min-w-6">
          <InfoIcon />
        </span>
        <p className="font-medium">{description}</p>
      </div>
      <Button onClick={button.onClick} variant={button.variant}>
        {button.text}
      </Button>
    </div>
  );
};

export default Alert;
