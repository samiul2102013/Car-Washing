import * as React from 'react';
import { cn } from '../../lib/utils';

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'default' | 'sm' | 'lg';
  }
>(({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
        {
          'bg-main-font text-white shadow-[0px_6.03px_24.59px_16.59px_rgba(0,0,0,0.12)] hover:bg-main-font/90':
            variant === 'primary',
          'bg-transparent border border-dark-100 text-dark-300 hover:bg-dark-50':
            variant === 'outline',
          'bg-transparent text-main-font hover:bg-dark-50':
            variant === 'ghost',
        },
        {
          'h-14 px-12 text-sm': size === 'default',
          'h-10 px-6 text-xs': size === 'sm',
          'h-16 px-16 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = 'Button';

export { Button };
