import React from 'react';
import { SettingsPanelLayout } from './SettingsPanel/SettingsPanelLayout';
import { EmptySettingsState } from './SettingsPanel/EmptySettingsState';
import { SettingsCategoryPanel } from './SettingsPanel/SettingsCategoryPanel';
import { ManagedBox, type BoxStatus } from './common/ManagedBox';

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
  const status: BoxStatus = selectedCategory ? 'data' : 'empty';

  return (
    <SettingsPanelLayout>
      <ManagedBox
        boxRef="settings-box"
        title="الإعدادات"
        status={status}
        emptyState={<EmptySettingsState />}
      >
        {selectedCategory ? (
          <SettingsCategoryPanel 
            category={selectedCategory}
            isMainSidebarCollapsed={isMainSidebarCollapsed}
            isSettingsSidebarCollapsed={isSettingsSidebarCollapsed}
          />
        ) : null}
      </ManagedBox>
    </SettingsPanelLayout>
  );
};

export default SettingsPanel;