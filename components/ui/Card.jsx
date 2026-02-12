'use client';

import { cn } from '@/lib/utils';

const Card = ({
  children,
  className,
  hover = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-bg-card rounded-xl border border-border',
        'p-4',
        hover && 'card-hover cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className }) => (
  <div className={cn('mb-4', className)}>
    {children}
  </div>
);

const CardTitle = ({ children, className }) => (
  <h3 className={cn('text-lg font-semibold text-text-primary', className)}>
    {children}
  </h3>
);

const CardDescription = ({ children, className }) => (
  <p className={cn('text-sm text-text-secondary mt-1', className)}>
    {children}
  </p>
);

const CardContent = ({ children, className }) => (
  <div className={cn('', className)}>
    {children}
  </div>
);

const CardFooter = ({ children, className }) => (
  <div className={cn('mt-4 pt-4 border-t border-border', className)}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;