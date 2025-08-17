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
  // Get component reference once and memoize it
  const CategoryComponent = React.useMemo(() => {
    return CategoryPanelFactory.getComponent(category);
  }, [category]);
  
  return (
    <div className="h-full flex flex-col bg-transparent">
      <CategoryComponent 
        isMainSidebarCollapsed={isMainSidebarCollapsed}
        isSettingsSidebarCollapsed={isSettingsSidebarCollapsed}
      />
    </div>
  );
};