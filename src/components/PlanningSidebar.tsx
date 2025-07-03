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
  const categories = [
    {
      key: 'strategic',
      label: 'التخطيط الاستراتيجي',
      icon: Target
    },
    {
      key: 'projects',
      label: 'تخطيط المشاريع',
      icon: Building
    },
    {
      key: 'teams',
      label: 'تخطيط الفرق',
      icon: Users
    },
    {
      key: 'timeline',
      label: 'الجداول الزمنية',
      icon: Calendar
    },
    {
      key: 'performance',
      label: 'تخطيط الأداء',
      icon: TrendingUp
    },
    {
      key: 'analytics',
      label: 'تحليل البيانات',
      icon: BarChart3
    },
    {
      key: 'innovation',
      label: 'التخطيط للابتكار',
      icon: Lightbulb
    },
    {
      key: 'documentation',
      label: 'التوثيق والتقارير',
      icon: FileText
    },
    {
      key: 'settings',
      label: 'إعدادات التخطيط',
      icon: Settings
    }
  ];
  
  const toggleSidebar = () => {
    onToggleCollapse(!isCollapsed);
  };

  return (
    <aside 
      style={{
        width: isCollapsed ? 'var(--departments-sidebar-width-collapsed)' : 'var(--departments-sidebar-width-expanded)',
        transition: 'all var(--animation-duration-main) var(--animation-easing)',
        background: 'var(--backgrounds-project-column-bg)'
      }} 
      className="h-full backdrop-blur-xl rounded-3xl overflow-hidden"
    >
      <nav className="flex flex-col gap-2 h-full py-0 mx-0 px-0">
        {/* Header with Toggle */}
        <div className={`text-center mb-2 rounded-full mx-0 px-0 py-[24px] my-[24px] sync-transition ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center rounded-lg sync-transition ${isCollapsed ? 'justify-center px-0 mx-0' : 'justify-between px-[3px] mx-[20px]'}`}>
            <div 
              className="flex-1 overflow-hidden"
              style={{
                transition: 'all var(--animation-duration-main) var(--animation-easing)',
                opacity: isCollapsed ? 0 : 1,
                transform: isCollapsed ? 'translateX(24px) scale(0.9)' : 'translateX(0) scale(1)',
                width: isCollapsed ? '0' : 'auto',
                transitionDelay: isCollapsed ? '0ms' : 'calc(var(--animation-duration-main) * 0.4)'
              }}
            >
              <h2 className="text-soabra-text-primary text-right font-medium text-3xl px-0 mx-[18px] whitespace-nowrap">
                التخطيط التشاركي
              </h2>
            </div>
            
            <button 
              onClick={toggleSidebar}
              className="group w-[60px] h-[60px] rounded-full flex items-center justify-center border-2 border-[#3e494c]/30 hover:border-[#3e494c]/60 hover:bg-white/20 hover:shadow-lg flex-shrink-0 sync-transition-fast"
            >
              <div className="sync-transition-fast">
                {isCollapsed ? (
                  <ChevronRight className="w-6 h-6 text-[#3e494c] sync-transition-fast group-hover:scale-110" />
                ) : (
                  <ChevronLeft className="w-6 h-6 text-[#3e494c] sync-transition-fast group-hover:scale-110" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="flex flex-col gap-2 flex-1 overflow-y-auto my-[96px] px-[10px]">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            const isActive = selectedCategory === category.key;
            
            return (
              <button
                key={category.key}
                onClick={() => onCategorySelect(category.key)}
                className={`
                  flex items-center gap-3 text-right group relative overflow-hidden sync-transition
                  ${isActive 
                    ? 'bg-white/25 text-[#3e494c] font-medium rounded-full shadow-lg border border-white/50 scale-[1.02]' 
                    : 'text-soabra-text-secondary hover:bg-white/15 hover:text-[#3e494c] font-light rounded-full hover:shadow-md border border-transparent hover:border-white/30 hover:scale-[1.02] active:scale-95'
                  }
                  ${isCollapsed ? 'justify-center px-[12px] py-3' : 'px-2 py-3'}
                `}
                style={{
                  transition: `all var(--animation-duration-main) var(--animation-easing)`,
                  transitionDelay: isCollapsed ? '0ms' : `calc(var(--stagger-delay) * ${index})`
                }}
              >
                <div className={`
                    w-[50px] h-[50px] flex items-center justify-center flex-shrink-0 border-2 rounded-full sync-transition-fast
                    ${isActive 
                      ? 'bg-white/30 border-[#3e494c]/60 shadow-lg scale-105' 
                      : 'border-[#3e494c]/30 group-hover:border-[#3e494c]/60 group-hover:bg-white/20 group-hover:shadow-md group-hover:scale-110 group-active:scale-95'
                    }
                  `}>
                  <IconComponent className={`
                      w-5 h-5 sync-transition-fast
                      ${isActive 
                        ? 'text-[#3e494c] scale-110' 
                        : 'text-soabra-text-secondary group-hover:text-[#3e494c] group-hover:scale-110'
                      }
                    `} />
                </div>
                
                <div 
                  className="flex-1 flex items-center overflow-hidden"
                  style={{
                    opacity: isCollapsed ? 0 : 1,
                    transform: isCollapsed ? 'translateX(32px) scale(0.9)' : 'translateX(0) scale(1)',
                    width: isCollapsed ? '0' : 'auto',
                    transition: 'all var(--animation-duration-main) var(--animation-easing)',
                    transitionDelay: isCollapsed ? '0ms' : `calc(var(--base-delay) + var(--stagger-delay) * ${index})`
                  }}
                >
                  <span className={`tracking-wide text-sm whitespace-nowrap sync-transition-fast ${isActive ? 'font-semibold' : 'group-hover:font-medium'}`}>
                    {category.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default PlanningSidebar;