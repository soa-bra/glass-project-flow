import React from 'react';
import { cn } from '@/lib/utils';
import { useToggleClasses } from '@/hooks/useDesignTokens';

export interface ToggleOption {
  value: string;
  label: string;
}

export interface UnifiedToggleProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  fullWidth?: boolean;
  className?: string;
}

export const UnifiedToggle: React.FC<UnifiedToggleProps> = ({
  options,
  value,
  onChange,
  label,
  fullWidth = false,
  className
}) => {
  const { container, button } = useToggleClasses();

  return (
    <div className={cn('space-y-2', fullWidth && 'w-full')}>
      {label && (
        <label className="font-bold text-black font-arabic mb-2 block">
          {label}
        </label>
      )}
      
      <div className={cn(container, className)}>
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={button(value === option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// مكون للتبديل الثنائي (مثل نعم/لا)
export interface BinaryToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  trueLabel?: string;
  falseLabel?: string;
  label?: string;
  fullWidth?: boolean;
  className?: string;
}

export const BinaryToggle: React.FC<BinaryToggleProps> = ({
  value,
  onChange,
  trueLabel = "نعم",
  falseLabel = "لا",
  label,
  fullWidth = false,
  className
}) => {
  const options: ToggleOption[] = [
    { value: 'true', label: trueLabel },
    { value: 'false', label: falseLabel }
  ];

  const handleChange = (newValue: string) => {
    onChange(newValue === 'true');
  };

  return (
    <UnifiedToggle
      options={options}
      value={value ? 'true' : 'false'}
      onChange={handleChange}
      label={label}
      fullWidth={fullWidth}
      className={className}
    />
  );
};

export default UnifiedToggle;