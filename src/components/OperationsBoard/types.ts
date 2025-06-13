
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

export const TAB_ITEMS: TabItem[] = [
  { value: 'overview', label: 'نظرة عامّة' },
  { value: 'finance', label: 'مالية' },
  { value: 'legal', label: 'قانونية' },
  { value: 'hr', label: 'موارد بشرية' },
  { value: 'clients', label: 'عملاء' },
  { value: 'reports', label: 'تقارير' },
];
