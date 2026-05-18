import * as React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
  }
>(({ className, icon, iconPosition = 'left', type, ...props }, ref) => {
  return (
    <div className="relative">
      {icon && iconPosition === 'left' && (
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-dark-200 pointer-events-none">
          {icon}
        </div>
      )}
      <input
        ref={ref}
        type={type}
        className={cn(
          'w-full h-14 rounded-full bg-dark-50 text-main-font placeholder-dark-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-sm font-medium',
          icon && iconPosition === 'left' && 'pl-14 pr-5',
          icon && iconPosition === 'right' && 'pl-5 pr-14',
          !icon && 'px-5',
          className
        )}
        {...props}
      />
      {icon && iconPosition === 'right' && (
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-dark-200">
          {icon}
        </div>
      )}
    </div>
  );
});
Input.displayName = 'Input';

export { Input };
