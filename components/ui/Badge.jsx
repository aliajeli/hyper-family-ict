'use client';

import { cn } from '@/lib/utils';

const badgeVariants = {
  default: 'bg-bg-tertiary text-text-secondary',
  primary: 'bg-accent/20 text-accent',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
  error: 'bg-error/20 text-error',
  info: 'bg-info/20 text-info',
};

const Badge = ({
  children,
  variant = 'default',
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

// این خط حتماً باید باشد
export default Badge;