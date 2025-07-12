import React from 'react';

interface ShortcutIndicatorProps {
  shortcut: string;
  className?: string;
}

export const ShortcutIndicator: React.FC<ShortcutIndicatorProps> = ({ 
  shortcut, 
  className = "" 
}) => {
  return (
    <span 
      className={`
        inline-flex items-center justify-center
        min-w-[1.5rem] h-6 px-2
        text-xs font-medium
        bg-muted/80 text-muted-foreground
        border border-border/50 rounded-md
        ${className}
      `}
    >
      {shortcut}
    </span>
  );
};