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

const componentMap: Record<string, React.ComponentType<any>> = {
  'account': AccountSettingsPanel,
  'security': SecuritySettingsPanel, 
  'integrations': IntegrationsSettingsPanel,
  'notifications': NotificationsSettingsPanel,
  'ai': AISettingsPanel,
  'theme': ThemeSettingsPanel,
  'data-governance': DataGovernanceSettingsPanel,
  'users-roles': UsersRolesSettingsPanel,
};

export class CategoryPanelFactory {
  static getComponent(category: string): React.ComponentType<any> {
    const Component = componentMap[category];
    if (Component) {
      return Component;
    }
    
    // Return a stable component reference for default case
    return React.memo((props: any) => <GenericSettingsPanel category={category} {...props} />);
  }
}