import type { MouseEvent, ReactNode } from 'react';
import { cn } from '@/lib/utils';

const _ButtonVariantValues = {
  Primary: 'primary',
  Secondary: 'secondary',
  Danger: 'danger',
} as const;

export type ButtonVariant = (typeof _ButtonVariantValues)[keyof typeof _ButtonVariantValues];

interface ButtonProps {
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: ButtonVariant;
  className?: string;
}

const Button = (props: ButtonProps) => {
  const { children, onClick, type = 'button', disabled = false, variant = 'primary', className } = props;
  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'border-1 border-gray-300 bg-white text-gray-700 hover:bg-gray-200',
    danger: 'bg-red-700 text-white hover:bg-red-800',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'cursor-pointer rounded px-3 py-1.5 text-xs font-medium transition-colors',
        'disabled:pointer-events-none disabled:opacity-50',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
