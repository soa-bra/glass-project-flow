import React from 'react';
import { CategoryPanelFactory } from './CategoryPanelFactory';

interface SettingsCategoryPanelProps {
  category: string;
  isMainSidebarCollapsed: boolean;
  isSettingsSidebarCollapsed: boolean;
}

export const SettingsCategoryPanel: React.FC<SettingsCategoryPanelProps> = ({
  category,
  isMainSidebarCollapsed,
  isSettingsSidebarCollapsed
}) => {
  const CategoryComponent = CategoryPanelFactory.getComponent(category);
  
  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--sb-column-3-bg)' }}>
      <CategoryComponent 
        isMainSidebarCollapsed={isMainSidebarCollapsed}
        isSettingsSidebarCollapsed={isSettingsSidebarCollapsed}
      />
    </div>
  );
};