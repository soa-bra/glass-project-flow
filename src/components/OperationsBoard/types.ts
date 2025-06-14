
export type TabData = {
  [key: string]: any;
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

// ترتيب التبويبات الجديد
export const TAB_ITEMS: TabItem[] = [
  { value: 'overview', label: 'نظرة عامة' },
  { value: 'finance', label: 'الحالة المالية' },
  { value: 'projects', label: 'إدارة المشاريع' },
  { value: 'marketing', label: 'التسويق' },
  { value: 'clients', label: 'العملاء' },
  { value: 'reports', label: 'التقارير' },
];
