
import { Home, FolderOpen, CheckSquare, Building, Users, Archive, Bell, CircleUser, Search, RefreshCcw, Settings } from 'lucide-react';
import type { SidebarMenuItem, TabItem } from '@/types';

// ثوابت شريط الرأس
export const HEADER_ACTIONS = [
  { icon: Search, label: 'البحث' },
  { icon: RefreshCcw, label: 'تحديث' },
  { icon: Bell, label: 'التنبيهات' },
  { icon: CircleUser, label: 'المستخدم' },
  { icon: Settings, label: 'الإعدادات' },
];

// ثوابت عناصر الشريط الجانبي
export const SIDEBAR_MENU_ITEMS: SidebarMenuItem[] = [
  { icon: Home, label: 'الرئيسية', active: true },
  { icon: FolderOpen, label: 'المشاريع', active: false },
  { icon: CheckSquare, label: 'المهام', active: false },
  { icon: Building, label: 'الإدارات', active: false },
  { icon: Users, label: 'التخطيط التشاركي', active: false },
  { icon: Archive, label: 'الأرشيف', active: false }
];

// ثوابت تبويبات لوحة الإدارة
export const TAB_ITEMS: TabItem[] = [
  { value: 'overview', label: 'نظرة عامّة' },
  { value: 'finance', label: 'مالية' },
  { value: 'legal', label: 'قانونية' },
  { value: 'hr', label: 'موارد بشرية' },
  { value: 'clients', label: 'عملاء' },
  { value: 'reports', label: 'تقارير' },
];

// ثوابت CSS متغيرات
export const CSS_VARIABLES = {
  SIDEBAR_WIDTH_COLLAPSED: 'var(--sidebar-width-collapsed)',
  SIDEBAR_WIDTH_EXPANDED: 'var(--sidebar-width-expanded)',
  ANIMATION_DURATION_MAIN: 'var(--animation-duration-main)',
  ANIMATION_DURATION_FAST: 'var(--animation-duration-fast)',
  ANIMATION_EASING: 'var(--animation-easing)',
  HEADER_HEIGHT: 'var(--header-height)',
  SIDEBAR_TOP_OFFSET: 'var(--sidebar-top-offset)',
} as const;

// ثوابت أخرى
export const LOGO_PATH = '/lovable-uploads/9a8b8ed4-b3d6-4ecf-b62c-e6c1eba8c3d4.png';
export const APP_VERSION = '2.1.0';
export const APP_NAME = 'SoaBra';
