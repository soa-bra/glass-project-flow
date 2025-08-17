
import React from 'react';
import { GenericSettingsPanel } from './GenericSettingsPanel';
import { AccountSettingsPanel } from './categories/AccountSettingsPanel';
import { SecuritySettingsPanel } from './categories/SecuritySettingsPanel';
import { IntegrationsSettingsPanel } from './categories/IntegrationsSettingsPanel';
import { NotificationsSettingsPanel } from './categories/NotificationsSettingsPanel';
import { AISettingsPanel } from './categories/AISettingsPanel';
import { ThemeSettingsPanel } from './categories/ThemeSettingsPanel';
import { DataGovernanceSettingsPanel } from './categories/DataGovernanceSettingsPanel';
import { UsersRolesSettingsPanel } from './categories/UsersRolesSettingsPanel';

interface CategoryPanelFactoryProps {
  category: string;
  isMainSidebarCollapsed: boolean;
  isSettingsSidebarCollapsed: boolean;
}

export const CategoryPanelFactory: React.FC<CategoryPanelFactoryProps> = ({ 
  category, 
  isMainSidebarCollapsed, 
  isSettingsSidebarCollapsed 
}) => {
  // Always call hooks consistently, then render based on category
  const sharedProps = {
    isMainSidebarCollapsed,
    isSettingsSidebarCollapsed
  };

  // Use switch with consistent hook calls - no early returns
  switch (category) {
    case 'account':
      return <AccountSettingsPanel {...sharedProps} />;
    case 'security':
      return <SecuritySettingsPanel {...sharedProps} />;
    case 'integrations':
      return <IntegrationsSettingsPanel {...sharedProps} />;
    case 'notifications':
      return <NotificationsSettingsPanel {...sharedProps} />;
    case 'ai':
      return <AISettingsPanel {...sharedProps} />;
    case 'theme':
      return <ThemeSettingsPanel {...sharedProps} />;
    case 'data-governance':
      return <DataGovernanceSettingsPanel {...sharedProps} />;
    case 'users-roles':
      return <UsersRolesSettingsPanel {...sharedProps} />;
    default:
      return <GenericSettingsPanel category={category} {...sharedProps} />;
  }
};
