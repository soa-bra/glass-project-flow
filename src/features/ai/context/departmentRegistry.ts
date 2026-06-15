export type AIDepartmentId = 'planning' | 'projects' | 'finance' | 'legal' | 'crm' | 'general';

export interface AIDepartmentDefinition {
  id: AIDepartmentId;
  label: string;
  defaultPermissions: string[];
  sensitiveContextKeys: string[];
}

export interface DepartmentTabDefinition {
  id: string;
  label: string;
  boxKeys: string[];
}

export interface DepartmentDefinition {
  id: string;
  label: string;
  category: string;
  defaultTab: string;
  tabs: DepartmentTabDefinition[];
}

export const AI_DEPARTMENT_REGISTRY: Record<AIDepartmentId, AIDepartmentDefinition> = {
  planning: {
    id: 'planning',
    label: 'Planning Canvas',
    defaultPermissions: ['canvas.ai.use'],
    sensitiveContextKeys: ['selectedElements', 'availableLinks'],
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    defaultPermissions: ['project.ai.use'],
    sensitiveContextKeys: ['projectId', 'milestones', 'dependencies'],
  },
  finance: {
    id: 'finance',
    label: 'Finance',
    defaultPermissions: ['project.ai.use'],
    sensitiveContextKeys: ['budget', 'cost', 'invoice', 'payment', 'revenue'],
  },
  legal: {
    id: 'legal',
    label: 'Legal',
    defaultPermissions: ['project.ai.use'],
    sensitiveContextKeys: ['contract', 'clause', 'compliance', 'policy'],
  },
  crm: {
    id: 'crm',
    label: 'CRM',
    defaultPermissions: ['project.ai.use'],
    sensitiveContextKeys: ['customer', 'email', 'phone', 'address'],
  },
  general: {
    id: 'general',
    label: 'General',
    defaultPermissions: ['canvas.ai.use'],
    sensitiveContextKeys: ['confidential', 'private', 'sensitive'],
  },
};

export const getAIDepartmentDefinition = (departmentId?: AIDepartmentId | null): AIDepartmentDefinition => {
  if (!departmentId) return AI_DEPARTMENT_REGISTRY.general;
  return AI_DEPARTMENT_REGISTRY[departmentId] ?? AI_DEPARTMENT_REGISTRY.general;
};

export const DEPARTMENT_REGISTRY: DepartmentDefinition[] = [
  {
    id: 'financial',
    label: 'إدارة العمليات المالية',
    category: 'financial',
    defaultTab: 'overview',
    tabs: [
      { id: 'overview', label: 'نظرة عامة', boxKeys: ['financial-summary', 'budget-health', 'cash-flow'] },
      { id: 'budgets', label: 'الميزانية', boxKeys: ['budgets', 'budget-requests', 'variance-analysis'] },
      { id: 'transactions', label: 'المعاملات', boxKeys: ['transactions', 'pending-approvals', 'reconciliations'] },
      { id: 'invoices', label: 'الفواتير والمدفوعات', boxKeys: ['invoices', 'payments', 'collections'] },
      { id: 'analysis', label: 'مركز القرار المالي', boxKeys: ['analysis', 'forecast', 'risk-actions'] },
      { id: 'templates', label: 'النماذج والقوالب', boxKeys: ['templates', 'approval-workflows'] },
      { id: 'reports', label: 'التقارير', boxKeys: ['reports', 'audit-packages'] },
    ],
  },
  {
    id: 'legal',
    label: 'الإدارة القانونية',
    category: 'legal',
    defaultTab: 'overview',
    tabs: [
      { id: 'overview', label: 'نظرة عامة', boxKeys: ['legal-summary', 'open-matters'] },
      { id: 'contracts', label: 'العقود', boxKeys: ['contracts', 'contract-reviews', 'approval-actions'] },
      { id: 'risks', label: 'المخاطر', boxKeys: ['risks', 'compliance-actions'] },
      { id: 'reports', label: 'التقارير', boxKeys: ['reports'] },
    ],
  },
  {
    id: 'crm',
    label: 'إدارة علاقات العملاء',
    category: 'crm',
    defaultTab: 'overview',
    tabs: [
      { id: 'overview', label: 'نظرة عامة', boxKeys: ['clients', 'leads', 'interactions'] },
      { id: 'actions', label: 'إجراءات العملاء', boxKeys: ['follow-up-actions', 'retention-actions'] },
    ],
  },
  {
    id: 'csr',
    label: 'المسؤولية الاجتماعية',
    category: 'csr',
    defaultTab: 'overview',
    tabs: [
      { id: 'overview', label: 'نظرة عامة', boxKeys: ['initiatives', 'impact', 'volunteering'] },
      { id: 'actions', label: 'إجراءات المبادرات', boxKeys: ['community-actions', 'partner-actions'] },
    ],
  },
];

export const getAllDepartmentDefinitions = (): DepartmentDefinition[] => DEPARTMENT_REGISTRY;

export const getDepartmentDefinition = (departmentId?: string | null): DepartmentDefinition | undefined => {
  if (!departmentId) return undefined;
  return DEPARTMENT_REGISTRY.find((department) => department.id === departmentId);
};

export const getDepartmentTabDefinition = (
  departmentId?: string | null,
  tabId?: string | null
): DepartmentTabDefinition | undefined => {
  const department = getDepartmentDefinition(departmentId);
  if (!department || !tabId) return undefined;
  return department.tabs.find((tab) => tab.id === tabId);
};
