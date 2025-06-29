
export type TabData = {
  [key: string]: unknown;
};

export interface OperationsBoardProps {
  isVisible: boolean;
  onClose: () => void;
  isSidebarCollapsed: boolean;
}

export interface TabItem {
  value: string;
  label: string;
}

export const TAB_ITEMS: TabItem[] = [
  { value: 'overview', label: 'نظرة عامة' },
  { value: 'finance', label: 'الوضع المالي' },
  { value: 'projects', label: 'إدارة المشاريع' },
  { value: 'marketing', label: 'التسويق' },
  { value: 'hr', label: 'الموارد البشرية' },
  { value: 'clients', label: 'العملاء' },
  { value: 'reports', label: 'التقارير' },
];
