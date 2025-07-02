import React from 'react';
interface DepartmentPanelLayoutProps {
  children: React.ReactNode;
}
export const DepartmentPanelLayout: React.FC<DepartmentPanelLayoutProps> = ({
  children
}) => {
  return <div style={{
    background: 'var(--backgrounds-admin-ops-board-bg)'
  }} className="h-full rounded-3xl overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-auto px-0 mx-0 bg-[#d9e7ed]">
          <div className="h-full mx-6 my-6 rounded-2xl overflow-hidden bg-transparent">
            {children}
          </div>
        </div>
      </div>
    </div>;
};