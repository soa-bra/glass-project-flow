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
      className="flex h-full min-h-0 flex-col rounded-3xl"
    >
      <div className="flex min-h-0 flex-1 flex-col" style={{ background: 'var(--sb-column-3-bg)' }}>
        {children}
      </div>
    </div>
  );
};
