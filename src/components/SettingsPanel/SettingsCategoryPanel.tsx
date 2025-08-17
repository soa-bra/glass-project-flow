
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
  return (
    <div className="h-full flex flex-col bg-transparent">
      <CategoryPanelFactory 
        category={category}
        isMainSidebarCollapsed={isMainSidebarCollapsed}
        isSettingsSidebarCollapsed={isSettingsSidebarCollapsed}
      />
    </div>
  );
};
