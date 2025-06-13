
import React, { useEffect, useCallback } from 'react';
import { ProjectPanelProps, ProjectTab } from './types';
import { useProjectPanel } from './useProjectPanel';
import { MotionSystem } from './MotionSystem';
import { ProjectHeader } from './ProjectHeader';
import { ProjectQuickActions } from './ProjectQuickActions';
import { ProjectTabs } from './ProjectTabs';
import { TasksTab } from './TasksTab';
import { FinanceTab } from './FinanceTab';
import { LegalTab } from './LegalTab';
import { ClientTab } from './ClientTab';
import { ReportsTab } from './ReportsTab';
import { CalendarTab } from './CalendarTab';
import { NotificationCenter } from './NotificationCenter';

export const ProjectPanel: React.FC<ProjectPanelProps> = ({
  projectId,
  isVisible,
  onClose
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

  const handleAddTask = useCallback(() => {
    console.log('إضافة مهمة جديدة');
  }, []);

  const handleSmartGenerate = useCallback(() => {
    console.log('توليد ذكي للمهام');
  }, []);

  const handleEditProject = useCallback(() => {
    console.log('تعديل المشروع');
  }, []);

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
        return null;
    }
  };

  // لا نعرض اللوحة إذا لم تكن مرئية
  if (!isVisible) {
    console.log('ProjectPanel not visible, returning null');
    return null;
  }

  console.log('ProjectPanel rendering content - main structure');

  return (
    <MotionSystem isVisible={isVisible} onClose={onClose}>
      {/* Header */}
      {projectData && (
        <ProjectHeader
          title={projectData.title}
          status={projectData.status}
          onClose={onClose}
        />
      )}

      {/* Quick Actions */}
      <div className="p-6">
        <ProjectQuickActions
          onAddTask={handleAddTask}
          onSmartGenerate={handleSmartGenerate}
          onEditProject={handleEditProject}
        />
      </div>

      {/* Tabs */}
      <ProjectTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {error ? (
          <div className="p-6 text-center text-red-600">
            {error}
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
    </MotionSystem>
  );
};

export default ProjectPanel;
