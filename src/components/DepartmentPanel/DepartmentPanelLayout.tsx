import React from 'react';

interface DepartmentPanelLayoutProps {
  children: React.ReactNode;
}

export const DepartmentPanelLayout: React.FC<DepartmentPanelLayoutProps> = ({
  children
}) => {
  return (
    <div
      style={{ background: 'var(--sb-column-3-bg)' }}
      className="flex h-full min-h-0 flex-col overflow-y-auto overflow-x-hidden rounded-3xl"
    >
      <div className="min-h-full" style={{ background: 'var(--sb-column-3-bg)' }}>
        {children}
      </div>
    </div>
  );
};
