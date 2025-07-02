
import type { OverviewData } from './Overview/OverviewData';
import type { FinanceData } from './FinanceTab';
import type { ProjectsData } from './ProjectsTab';
import type { MarketingData } from './MarketingTab';
import type { HRData } from './HRTab';
import type { ClientsData } from './ClientsTab';
import type { ReportsData } from './ReportsTab';

export interface TabData {
  overview?: OverviewData;
  finance?: FinanceData;
  projects?: ProjectsData;
  marketing?: MarketingData;
  hr?: HRData;
  clients?: ClientsData;
  reports?: ReportsData;
  [key: string]: unknown;
}

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
