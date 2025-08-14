import React from 'react';
import { SoaPanel } from '@/components/ui/SoaPanel';

interface DepartmentPanelLayoutProps {
  children: React.ReactNode;
}

export const DepartmentPanelLayout: React.FC<DepartmentPanelLayoutProps> = ({
  children
}) => {
  return (
    <SoaPanel className="h-full overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-auto px-0 mx-0">
          <div className="h-full px-0 mx-6 rounded-2xl overflow-hidden bg-transparent my-0 py-10">
            {children}
          </div>
        </div>
      </div>
    </SoaPanel>
  );
};