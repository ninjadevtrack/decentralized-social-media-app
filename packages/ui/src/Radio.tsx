import type { InputHTMLAttributes, ReactNode } from 'react';

import { forwardRef, useId } from 'react';

import cn from '../cn';

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  description?: ReactNode;
  heading: ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio({
  className = '',
  description,
  heading,
  ...rest
}) {
  const id = useId();

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <input
        className="text-brand-500 dark:text-brand-500 h-4 w-4 border focus:ring-0 focus:ring-offset-0"
        id={id}
        type="radio"
        {...rest}
      />
      <label htmlFor={id}>
        <div>{heading}</div>
        {description ? <div className="text-sm">{description}</div> : null}
      </label>
    </div>
  );
});
