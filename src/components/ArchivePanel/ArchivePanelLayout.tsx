import React from 'react';

interface ArchivePanelLayoutProps {
  children: React.ReactNode;
}

export const ArchivePanelLayout: React.FC<ArchivePanelLayoutProps> = ({ children }) => {
  return (
    <div className="h-full rounded-[24px] overflow-hidden bg-white">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
