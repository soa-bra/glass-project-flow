import React from 'react';
import { GenericSettingsPanel } from './GenericSettingsPanel';
import { AccountSettingsPanel } from './categories/AccountSettingsPanel';
import { SecuritySettingsPanel } from './categories/SecuritySettingsPanel';
import { IntegrationsSettingsPanel } from './categories/IntegrationsSettingsPanel';

export class CategoryPanelFactory {
  static getComponent(category: string): React.ComponentType<any> {
    switch (category) {
      case 'account':
        return AccountSettingsPanel;
      case 'security':  
        return SecuritySettingsPanel;
      case 'integrations':
        return IntegrationsSettingsPanel;
      
      default:
        return (props: any) => <GenericSettingsPanel category={category} {...props} />;
    }
  }
}