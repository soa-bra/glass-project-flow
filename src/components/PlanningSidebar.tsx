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
  
  return (
    <div className="h-full bg-white/10 backdrop-blur-sm border-r border-white/20">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-black mb-4">التخطيط التشاركي</h2>
        <div className="space-y-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.key}
                onClick={() => onCategorySelect(category.key)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  selectedCategory === category.key
                    ? 'bg-blue-500/20 text-blue-600'
                    : 'hover:bg-white/10 text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {!isCollapsed && <span className="text-sm">{category.label}</span>}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="absolute bottom-4 left-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
export default PlanningSidebar;