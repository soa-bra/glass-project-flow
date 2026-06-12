export interface DepartmentTabDefinition {
  id: string;
  label: string;
  boxKeys?: string[];
}

export interface DepartmentDefinition {
  id: string;
  label: string;
  category: 'financial' | 'legal' | 'marketing' | 'hr' | 'crm' | 'csr' | 'training' | 'knowledge' | 'operations';
  defaultTab: string;
  tabs: DepartmentTabDefinition[];
  requiredPermissions?: string[];
}

const FINANCIAL_TABS: DepartmentTabDefinition[] = [
  { id: 'overview', label: 'نظرة عامة', boxKeys: ['financial-kpis', 'cashflow-summary', 'budget-health'] },
  { id: 'budgets', label: 'الميزانية', boxKeys: ['budget-list', 'variance-alerts'] },
  { id: 'transactions', label: 'المعاملات', boxKeys: ['transaction-feed', 'reconciliation-status'] },
  { id: 'invoices', label: 'الفواتير والمدفوعات', boxKeys: ['invoice-list', 'payment-progress', 'client-card'] },
  { id: 'analysis', label: 'مركز القرار المالي', boxKeys: ['financial-risks', 'forecast-panel'] },
  { id: 'templates', label: 'النماذج والقوالب', boxKeys: ['template-library'] },
  { id: 'reports', label: 'التقارير', boxKeys: ['report-list', 'export-actions'] },
];

export const DEPARTMENT_REGISTRY: Record<string, DepartmentDefinition> = {
  financial: {
    id: 'financial',
    label: 'إدارة العمليات المالية',
    category: 'financial',
    defaultTab: 'overview',
    tabs: FINANCIAL_TABS,
    requiredPermissions: ['financial.view'],
  },
  legal: {
    id: 'legal',
    label: 'الإدارة القانونية',
    category: 'legal',
    defaultTab: 'overview',
    tabs: [
      { id: 'overview', label: 'نظرة عامة', boxKeys: ['legal-summary', 'contracts-status'] },
      { id: 'contracts', label: 'العقود', boxKeys: ['contract-list'] },
      { id: 'compliance', label: 'الامتثال', boxKeys: ['compliance-risks'] },
    ],
    requiredPermissions: ['legal.view'],
  },
  marketing: {
    id: 'marketing',
    label: 'التسويق',
    category: 'marketing',
    defaultTab: 'overview',
    tabs: [{ id: 'overview', label: 'نظرة عامة', boxKeys: ['campaigns', 'channels'] }],
  },
  hr: {
    id: 'hr',
    label: 'الموارد البشرية',
    category: 'hr',
    defaultTab: 'overview',
    tabs: [{ id: 'overview', label: 'نظرة عامة', boxKeys: ['people', 'hiring'] }],
  },
  crm: {
    id: 'crm',
    label: 'إدارة العملاء',
    category: 'crm',
    defaultTab: 'overview',
    tabs: [{ id: 'overview', label: 'نظرة عامة', boxKeys: ['pipeline', 'accounts'] }],
  },
  csr: {
    id: 'csr',
    label: 'المسؤولية المجتمعية',
    category: 'csr',
    defaultTab: 'overview',
    tabs: [{ id: 'overview', label: 'نظرة عامة', boxKeys: ['initiatives', 'impact'] }],
  },
  training: {
    id: 'training',
    label: 'التدريب',
    category: 'training',
    defaultTab: 'overview',
    tabs: [{ id: 'overview', label: 'نظرة عامة', boxKeys: ['programs', 'attendance'] }],
  },
  kmpa: {
    id: 'kmpa',
    label: 'إدارة المعرفة والأداء',
    category: 'knowledge',
    defaultTab: 'overview',
    tabs: [{ id: 'overview', label: 'نظرة عامة', boxKeys: ['knowledge-base', 'performance'] }],
  },
  brand: {
    id: 'brand',
    label: 'العلامة التجارية',
    category: 'marketing',
    defaultTab: 'overview',
    tabs: [{ id: 'overview', label: 'نظرة عامة', boxKeys: ['brand-assets', 'guidelines'] }],
  },
  bcm: {
    id: 'bcm',
    label: 'استمرارية الأعمال',
    category: 'operations',
    defaultTab: 'overview',
    tabs: [{ id: 'overview', label: 'نظرة عامة', boxKeys: ['continuity-plans', 'incidents'] }],
  },
  partnerships: {
    id: 'partnerships',
    label: 'الشراكات',
    category: 'operations',
    defaultTab: 'overview',
    tabs: [{ id: 'overview', label: 'نظرة عامة', boxKeys: ['partners', 'agreements'] }],
  },
  knowledge: {
    id: 'knowledge',
    label: 'المعرفة',
    category: 'knowledge',
    defaultTab: 'overview',
    tabs: [{ id: 'overview', label: 'نظرة عامة', boxKeys: ['articles', 'playbooks'] }],
  },
};

export const getDepartmentDefinition = (departmentId?: string | null): DepartmentDefinition | null => {
  if (!departmentId) return null;
  return DEPARTMENT_REGISTRY[departmentId] ?? null;
};

export const getDepartmentTabDefinition = (
  departmentId?: string | null,
  tabId?: string | null,
): DepartmentTabDefinition | null => {
  const department = getDepartmentDefinition(departmentId);
  if (!department) return null;
  const resolvedTabId = tabId ?? department.defaultTab;
  return department.tabs.find((tab) => tab.id === resolvedTabId) ?? null;
};
