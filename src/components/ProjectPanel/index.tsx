
import React, { useEffect } from 'react';
import { ProjectPanelProps } from './types';
import { useProjectPanel } from './useProjectPanel';
import { EnhancedMotionSystem } from './EnhancedMotionSystem';
import { RedesignedPanelHeader } from './RedesignedPanelHeader';
import { ProjectBrief } from './ProjectBrief';
import { RedesignedProjectPanelTabs } from './RedesignedProjectPanelTabs';
import { EnhancedProjectDashboard } from './EnhancedProjectDashboard';
import { TasksTab } from './TasksTab';
import { FinanceTab } from './FinanceTab';
import { LegalTab } from './LegalTab';
import { ClientTab } from './ClientTab';
import { ReportsTab } from './ReportsTab';
import { CalendarTab } from './CalendarTab';
import { NotificationCenter } from './NotificationCenter';

interface ExtendedProjectPanelProps extends ProjectPanelProps {
  isSidebarCollapsed: boolean;
}

export const ProjectPanel: React.FC<ExtendedProjectPanelProps> = ({
  projectId,
  isVisible,
  onClose,
  isSidebarCollapsed
}) => {
  const {
    projectData,
    activeTab,
    setActiveTab,
    loading,
    error
  } = useProjectPanel(projectId, isVisible);

  // Key/mouse listeners, body locking
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) onClose();
    };
    const handleCustomClose = () => {
      if (isVisible) onClose();
    };
    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
      window.addEventListener('closeProjectPanel', handleCustomClose);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('closeProjectPanel', handleCustomClose);
      document.body.style.overflow = 'auto';
    };
  }, [isVisible, onClose]);

  const renderTabContent = () => {
    if (!projectData) return null;
    switch (activeTab) {
      case 'tasks':
        return <TasksTab tasks={projectData.tasks} loading={loading} />;
      case 'finance':
        return <FinanceTab projectData={projectData} loading={loading} />;
      case 'legal':
        return <LegalTab projectData={projectData} loading={loading} />;
      case 'client':
        return <ClientTab projectData={projectData} loading={loading} />;
      case 'reports':
        return <ReportsTab projectData={projectData} loading={loading} />;
      case 'calendar':
        return <CalendarTab projectData={projectData} loading={loading} />;
      case 'notifications':
        return <NotificationCenter />;
      default:
        return <EnhancedProjectDashboard projectData={projectData} loading={loading} />;
    }
  };

  if (!isVisible) return null;

  // Extract brief, client, dueDate from data if available
  const brief = projectData?.description || '';
  // client can only be a string (the name) for ProjectMetaBadges
  const client = typeof projectData?.client === 'object' && projectData?.client !== null
    ? projectData.client.name
    : typeof projectData?.client === 'string'
      ? projectData.client
      : undefined;

  // We'll demo due date with the first timeline deadline event if available
  let dueDate: string | undefined = undefined;
  if (Array.isArray(projectData?.timeline)) {
    const deadlineEvent = projectData.timeline.find(
      (event: any) => event.type === 'deadline'
    );
    if (deadlineEvent) dueDate = deadlineEvent.date;
  }

  return (
    <EnhancedMotionSystem
      isVisible={isVisible}
      onClose={onClose}
      isSidebarCollapsed={isSidebarCollapsed}
    >
      <div className="h-full flex flex-col font-arabic">
        {/* Redesigned Header */}
        {projectData && (
          <>
            <RedesignedPanelHeader
              title={projectData.title}
              status={projectData.status}
              client={client}
              dueDate={dueDate}
              onClose={onClose}
            />
            <ProjectBrief brief={brief} />
          </>
        )}

        {/* Tabs */}
        <RedesignedProjectPanelTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {error ? (
            <div className="p-6 text-center text-red-600 font-arabic">{error}</div>
          ) : (
            renderTabContent()
          )}
        </div>
      </div>
    </EnhancedMotionSystem>
  );
};

export default ProjectPanel;
