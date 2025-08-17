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

export class CategoryPanelFactory {
  static getComponent(category: string): React.ComponentType<any> {
    switch (category) {
      case 'account':
        return AccountSettingsPanel;
      case 'security':  
        return SecuritySettingsPanel;
      case 'integrations':
        return IntegrationsSettingsPanel;
      case 'notifications':
        return NotificationsSettingsPanel;
      case 'ai':
        return AISettingsPanel;
      case 'theme':
        return ThemeSettingsPanel;
      case 'data-governance':
        return DataGovernanceSettingsPanel;
      case 'users-roles':
        return UsersRolesSettingsPanel;
      
      default:
        return (props: any) => <GenericSettingsPanel category={category} {...props} />;
    }
  }
}