
import React from 'react';
import { Building2, Users, TrendingUp, Briefcase, Heart, GraduationCap, BookOpen, Award } from 'lucide-react';
import type { Department } from './index';

const DEPARTMENT_ICONS = {
  financial: TrendingUp,
  legal: Briefcase,
  marketing: TrendingUp,
  projects: Building2,
  hr: Users,
  clients: Users,
  social: Heart,
  training: GraduationCap,
  knowledge: BookOpen,
  brand: Award
};

interface DepartmentsListProps {
  departments: Department[];
  isCollapsed: boolean;
  selectedDepartment?: string;
  onDepartmentSelect: (departmentId: string) => void;
}

export const DepartmentsList: React.FC<DepartmentsListProps> = ({
  departments,
  isCollapsed,
  selectedDepartment,
  onDepartmentSelect
}) => {
  return (
    <div className="space-y-2">
      {departments.map((department, index) => {
        const IconComponent = DEPARTMENT_ICONS[department.id as keyof typeof DEPARTMENT_ICONS] || Building2;
        const isActive = selectedDepartment === department.id;
        
        return (
          <button
            key={department.id}
            onClick={() => onDepartmentSelect(department.id)}
            className={`
              w-full flex items-center gap-3 text-right group relative overflow-hidden transition-all duration-300
              ${isActive 
                ? 'bg-white/30 text-gray-800 font-medium rounded-xl shadow-lg border border-white/50 scale-105' 
                : 'text-gray-600 hover:bg-white/15 hover:text-gray-800 font-light rounded-xl hover:shadow-md border border-transparent hover:border-white/30 hover:scale-105 active:scale-95'
              }
              ${isCollapsed ? 'justify-center px-2 py-3' : 'px-3 py-3'}
            `}
            style={{
              transition: `all var(--animation-duration-main) var(--animation-easing)`,
              transitionDelay: isCollapsed ? '0ms' : `calc(50ms * ${index})`
            }}
          >
            {/* Icon Container */}
            <div className={`
                w-12 h-12 flex items-center justify-center flex-shrink-0 border rounded-xl transition-all duration-300
                ${isActive 
                  ? 'bg-white/30 border-gray-600/60 shadow-lg scale-110' 
                  : 'border-gray-600/30 group-hover:border-gray-600/60 group-hover:bg-white/20 group-hover:shadow-md group-hover:scale-110 group-active:scale-95'
                }
              `}>
              <IconComponent className={`
                  w-5 h-5 transition-all duration-300
                  ${isActive 
                    ? 'text-gray-800 scale-110' 
                    : 'text-gray-600 group-hover:text-gray-800 group-hover:scale-110'
                  }
                `} />
            </div>
            
            {/* Label */}
            <div 
              className="flex-1 flex items-center overflow-hidden"
              style={{
                opacity: isCollapsed ? 0 : 1,
                transform: isCollapsed ? 'translateX(32px) scale(0.9)' : 'translateX(0) scale(1)',
                width: isCollapsed ? '0' : 'auto',
                transition: 'all var(--animation-duration-main) var(--animation-easing)',
                transitionDelay: isCollapsed ? '0ms' : `calc(100ms + 30ms * ${index})`
              }}
            >
              <span className={`text-sm whitespace-nowrap transition-all duration-300 ${isActive ? 'font-semibold' : 'group-hover:font-medium'}`}>
                {department.name}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
