import type React from 'react';
import type { CanvasSmartElement } from '@/types/canvas-elements';
import {
  BudgetsAdapter,
  InvoicesAdapter,
  LegalDashboardAdapter,
  ProjectPanelAdapter,
  RiskPanelAdapter,
  SheetAdapter,
  SmartDocAdapter,
  TaskExecutionPanel,
  TransactionsAdapter,
} from './executionAdapterComponents';

export type ExecutionEntityType =
  | 'project'
  | 'task'
  | 'invoice'
  | 'financial_budget'
  | 'financial_transaction'
  | 'contract'
  | 'risk'
  | 'smart_doc'
  | 'sheet';

export interface ExecutionTarget {
  entityType: ExecutionEntityType;
  entityId?: string;
  title?: string;
  data?: Record<string, unknown>;
  element?: CanvasSmartElement;
  onUpdate?: (data: any) => void;
}

export interface ExecutionAdapterContext {
  target: ExecutionTarget;
  currentUserId: string;
  onClose: () => void;
}

export interface ExecutionAdapterDefinition {
  title: string;
  description?: string;
  presentation?: 'hosted' | 'standalone';
  Component: React.FC<ExecutionAdapterContext>;
}

export const executionAdapters: Record<ExecutionEntityType, ExecutionAdapterDefinition> = {
  project: {
    title: 'لوحة المشروع',
    description: 'ProjectPanel/ProjectManagementBoard للمشروع المرتبط.',
    presentation: 'standalone',
    Component: ProjectPanelAdapter,
  },
  task: {
    title: 'تنفيذ المهمة',
    description: 'TaskExecutionPanel للمهمة المرتبطة.',
    Component: TaskExecutionPanel,
  },
  invoice: {
    title: 'الفواتير',
    description: 'InvoicesTab المالي الحالي.',
    Component: InvoicesAdapter,
  },
  financial_budget: {
    title: 'الميزانيات',
    description: 'BudgetsTab المالي الحالي.',
    Component: BudgetsAdapter,
  },
  financial_transaction: {
    title: 'المعاملات المالية',
    description: 'TransactionsTab المالي الحالي.',
    Component: TransactionsAdapter,
  },
  contract: {
    title: 'العقود والشؤون القانونية',
    description: 'LegalDashboard الحالي.',
    Component: LegalDashboardAdapter,
  },
  risk: {
    title: 'المخاطر',
    description: 'RiskPanel عند توفره، وإلا تبويب RisksTab القانوني الحالي.',
    Component: RiskPanelAdapter,
  },
  smart_doc: {
    title: 'مستند ذكي',
    description: 'SmartDocRenderer الحالي.',
    Component: SmartDocAdapter,
  },
  sheet: {
    title: 'ورقة تفاعلية',
    description: 'InteractiveSheet الحالي.',
    Component: SheetAdapter,
  },
};

export const getExecutionAdapter = (entityType: ExecutionEntityType) => executionAdapters[entityType];
