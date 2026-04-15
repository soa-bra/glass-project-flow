import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DepartmentPanelLayoutProps {
  children: React.ReactNode;
}

export const DepartmentPanelLayout: React.FC<DepartmentPanelLayoutProps> = ({
  children
}) => {
  return (
    <div
      style={{ background: 'var(--sb-column-3-bg)' }}
      className="h-full rounded-3xl overflow-hidden"
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="px-6 py-[45px]" style={{ background: 'var(--sb-column-3-bg)' }}>
              {children}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
