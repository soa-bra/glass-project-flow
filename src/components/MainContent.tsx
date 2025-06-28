
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import ProjectWorkspace from './ProjectWorkspace';
import { DepartmentsColumn } from './DepartmentsColumn';
import { DepartmentPanel } from './DepartmentPanel';

const MainContent = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>();

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    if (section !== 'departments') {
      setSelectedDepartment(undefined);
    }
  };

  const handleDepartmentSelect = (departmentId: string) => {
    setSelectedDepartment(departmentId);
  };

  const handleDepartmentClose = () => {
    setSelectedDepartment(undefined);
  };

  return (
    <div className="flex h-screen pt-[var(--header-height)] overflow-hidden px-[22px]">
      <div 
        style={{
          transition: 'all var(--animation-duration-main) var(--animation-easing)',
          background: '#dfecf2'
        }} 
        className="fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] z-sidebar sidebar-layout"
      >
        <Sidebar 
          onToggle={setIsSidebarCollapsed} 
          onSectionChange={handleSectionChange}
          activeSection={activeSection}
        />
      </div>

      {activeSection === 'departments' && (
        <div 
          className="fixed z-20"
          style={{
            left: isSidebarCollapsed ? 'calc(var(--sidebar-width-collapsed) + 44px)' : 'calc(var(--sidebar-width-expanded) + 44px)',
            top: 'var(--sidebar-top-offset)',
            height: 'calc(100vh - var(--sidebar-top-offset))',
            transition: 'all var(--animation-duration-main) var(--animation-easing)'
          }}
        >
          <DepartmentsColumn 
            onDepartmentSelect={handleDepartmentSelect}
            selectedDepartment={selectedDepartment}
          />
        </div>
      )}

      {selectedDepartment && (
        <DepartmentPanel 
          departmentId={selectedDepartment}
          onClose={handleDepartmentClose}
          isSidebarCollapsed={isSidebarCollapsed}
        />
      )}

      {activeSection === 'home' && (
        <ProjectWorkspace isSidebarCollapsed={isSidebarCollapsed} />
      )}
    </div>
  );
};

export default MainContent;
