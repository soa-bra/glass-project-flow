import React from 'react';
import { cn } from '@/lib/utils';
import { useInputClasses, useDesignTokens } from '@/hooks/useDesignTokens';

export interface UnifiedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const UnifiedInput: React.FC<UnifiedInputProps> = ({
  label,
  error,
  icon,
  iconPosition = 'right',
  fullWidth = true,
  className,
  id,
  ...props
}) => {
  const inputClasses = useInputClasses('input', !!error);
  const { classes } = useDesignTokens();
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn('space-y-2', fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={inputId} className={classes.label}>
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          id={inputId}
          className={cn(
            inputClasses,
            icon && iconPosition === 'right' && 'pr-12',
            icon && iconPosition === 'left' && 'pl-12',
            className
          )}
          {...props}
        />
        
        {icon && (
          <div className={cn(
            'absolute top-1/2 -translate-y-1/2 w-5 h-5 text-black/60',
            iconPosition === 'right' ? 'right-4' : 'left-4'
          )}>
            {icon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-red-500 text-sm font-arabic text-right">
          {error}
        </p>
      )}
    </div>
  );
};

// مكون للنصوص المتعددة الأسطر
export interface UnifiedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  rows?: number;
}

export const UnifiedTextarea: React.FC<UnifiedTextareaProps> = ({
  label,
  error,
  fullWidth = true,
  rows = 4,
  className,
  id,
  ...props
}) => {
  const textareaClasses = useInputClasses('textarea', !!error);
  const { classes } = useDesignTokens();
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn('space-y-2', fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={textareaId} className={classes.label}>
          {label}
        </label>
      )}
      
      <textarea
        id={textareaId}
        rows={rows}
        className={cn(textareaClasses, className)}
        {...props}
      />
      
      {error && (
        <p className="text-red-500 text-sm font-arabic text-right">
          {error}
        </p>
      )}
    </div>
  );
};

// مكون للقوائم المنسدلة
export interface UnifiedSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  fullWidth?: boolean;
}

export const UnifiedSelect: React.FC<UnifiedSelectProps> = ({
  label,
  error,
  options,
  placeholder,
  fullWidth = true,
  className,
  id,
  ...props
}) => {
  const selectClasses = useInputClasses('select', !!error);
  const { classes } = useDesignTokens();
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn('space-y-2', fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={selectId} className={classes.label}>
          {label}
        </label>
      )}
      
      <select
        id={selectId}
        className={cn(selectClasses, className)}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="text-red-500 text-sm font-arabic text-right">
          {error}
        </p>
      )}
    </div>
  );
};

export default UnifiedInput;