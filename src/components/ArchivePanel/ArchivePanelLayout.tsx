import React from 'react';
import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ArchivePanelLayoutProps {
  children: React.ReactNode;
}

export const ArchivePanelLayout: React.FC<ArchivePanelLayoutProps> = ({ children }) => {
  return (
    <AppCardSurface density="standard" overflow="hidden" className="h-full">
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full w-full">
            {children}
          </ScrollArea>
        </div>
      </div>
    </AppCardSurface>
  );
};
