
// إعادة تصدير الأنواع من الملف المركزي
export type { 
  TabData, 
  TabItem,
  FinanceData,
  LegalData,
  HRData,
  ClientsData,
  TimelineEvent 
} from '@/types';

export interface OperationsBoardProps {
  isVisible: boolean;
  onClose: () => void;
  isSidebarCollapsed: boolean;
}

// استخدام الثوابت من الملف المركزي
export { TAB_ITEMS } from '@/constants';
