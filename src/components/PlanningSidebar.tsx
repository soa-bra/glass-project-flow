import React from 'react';
import { Users, Target, Calendar, TrendingUp, FileText, Settings, ChevronLeft, ChevronRight, Lightbulb, Building, BarChart3 } from 'lucide-react';
interface PlanningSidebarProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}
const PlanningSidebar: React.FC<PlanningSidebarProps> = ({
  selectedCategory,
  onCategorySelect,
  isCollapsed,
  onToggleCollapse
}) => {
  const categories = [{
    key: 'strategic',
    label: 'التخطيط الاستراتيجي',
    icon: Target
  }, {
    key: 'projects',
    label: 'تخطيط المشاريع',
    icon: Building
  }, {
    key: 'teams',
    label: 'تخطيط الفرق',
    icon: Users
  }, {
    key: 'timeline',
    label: 'الجداول الزمنية',
    icon: Calendar
  }, {
    key: 'performance',
    label: 'تخطيط الأداء',
    icon: TrendingUp
  }, {
    key: 'analytics',
    label: 'تحليل البيانات',
    icon: BarChart3
  }, {
    key: 'innovation',
    label: 'التخطيط للابتكار',
    icon: Lightbulb
  }, {
    key: 'documentation',
    label: 'التوثيق والتقارير',
    icon: FileText
  }, {
    key: 'settings',
    label: 'إعدادات التخطيط',
    icon: Settings
  }];
  const toggleSidebar = () => {
    onToggleCollapse(!isCollapsed);
  };
  return;
};
export default PlanningSidebar;