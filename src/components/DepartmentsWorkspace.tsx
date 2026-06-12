import React, { useState, useEffect } from 'react';
import { useNavigation } from '@/contexts/NavigationContext';
import DepartmentsSidebar from './DepartmentsSidebar';
import DepartmentPanel from './DepartmentPanel';
import { getDepartmentDefinition } from '@/features/ai/context/departmentRegistry';
import { registerAIContextSource } from '@/features/ai/context/projectContextBuilder';

interface DepartmentsWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const DepartmentsWorkspace: React.FC<DepartmentsWorkspaceProps> = ({ isSidebarCollapsed }) => {
  const { navigationState, setSelectedDepartment } = useNavigation();
  const [isDepartmentsSidebarCollapsed, setIsDepartmentsSidebarCollapsed] = useState(false);

  // Use navigation state for selected department
  const selectedDepartment = navigationState.selectedDepartment;

  useEffect(() => {
    const department = getDepartmentDefinition(selectedDepartment);
    return registerAIContextSource({
      id: 'departments-workspace-route',
      kind: 'department',
      data: {
        active_department: department
          ? { id: department.id, label: department.label, category: department.category }
          : { id: selectedDepartment },
        active_tab: department ? { id: department.defaultTab, departmentId: department.id } : null,
        visible_boxes: department?.tabs.flatMap((tab) => tab.boxKeys ?? []) ?? [],
      },
      permission_scope: {
        role: 'viewer',
        allowed: Boolean(selectedDepartment),
        canViewFinancial: selectedDepartment === 'financial',
        canViewLegal: selectedDepartment === 'legal',
      },
    });
  }, [selectedDepartment]);

  return (
    <>
      {/* العمود الثاني: سايدبار الإدارات */}
      <div
        className={`fixed z-sidebar h-[calc(100vh-var(--sidebar-top-offset))] ${
          isSidebarCollapsed ? 'departments-sidebar-collapsed' : 'departments-sidebar-expanded'
        }`}
        style={{
          top: 'var(--sidebar-top-offset)',
        }}
      >
        <DepartmentsSidebar
          selectedDepartment={selectedDepartment}
          onDepartmentSelect={setSelectedDepartment}
          isCollapsed={isDepartmentsSidebarCollapsed}
          onToggleCollapse={setIsDepartmentsSidebarCollapsed}
        />
      </div>

      {/* العمود الثالث: لوحة الإدارة */}
      <div
        className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] ${
          isSidebarCollapsed 
            ? (isDepartmentsSidebarCollapsed ? 'departments-panel-both-collapsed' : 'departments-panel-main-collapsed') 
            : (isDepartmentsSidebarCollapsed ? 'departments-panel-departments-collapsed' : 'departments-panel-both-expanded')
        }`}
      >
        <DepartmentPanel 
          selectedDepartment={selectedDepartment}
          isMainSidebarCollapsed={isSidebarCollapsed}
          isDepartmentsSidebarCollapsed={isDepartmentsSidebarCollapsed}
        />
      </div>
    </>
  );
};

export default DepartmentsWorkspace;