import React from 'react';
import { Languages } from 'lucide-react';
import { Button } from './button';
import { useDirection } from '@/contexts/direction-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { cn } from '@/lib/utils';

interface DirectionToggleProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  showText?: boolean;
}

export function DirectionToggle({ 
  variant = 'outline', 
  size = 'default',
  className,
  showText = false 
}: DirectionToggleProps) {
  const { direction, setDirection } = useDirection();

  const directions = [
    {
      value: 'rtl' as const,
      label: 'العربية',
      shortLabel: 'ع',
    },
    {
      value: 'ltr' as const,
      label: 'English',
      shortLabel: 'EN',
    },
  ];

  const currentDirection = directions.find(d => d.value === direction);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          className={cn("gap-2", className)}
        >
          <Languages className="h-4 w-4" />
          {showText && (
            <span className="hidden sm:inline">
              {currentDirection?.label}
            </span>
          )}
          <span className="sm:hidden">
            {currentDirection?.shortLabel}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {directions.map((dir) => (
          <DropdownMenuItem
            key={dir.value}
            onClick={() => setDirection(dir.value)}
            className={cn(
              "cursor-pointer",
              direction === dir.value && "bg-accent"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{dir.label}</span>
              {direction === dir.value && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Simple toggle button (no dropdown)
export function DirectionToggleButton({ 
  variant = 'outline', 
  size = 'default',
  className 
}: Omit<DirectionToggleProps, 'showText'>) {
  const { direction, toggleDirection } = useDirection();

  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={toggleDirection}
      className={cn("gap-2", className)}
      title={direction === 'rtl' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <Languages className="h-4 w-4" />
      <span className="text-sm font-medium">
        {direction === 'rtl' ? 'ع' : 'EN'}
      </span>
    </Button>
  );
}