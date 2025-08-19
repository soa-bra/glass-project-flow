import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useDirection } from '@/contexts/direction-context';
import { cn } from '@/lib/utils';

interface DirectionalIconProps {
  icon: LucideIcon;
  className?: string;
  flipInRTL?: boolean;
  size?: number;
  [key: string]: any;
}

// Icons that should be flipped in RTL
const RTL_SENSITIVE_ICONS = new Set([
  'ArrowLeft',
  'ArrowRight', 
  'ChevronLeft',
  'ChevronRight',
  'ChevronsLeft',
  'ChevronsRight',
  'SkipBack',
  'SkipForward',
  'Play',
  'FastForward',
  'Rewind',
  'StepForward',
  'StepBack',
  'TrendingUp',
  'TrendingDown',
  'CornerDownLeft',
  'CornerDownRight',
  'CornerUpLeft',
  'CornerUpRight',
  'CornerLeftDown',
  'CornerRightDown',
  'CornerLeftUp',
  'CornerRightUp',
  'MoveLeft',
  'MoveRight',
  'ArrowBigLeft',
  'ArrowBigRight',
  'ArrowUpLeft',
  'ArrowUpRight',
  'ArrowDownLeft', 
  'ArrowDownRight'
]);

export function DirectionalIcon({ 
  icon: Icon, 
  className, 
  flipInRTL = true, 
  ...props 
}: DirectionalIconProps) {
  const { isRTL } = useDirection();
  
  // Check if this icon should be flipped
  const shouldFlip = flipInRTL && isRTL && RTL_SENSITIVE_ICONS.has(Icon.displayName || Icon.name || '');
  
  return (
    <Icon 
      className={cn(
        shouldFlip && 'scale-x-[-1]',
        className
      )} 
      {...props} 
    />
  );
}

// Convenience components for common directional icons
export function ChevronStart({ className, ...props }: Omit<DirectionalIconProps, 'icon'>) {
  const { isRTL } = useDirection();
  const Icon = isRTL ? require('lucide-react').ChevronRight : require('lucide-react').ChevronLeft;
  return <Icon className={className} {...props} />;
}

export function ChevronEnd({ className, ...props }: Omit<DirectionalIconProps, 'icon'>) {
  const { isRTL } = useDirection();
  const Icon = isRTL ? require('lucide-react').ChevronLeft : require('lucide-react').ChevronRight;
  return <Icon className={className} {...props} />;
}

export function ArrowStart({ className, ...props }: Omit<DirectionalIconProps, 'icon'>) {
  const { isRTL } = useDirection();
  const Icon = isRTL ? require('lucide-react').ArrowRight : require('lucide-react').ArrowLeft;
  return <Icon className={className} {...props} />;
}

export function ArrowEnd({ className, ...props }: Omit<DirectionalIconProps, 'icon'>) {
  const { isRTL } = useDirection();
  const Icon = isRTL ? require('lucide-react').ArrowLeft : require('lucide-react').ArrowRight;
  return <Icon className={className} {...props} />;
}