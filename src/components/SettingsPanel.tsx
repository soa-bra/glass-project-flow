import React from 'react';
import { usePermission } from '@/hooks/usePermission';
import { canAccessBox } from '@/auth/permissions';
import { SettingsPanelLayout } from './SettingsPanel/SettingsPanelLayout';
import { EmptySettingsState } from './SettingsPanel/EmptySettingsState';
import { SettingsCategoryPanel } from './SettingsPanel/SettingsCategoryPanel';

interface SettingsPanelProps {
  selectedCategory: string | null;
  isMainSidebarCollapsed: boolean;
  isSettingsSidebarCollapsed: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  selectedCategory,
  isMainSidebarCollapsed,
  isSettingsSidebarCollapsed
}) => {
  const settingsAdmin = usePermission('settings.admin');
  const settingsSecurity = usePermission('settings.security');
  const granted = new Set<string>();

  if (settingsAdmin.allowed) granted.add('settings.admin');
  if (settingsSecurity.allowed) granted.add('settings.security');

  if (settingsAdmin.isLoading || settingsSecurity.isLoading) {
    return <div className="h-full flex items-center justify-center text-sm text-gray-500">جار التحقق من الصلاحيات...</div>;
  }

  if (!canAccessBox('settings', granted)) {
    return <div className="h-full flex items-center justify-center text-sm text-gray-500">لا تملك صلاحية الوصول إلى الإعدادات.</div>;
  }

  // Early return for no selection
  if (!selectedCategory) {
    return <EmptySettingsState />;
  }

  return (
    <SettingsPanelLayout>
      <SettingsCategoryPanel 
        category={selectedCategory}
        isMainSidebarCollapsed={isMainSidebarCollapsed}
        isSettingsSidebarCollapsed={isSettingsSidebarCollapsed}
      />
    </SettingsPanelLayout>
  );
};

export default SettingsPanel;
