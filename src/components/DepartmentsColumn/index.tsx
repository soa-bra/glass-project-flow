
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DepartmentsList } from './DepartmentsList';

export interface Department {
  id: string;
  name: string;
  icon?: React.ComponentType<any>;
}

const DEPARTMENTS: Department[] = [
  { id: 'financial', name: 'إدارة الأوضاع المالية' },
  { id: 'legal', name: 'إدارة الأحوال القانونية' },
  { id: 'marketing', name: 'إدارة الأنشطة التسويقية' },
  { id: 'projects', name: 'إدارة المشاريع' },
  { id: 'hr', name: 'إدارة الطاقات البشرية' },
  { id: 'clients', name: 'إدارة علاقات العملاء' },
  { id: 'social', name: 'إدارة المسؤولية الاجتماعية' },
  { id: 'training', name: 'إدارة التدريب' },
  { id: 'knowledge', name: 'إدارة المعرفة والنشر والبحث العلمي' },
  { id: 'brand', name: 'إدارة العلامة التجارية' }
];

interface DepartmentsColumnProps {
  onDepartmentSelect: (departmentId: string) => void;
  selectedDepartment?: string;
}

export const DepartmentsColumn: React.FC<DepartmentsColumnProps> = ({
  onDepartmentSelect,
  selectedDepartment
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      style={{
        width: isCollapsed ? '80px' : '320px',
        transition: 'all var(--animation-duration-main) var(--animation-easing)',
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px'
      }}
      className="h-full flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/20">
        <div 
          className="flex-1 overflow-hidden"
          style={{
            opacity: isCollapsed ? 0 : 1,
            transform: isCollapsed ? 'translateX(24px) scale(0.9)' : 'translateX(0) scale(1)',
            transition: 'all var(--animation-duration-main) var(--animation-easing)',
            transitionDelay: isCollapsed ? '0ms' : 'calc(var(--animation-duration-main) * 0.4)'
          }}
        >
          <h2 className="text-2xl font-arabic font-medium text-gray-800 whitespace-nowrap">
            الإدارات
          </h2>
        </div>
        
        <button 
          onClick={toggleCollapse}
          className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300/50 hover:border-gray-400/60 hover:bg-white/20 hover:shadow-lg transition-all duration-300 flex-shrink-0"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Departments List */}
      <div className="flex-1 overflow-y-auto p-4">
        <DepartmentsList 
          departments={DEPARTMENTS}
          isCollapsed={isCollapsed}
          selectedDepartment={selectedDepartment}
          onDepartmentSelect={onDepartmentSelect}
        />
      </div>
    </div>
  );
};
