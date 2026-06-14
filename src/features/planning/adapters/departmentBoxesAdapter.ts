import { getAllDepartmentDefinitions } from '@/features/ai/context/departmentRegistry';
import type { SmartElementType } from '@/types/smart-elements';

export type DepartmentBoxType = 'action' | 'operation';

export interface DepartmentBoxSource {
  id: string;
  title: string;
  status: 'available' | 'draft' | 'active' | 'archived';
  departmentId: string;
  departmentLabel: string;
  tabId: string;
  tabLabel: string;
  boxType: DepartmentBoxType;
  smartElementType: SmartElementType;
}

const ACTION_HINTS = ['action', 'decision', 'approval', 'risk', 'template', 'report', 'analysis', 'review'];

const FINANCE_BOX_TYPE_BY_KEY: Record<string, SmartElementType> = {
  budgets: 'finance_card',
  transactions: 'finance_card',
  invoices: 'finance_card',
  payments: 'finance_card',
};

const CRM_BOX_TYPE_BY_KEY: Record<string, SmartElementType> = {
  clients: 'crm_card',
  leads: 'crm_card',
  interactions: 'crm_card',
};

const CSR_BOX_TYPE_BY_KEY: Record<string, SmartElementType> = {
  initiatives: 'csr_card',
  impact: 'csr_card',
  volunteering: 'csr_card',
};

const getSmartElementType = (departmentId: string, boxKey: string): SmartElementType => {
  const normalizedKey = boxKey.toLowerCase();

  if (departmentId === 'financial') {
    return FINANCE_BOX_TYPE_BY_KEY[normalizedKey] ?? 'finance_card';
  }

  if (departmentId === 'crm') {
    return CRM_BOX_TYPE_BY_KEY[normalizedKey] ?? 'crm_card';
  }

  if (departmentId === 'csr') {
    return CSR_BOX_TYPE_BY_KEY[normalizedKey] ?? 'csr_card';
  }

  if (normalizedKey.includes('task') || normalizedKey.includes('action')) {
    return 'task_card';
  }

  return 'project_card';
};

const getBoxType = (boxKey: string, tabId: string): DepartmentBoxType => {
  const haystack = `${boxKey} ${tabId}`.toLowerCase();
  return ACTION_HINTS.some((hint) => haystack.includes(hint)) ? 'action' : 'operation';
};

const humanizeBoxKey = (boxKey: string): string => boxKey
  .replace(/[-_]+/g, ' ')
  .replace(/\b\w/g, (char) => char.toUpperCase());

export const getDepartmentBoxSources = (): DepartmentBoxSource[] => {
  return getAllDepartmentDefinitions().flatMap((department) =>
    department.tabs.flatMap((tab) =>
      (tab.boxKeys ?? []).map((boxKey) => ({
        id: `${department.id}:${tab.id}:${boxKey}`,
        title: humanizeBoxKey(boxKey),
        status: 'available' as const,
        departmentId: department.id,
        departmentLabel: department.label,
        tabId: tab.id,
        tabLabel: tab.label,
        boxType: getBoxType(boxKey, tab.id),
        smartElementType: getSmartElementType(department.id, boxKey),
      }))
    )
  );
};

export const createDepartmentBoxElementData = (source: DepartmentBoxSource) => ({
  title: source.title,
  sourceDepartment: source.departmentId,
  sourceBoxId: source.id,
  boxType: source.boxType,
  sourceSnapshot: {
    title: source.title,
    status: source.status,
  },
});
