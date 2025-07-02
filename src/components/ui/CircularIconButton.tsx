import React from 'react';
import { LucideIcon } from 'lucide-react';
interface CircularIconButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'subtle';
  disabled?: boolean;
  className?: string;
}
export const CircularIconButton: React.FC<CircularIconButtonProps> = ({
  icon: Icon,
  onClick,
  size = 'md',
  variant = 'default',
  disabled = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };
  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20
  };
  const variantClasses = {
    default: 'bg-white/60 hover:bg-white/80 border border-white/40',
    subtle: 'bg-white/20 hover:bg-white/30 border border-white/20'
  };
  return;
};