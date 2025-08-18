import React from 'react';
interface DepartmentPanelLayoutProps {
  children: React.ReactNode;
}
export const DepartmentPanelLayout: React.FC<DepartmentPanelLayoutProps> = ({
  children
}) => {
  return <div style={{
    background: '#F8F9FA'
  }} className="h-full rounded-3xl overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-auto px-0 mx-0 bg-[#F8F9FA]">
          <div className="h-full px-0 mx-6 rounded-2xl overflow-hidden bg-transparent my-0 py-[45px]">
            {children}
          </div>
        </div>
      </div>
    </div>;
};