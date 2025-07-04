import { cn } from '@tradelink/ui/lib/utils';
import * as React from 'react';

import { Input } from './input';
import { Label } from './label';

interface FormInputProps extends React.ComponentProps<'input'> {
  label?: string;
  error?: string;
  required?: boolean;
  containerClassName?: string;
  /** Custom content to render instead of the default Input */
  children?: React.ReactNode;
}

function FormInput({
  label,
  error,
  required = false,
  className,
  containerClassName,
  id,
  children,
  ...props
}: FormInputProps) {
  // Generate a unique id if not provided
  const inputId = id || React.useId();

  return (
    <div className={cn('space-y-1', containerClassName)}>
      {label && (
        <Label htmlFor={inputId} aria-required={required} className="gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      {children || <Input id={inputId} className={className} aria-invalid={!!error} {...props} />}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}

export { FormInput, type FormInputProps };
