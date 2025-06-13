
import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ProjectPanelProps, ProjectTab } from './types';
import { useProjectPanel } from './useProjectPanel';
import { EnhancedMotionSystem } from './EnhancedMotionSystem';
import { ProjectPanelLayout } from './ProjectPanelLayout';
import { ProjectHeader } from './ProjectHeader';
import { EnhancedProgressBar } from './EnhancedProgressBar';
import { EnhancedBudgetCard } from './EnhancedBudgetCard';
import { EnhancedQuickActions } from './EnhancedQuickActions';
import { EnhancedProjectTabs } from './EnhancedProjectTabs';
import { TasksPreviewCard } from './TasksPreviewCard';
import { CalendarPreviewCard } from './CalendarPreviewCard';
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

  const handleAddTask = useCallback(() => {
    console.log('إضافة مهمة جديدة');
  }, []);

  const handleSmartGenerate = useCallback(() => {
    console.log('توليد ذكي للمهام');
  }, []);

  const handleEditProject = useCallback(() => {
    console.log('تعديل المشروع');
  }, []);

  const handleBudgetDetails = useCallback(() => {
    console.log('عرض التفاصيل المالية');
    setActiveTab('finance');
  }, [setActiveTab]);

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
        return (
         // Dashboard view with enhanced layout
          <ProjectPanelLayout>
            {projectData && (
              <>
                <EnhancedBudgetCard
                  totalBudget={projectData.budget.total}
                  spentBudget={projectData.budget.spent}
                  onDetailsClick={handleBudgetDetails}
                />
                
                <CalendarPreviewCard />
                
                <EnhancedQuickActions
                  onAddTask={handleAddTask}
                  onSmartGenerate={handleSmartGenerate}
                  onEditProject={handleEditProject}
                />
                
                <TasksPreviewCard tasks={projectData.tasks} />
              </>
            )}
          </ProjectPanelLayout>
        );
    }
  };

  // لا نعرض اللوحة إذا لم تكن مرئية
  if (!isVisible) {
    console.log('ProjectPanel not visible, returning null');
    return null;
  }

  console.log('ProjectPanel rendering content with Portal - enhanced structure');

  return createPortal(
    <EnhancedMotionSystem isVisible={isVisible} onClose={onClose}>
      {/* Header */}
      {projectData && (
        <ProjectHeader
          title={projectData.title}
          status={projectData.status}
          onClose={onClose}
        />
      )}

      {/* Progress Bar */}
      <div className="px-6 py-4">
        <EnhancedProgressBar />
      </div>

      {/* Tabs */}
      <EnhancedProjectTabs activeTab={activeTab} onTabChange={setActiveTab} />

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
    </EnhancedMotionSystem>,
    document.body
  );
};

export default ProjectPanel;
