import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface UnifiedActionButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
  variant?: 'view' | 'edit' | 'delete' | 'download' | 'share';
  size?: 'sm' | 'md';
  className?: string;
  disabled?: boolean;
}

export const UnifiedActionButton: React.FC<UnifiedActionButtonProps> = ({
  children,
  onClick,
  icon: Icon,
  variant = 'view',
  size = 'sm',
  className = '',
  disabled = false
}) => {
  const variantClasses = {
    view: 'bg-transparent border border-black text-black hover:bg-white/20',
    edit: 'bg-transparent border border-black text-black hover:bg-white/20',
    delete: 'bg-transparent border border-red-600 text-red-600 hover:bg-red-50',
    download: 'bg-transparent border border-green-600 text-green-600 hover:bg-green-50',
    share: 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50'
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-full flex items-center justify-center transition-all duration-300 font-arabic',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {Icon && <Icon className={iconSizes[size]} />}
      {children}
    </button>
  );
};