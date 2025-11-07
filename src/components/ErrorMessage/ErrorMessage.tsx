import Button from '@/components/Button';
import { cn } from '@/lib/utils';

type ErrorMessageProps = {
  message: string;
  onRetry?: () => void;
};

export const ErrorMessage = (props: ErrorMessageProps) => {
  const { message, onRetry } = props;

  return (
    <div
      className={cn(
        'flex w-full flex-wrap items-center justify-between gap-2',
        'border-red-20 rounded border bg-red-50 p-3 text-red-800',
      )}
    >
      <p className="text-sm">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="danger">
          Try again
        </Button>
      )}
    </div>
  );
};
