'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';

const buttonVariants = {
  primary: 'bg-accent hover:bg-accent-hover text-white',
  secondary: 'bg-bg-tertiary hover:bg-bg-hover text-text-primary border border-border',
  danger: 'bg-error hover:bg-error/80 text-white',
  success: 'bg-success hover:bg-success/80 text-white',
  ghost: 'hover:bg-bg-hover text-text-secondary hover:text-text-primary',
  outline: 'border border-border hover:bg-bg-hover text-text-primary',
};

const buttonSizes = {
  sm: 'px-2.5 py-1 text-xs h-7', // Compact
  md: 'px-3 py-1.5 text-sm h-9', // Standard
  lg: 'px-5 py-2.5 text-base h-11',
  icon: 'p-1.5 h-8 w-8',
};

const Button = forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  children,
  leftIcon,
  rightIcon,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-primary',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : leftIcon ? (
        <span className="w-4 h-4">{leftIcon}</span>
      ) : null}
      {children}
      {rightIcon && !isLoading && <span className="w-4 h-4">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;