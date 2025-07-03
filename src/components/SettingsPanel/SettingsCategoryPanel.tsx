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
    <div className="w-full h-full p-6 overflow-auto">
      <CategoryComponent 
        isMainSidebarCollapsed={isMainSidebarCollapsed}
        isSettingsSidebarCollapsed={isSettingsSidebarCollapsed}
      />
    </div>
  );
};