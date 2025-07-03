import React from 'react';
import { GenericSettingsPanel } from './GenericSettingsPanel';

// Import specialized panels here when created
// import { ProfileSettingsPanel } from './categories/ProfileSettingsPanel';
// import { SecuritySettingsPanel } from './categories/SecuritySettingsPanel';

export class CategoryPanelFactory {
  static getComponent(category: string): React.ComponentType<any> {
    switch (category) {
      // Specialized panels can be added here
      // case 'profile':
      //   return ProfileSettingsPanel;
      // case 'security':  
      //   return SecuritySettingsPanel;
      
      default:
        return (props: any) => <GenericSettingsPanel category={category} {...props} />;
    }
  }
}