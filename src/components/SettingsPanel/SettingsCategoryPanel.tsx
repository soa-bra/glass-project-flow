import React from 'react';
import { CategoryPanelFactory } from './CategoryPanelFactory';
import { usePermission } from '@/hooks/usePermission';
import { SETTINGS_ACCESS } from './settingsAccess';

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
  const access = SETTINGS_ACCESS[category] ?? { read: ['settings.admin'], write: ['settings.admin'] };
  const read = usePermission(access.read[0]);
  const write = usePermission(access.write[0]);

  if (read.isLoading || write.isLoading) {
    return <div className="h-full flex items-center justify-center text-sm text-gray-500">جار التحقق من صلاحيات التبويب...</div>;
  }
  if (!read.allowed) {
    return <div className="h-full flex items-center justify-center text-sm text-gray-500">لا تملك صلاحية عرض هذا التبويب.</div>;
  }
  
  return (
    <div className="h-full flex flex-col bg-white">
      <CategoryComponent 
        isMainSidebarCollapsed={isMainSidebarCollapsed}
        isSettingsSidebarCollapsed={isSettingsSidebarCollapsed}
        canWrite={write.allowed}
      />
    </div>
  );
};
