import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Keyboard, ChevronUp } from 'lucide-react';
import { ShortcutsPanel } from './ShortcutsPanel';

interface ShortcutsStatusBarProps {
  className?: string;
}

export const ShortcutsStatusBar: React.FC<ShortcutsStatusBarProps> = ({ 
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 px-3 bg-muted/50 hover:bg-muted ${className}`}
        >
          <Keyboard className="w-4 h-4 mr-2" />
          <span className="text-xs">اختصارات</span>
          <ChevronUp className={`w-3 h-3 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        side="top" 
        align="center"
        className="w-auto p-0 border-none shadow-lg"
        sideOffset={8}
      >
        <ShortcutsPanel />
      </PopoverContent>
    </Popover>
  );
};