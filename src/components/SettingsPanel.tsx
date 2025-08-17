import React from 'react';
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
  return (
    <>
      {!selectedCategory ? (
        <EmptySettingsState />
      ) : (
        <SettingsPanelLayout>
          <SettingsCategoryPanel 
            category={selectedCategory}
            isMainSidebarCollapsed={isMainSidebarCollapsed}
            isSettingsSidebarCollapsed={isSettingsSidebarCollapsed}
          />
        </SettingsPanelLayout>
      )}
    </>
  );
};

export default SettingsPanel;