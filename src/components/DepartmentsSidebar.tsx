
import React from 'react';
import { Building2, DollarSign, Scale, TrendingUp, Users, Heart, GraduationCap, BookOpen, Award, ChevronLeft, ChevronRight } from 'lucide-react';

interface DepartmentsSidebarProps {
  selectedDepartment: string | null;
  onDepartmentSelect: (department: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}

const DepartmentsSidebar: React.FC<DepartmentsSidebarProps> = ({
  selectedDepartment,
  onDepartmentSelect,
  isCollapsed,
  onToggleCollapse
}) => {
  const departments = [
    { key: 'financial', label: 'إدارة الأوضاع المالية', icon: DollarSign },
    { key: 'legal', label: 'إدارة الأحوال القانونية', icon: Scale },
    { key: 'marketing', label: 'إدارة الأنشطة التسويقية', icon: TrendingUp },
    { key: 'projects', label: 'إدارة المشاريع', icon: Building2 },
    { key: 'hr', label: 'إدارة الطاقات البشرية', icon: Users },
    { key: 'clients', label: 'إدارة علاقات العملاء', icon: Heart },
    { key: 'social', label: 'إدارة المسؤولية الاجتماعية', icon: Heart },
    { key: 'training', label: 'إدارة التدريب', icon: GraduationCap },
    { key: 'research', label: 'إدارة المعرفة والنشر والبحث العلمي', icon: BookOpen },
    { key: 'brand', label: 'إدارة العلامة التجارية', icon: Award }
  ];

  const toggleSidebar = () => {
    onToggleCollapse(!isCollapsed);
  };

  return (
    <aside 
      style={{
        width: 'var(--departments-sidebar-width)',
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
                الإدارات
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

        {/* Departments List */}
        <div className="flex flex-col gap-2 px-[15px] flex-1 overflow-y-auto">
          {departments.map((department, index) => {
            const IconComponent = department.icon;
            const isActive = selectedDepartment === department.key;
            return (
              <button
                key={department.key}
                onClick={() => onDepartmentSelect(department.key)}
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
                    {department.label}
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

export default DepartmentsSidebar;
