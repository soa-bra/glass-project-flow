
import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ProjectPanelProps, ProjectTab } from './types';
import { useProjectPanel } from './useProjectPanel';
import { EnhancedMotionSystem } from './EnhancedMotionSystem';
import { ProjectPanelHeader } from './ProjectPanelHeader';
import { ProjectPanelTabs } from './ProjectPanelTabs';
import { ProjectDashboard } from './ProjectDashboard';
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
  console.log('ProjectPanel render - projectId:', projectId, 'isVisible:', isVisible);

  const {
    projectData,
    activeTab,
    setActiveTab,
    loading,
    error
  } = useProjectPanel(projectId, isVisible);

  console.log('ProjectPanel data - projectData:', projectData, 'loading:', loading, 'error:', error);

  // معالجة مفتاح Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        console.log('إغلاق اللوحة بمفتاح Escape');
        onClose();
      }
    };

    if (isVisible) {
      console.log('تفعيل معالجة مفتاح Escape وإخفاء scroll');
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      console.log('إعادة تفعيل scroll');
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
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
        return <ProjectDashboard projectData={projectData} loading={loading} />;
    }
  };

  // لا نعرض اللوحة إذا لم تكن مرئية
  if (!isVisible) {
    console.log('ProjectPanel not visible, returning null');
    return null;
  }

  console.log('ProjectPanel rendering content');

  return (
    <EnhancedMotionSystem 
      isVisible={isVisible} 
      onClose={onClose} 
      isSidebarCollapsed={isSidebarCollapsed}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        {projectData && (
          <ProjectPanelHeader
            title={projectData.title}
            status={projectData.status}
            onClose={onClose}
          />
        )}

        {/* Tabs */}
        <ProjectPanelTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {error ? (
            <div className="p-6 text-center text-red-600 font-arabic">
              {error}
            </div>
          ) : (
            renderTabContent()
          )}
        </div>
      </div>
    </EnhancedMotionSystem>
  );
};

export default ProjectPanel;
