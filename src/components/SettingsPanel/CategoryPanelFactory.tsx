import React from 'react';
import { GenericSettingsPanel } from './GenericSettingsPanel';
import { AccountSettingsPanel } from './categories/AccountSettingsPanel';
import { SecuritySettingsPanel } from './categories/SecuritySettingsPanel';
import { IntegrationsSettingsPanel } from './categories/IntegrationsSettingsPanel';
import { NotificationsSettingsPanel } from './categories/NotificationsSettingsPanel';
import { AISettingsPanel } from './categories/AISettingsPanel';
import { ThemeSettingsPanel } from './categories/ThemeSettingsPanel';
import { DataGovernanceSettingsPanel } from './categories/DataGovernanceSettingsPanel';

import { AuditCenterPanel } from './categories/AuditCenterPanel';
import { EngineJobsDashboard } from '@/features/engine-jobs';
import { DependencyGraphVisualizer } from '@/features/dependency-graph';
import { ToolsMarketplace } from '@/features/tools-marketplace';
import { AdminRolesPanel } from '@/features/admin-roles';
import { SpecSettingsShell } from './SpecSettingsShell';

const wrapTechnical = (Component: React.ComponentType, title: string, subtitle?: string) => () => (
  <SpecSettingsShell title={title} subtitle={subtitle}>
    <Component />
  </SpecSettingsShell>
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
      case 'admin-roles':
        return wrapTechnical(AdminRolesPanel, 'المستخدمون والأدوار', 'إدارة الحسابات والأدوار والصلاحيات (DB-backed)');
      case 'audit':
        return AuditCenterPanel;
      case 'engine-jobs':
        return wrapTechnical(EngineJobsDashboard, 'محرك المهام', 'مراقبة Engine Jobs الحية');
      case 'dependency-graph':
        return wrapTechnical(DependencyGraphVisualizer, 'خريطة الاعتماديات', 'علاقات الكيانات المركزية');
      case 'tools-marketplace':
        return wrapTechnical(ToolsMarketplace, 'سوق الأدوات', 'إدارة الأدوات والإضافات');

      default:
        return (props: any) => <GenericSettingsPanel category={category} {...props} />;
    }
  }
}