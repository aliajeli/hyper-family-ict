'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { forwardRef } from 'react';

const Checkbox = forwardRef(({
  className,
  label,
  checked = false,
  onChange,
  disabled = false,
  ...props
}, ref) => {
  return (
    <label className={cn(
      'inline-flex items-center gap-2 cursor-pointer',
      disabled && 'opacity-50 cursor-not-allowed',
      className
    )}>
      <div className="relative">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div className={cn(
          'w-5 h-5 rounded border-2 transition-all duration-200',
          'flex items-center justify-center',
          checked
            ? 'bg-accent border-accent'
            : 'bg-bg-secondary border-border hover:border-accent'
        )}>
          {checked && <Check className="w-3 h-3 text-white" />}
        </div>
      </div>
      {label && (
        <span className="text-sm text-text-secondary select-none">
          {label}
        </span>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;