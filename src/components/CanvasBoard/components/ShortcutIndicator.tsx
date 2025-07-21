
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ShortcutIndicatorProps {
  shortcut: string;
  className?: string;
}

export const ShortcutIndicator: React.FC<ShortcutIndicatorProps> = ({ 
  shortcut, 
  className = '' 
}) => {
  return (
    <Badge 
      variant="outline" 
      className={`text-xs px-2 py-1 rounded-md font-mono ${className}`}
    >
      {shortcut}
    </Badge>
  );
};
