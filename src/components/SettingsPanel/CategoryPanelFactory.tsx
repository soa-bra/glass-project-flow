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
import { AuditCenterPanel } from './categories/AuditCenterPanel';
import { EngineJobsDashboard } from '@/features/engine-jobs';
import { DependencyGraphVisualizer } from '@/features/dependency-graph';
import { ToolsMarketplace } from '@/features/tools-marketplace';
import { AdminRolesPanel } from '@/features/admin-roles';

const wrap = (Component: React.ComponentType) => () => (
  <div className="p-6 h-full overflow-auto"><Component /></div>
);

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
      case 'audit':
        return AuditCenterPanel;
      case 'engine-jobs':
        return wrap(EngineJobsDashboard);
      case 'dependency-graph':
        return wrap(DependencyGraphVisualizer);
      case 'tools-marketplace':
        return wrap(ToolsMarketplace);
      case 'admin-roles':
        return wrap(AdminRolesPanel);

      default:
        return (props: any) => <GenericSettingsPanel category={category} {...props} />;
    }
  }
}