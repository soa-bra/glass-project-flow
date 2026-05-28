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
      className="h-full rounded-3xl overflow-hidden"
    >
      <div className="h-full min-h-0" style={{ background: 'var(--sb-column-3-bg)' }}>
        {children}
      </div>
    </div>
  );
};
