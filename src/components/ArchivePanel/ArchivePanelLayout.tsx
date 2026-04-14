import React from 'react';
import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';

interface ArchivePanelLayoutProps {
  children: React.ReactNode;
}

export const ArchivePanelLayout: React.FC<ArchivePanelLayoutProps> = ({ children }) => {
  return (
    <AppCardSurface density="standard" overflow="hidden" className="h-full">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </AppCardSurface>
  );
};
