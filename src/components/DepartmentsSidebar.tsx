import React from 'react';
import {
  Award,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Globe,
  GraduationCap,
  Handshake,
  Heart,
  Lightbulb,
  Scale,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';

interface DepartmentsSidebarProps {
  selectedDepartment: string | null;
  onDepartmentSelect: (department: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}

const departments = [
  { key: 'financial', label: 'إدارة العمليات المالية', icon: DollarSign },
  { key: 'legal', label: 'إدارة الأحوال القانونية', icon: Scale },
  { key: 'marketing', label: 'إدارة الأنشطة التسويقية', icon: TrendingUp },
  { key: 'hr', label: 'إدارة الطاقات البشرية', icon: Users },
  { key: 'crm', label: 'إدارة علاقات العملاء', icon: UserCheck },
  { key: 'csr', label: 'إدارة المسؤولية الاجتماعية', icon: Heart },
  { key: 'bcm', label: 'إدارة مجتمع العلامة', icon: Globe },
  { key: 'training', label: 'إدارة التدريب والتطوير', icon: GraduationCap },
  { key: 'partnerships', label: 'إدارة الشراكات', icon: Handshake },
  { key: 'kmpa', label: 'إدارة المعرفة والنشر والبحث العلمي', icon: BookOpen },
  { key: 'knowledge', label: 'إدارة المعرفة المؤسسية', icon: Lightbulb },
  { key: 'brand', label: 'إدارة العلامة التجارية', icon: Award },
];

const DepartmentsSidebar: React.FC<DepartmentsSidebarProps> = ({
  selectedDepartment,
  onDepartmentSelect,
  isCollapsed,
  onToggleCollapse,
}) => {
  const toggleSidebar = () => {
    onToggleCollapse(!isCollapsed);
  };

  return (
    <aside
      className="h-full overflow-hidden rounded-3xl border border-white/25 bg-[var(--backgrounds-project-column-bg)] shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl"
      style={{
        width: isCollapsed ? 'var(--departments-sidebar-width-collapsed)' : 'var(--departments-sidebar-width-expanded)',
        transition: 'all var(--animation-duration-main) var(--animation-easing)',
      }}
    >
      <nav
        aria-label="قائمة الإدارات"
        className="flex h-full flex-col bg-[var(--sb-column-2-bg)] px-3 py-5"
        dir="rtl"
      >
        <div className="mb-4 flex items-center justify-between gap-3 px-1">
          <div
            className="min-w-0 flex-1 overflow-hidden sync-transition"
            style={{
              opacity: isCollapsed ? 0 : 1,
              transform: isCollapsed ? 'translateX(18px) scale(0.96)' : 'translateX(0) scale(1)',
              width: isCollapsed ? '0' : 'auto',
              transitionDelay: isCollapsed ? '0ms' : 'calc(var(--animation-duration-main) * 0.25)',
            }}
          >
            <p className="text-right text-xs font-medium tracking-[0.24em] text-soabra-text-secondary/70">
              SOABRA
            </p>
            <h2 className="mt-1 whitespace-nowrap text-right text-3xl font-medium text-soabra-text-primary">
              الإدارات
            </h2>
          </div>

          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? 'توسيع قائمة الإدارات' : 'طي قائمة الإدارات'}
            aria-expanded={!isCollapsed}
            className="group flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-[#3e494c]/25 bg-white/20 text-[#3e494c] shadow-sm sync-transition-fast hover:border-[#3e494c]/45 hover:bg-white/35 hover:shadow-md active:scale-95"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 sync-transition-fast group-hover:scale-110" />
            ) : (
              <ChevronLeft className="h-5 w-5 sync-transition-fast group-hover:scale-110" />
            )}
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto rounded-[28px] bg-white/10 px-2 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-2">
            {departments.map((department, index) => {
              const IconComponent = department.icon;
              const isActive = selectedDepartment === department.key;

              return (
                <button
                  key={department.key}
                  type="button"
                  onClick={() => onDepartmentSelect(department.key)}
                  title={isCollapsed ? department.label : undefined}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative flex min-h-[58px] items-center gap-3 overflow-hidden rounded-full border text-right sync-transition active:scale-[0.98] ${
                    isActive
                      ? 'border-white/55 bg-white/35 text-[#3e494c] shadow-[0_12px_28px_rgba(62,73,76,0.14)]'
                      : 'border-transparent text-soabra-text-secondary hover:border-white/35 hover:bg-white/20 hover:text-[#3e494c] hover:shadow-sm'
                  } ${isCollapsed ? 'justify-center px-1' : 'px-2.5'}`}
                  style={{
                    transition: 'all var(--animation-duration-main) var(--animation-easing)',
                    transitionDelay: isCollapsed ? '0ms' : `calc(var(--stagger-delay) * ${index})`,
                  }}
                >
                  <span
                    className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border sync-transition-fast ${
                      isActive
                        ? 'border-[#3e494c]/50 bg-white/45 shadow-sm'
                        : 'border-[#3e494c]/20 bg-white/10 group-hover:border-[#3e494c]/45 group-hover:bg-white/35'
                    }`}
                  >
                    <IconComponent
                      className={`h-5 w-5 sync-transition-fast ${
                        isActive
                          ? 'text-[#3e494c]'
                          : 'text-soabra-text-secondary group-hover:text-[#3e494c] group-hover:scale-110'
                      }`}
                    />
                  </span>

                  <span
                    className="min-w-0 flex-1 overflow-hidden sync-transition"
                    style={{
                      opacity: isCollapsed ? 0 : 1,
                      transform: isCollapsed ? 'translateX(24px) scale(0.96)' : 'translateX(0) scale(1)',
                      width: isCollapsed ? '0' : 'auto',
                      transition: 'all var(--animation-duration-main) var(--animation-easing)',
                      transitionDelay: isCollapsed ? '0ms' : `calc(var(--base-delay) + var(--stagger-delay) * ${index})`,
                    }}
                  >
                    <span className={`block truncate text-sm tracking-wide ${isActive ? 'font-semibold' : 'font-medium'}`}>
                      {department.label}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default DepartmentsSidebar;
