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
      className="h-full overflow-hidden rounded-[28px] border border-[#DADCE0] bg-[var(--sb-column-2-bg)] shadow-[0_16px_38px_rgba(15,23,42,0.06)]"
      style={{
        width: isCollapsed ? 'var(--departments-sidebar-width-collapsed)' : 'var(--departments-sidebar-width-expanded)',
        transition: 'all var(--animation-duration-main) var(--animation-easing)',
      }}
    >
      <nav
        aria-label="قائمة الإدارات"
        className="flex h-full flex-col px-3 py-4"
        dir="rtl"
      >
        <div className="mb-3 flex items-center justify-between gap-2 rounded-2xl border border-white/65 bg-white/50 px-2.5 py-2">
          <div
            className="min-w-0 flex-1 overflow-hidden sync-transition"
            style={{
              opacity: isCollapsed ? 0 : 1,
              transform: isCollapsed ? 'translateX(14px)' : 'translateX(0)',
              width: isCollapsed ? '0' : 'auto',
              transitionDelay: isCollapsed ? '0ms' : 'calc(var(--animation-duration-main) * 0.18)',
            }}
          >
            <p className="text-right text-[10px] font-semibold text-[rgba(11,15,18,0.48)]">
              مساحة العمل
            </p>
            <h2 className="mt-0.5 whitespace-nowrap text-right text-xl font-semibold text-[#0B0F12]">
              الإدارات
            </h2>
          </div>

          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? 'توسيع قائمة الإدارات' : 'طي قائمة الإدارات'}
            aria-expanded={!isCollapsed}
            className="group flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#DADCE0] bg-white text-[#3e494c] shadow-sm sync-transition-fast hover:border-[#3e494c]/35 hover:bg-[#F8F9FA] active:scale-95"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 sync-transition-fast group-hover:scale-110" />
            ) : (
              <ChevronLeft className="h-4 w-4 sync-transition-fast group-hover:scale-110" />
            )}
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl px-0.5 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-1.5">
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
                  className={`group relative flex min-h-[50px] items-center gap-2.5 overflow-hidden rounded-2xl border text-right sync-transition active:scale-[0.99] ${
                    isActive
                      ? 'border-[#0B0F12]/10 bg-white text-[#0B0F12] shadow-[0_10px_22px_rgba(15,23,42,0.07)]'
                      : 'border-transparent text-[rgba(11,15,18,0.62)] hover:border-white/70 hover:bg-white/58 hover:text-[#0B0F12]'
                  } ${isCollapsed ? 'justify-center px-1.5' : 'px-2.5'}`}
                  style={{
                    transition: 'all var(--animation-duration-main) var(--animation-easing)',
                    transitionDelay: isCollapsed ? '0ms' : `calc(var(--stagger-delay) * ${index})`,
                  }}
                >
                  {isActive && !isCollapsed ? (
                    <span className="absolute inset-y-2 right-1 w-1 rounded-full bg-[#0B0F12]" aria-hidden="true" />
                  ) : null}

                  <span
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border sync-transition-fast ${
                      isActive
                        ? 'border-[#0B0F12]/12 bg-[#F1F5F9] text-[#0B0F12]'
                        : 'border-[#DADCE0] bg-white/55 text-[rgba(11,15,18,0.58)] group-hover:border-[#0B0F12]/12 group-hover:text-[#0B0F12]'
                    }`}
                  >
                    <IconComponent className="h-4.5 w-4.5 sync-transition-fast group-hover:scale-105" />
                  </span>

                  <span
                    className="min-w-0 flex-1 overflow-hidden sync-transition"
                    style={{
                      opacity: isCollapsed ? 0 : 1,
                      transform: isCollapsed ? 'translateX(18px)' : 'translateX(0)',
                      width: isCollapsed ? '0' : 'auto',
                      transition: 'all var(--animation-duration-main) var(--animation-easing)',
                      transitionDelay: isCollapsed ? '0ms' : `calc(var(--base-delay) + var(--stagger-delay) * ${index})`,
                    }}
                  >
                    <span className={`block truncate text-[13px] leading-6 ${isActive ? 'font-semibold' : 'font-medium'}`}>
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
