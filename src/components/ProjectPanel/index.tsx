
import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ProjectPanelProps, ProjectTab } from './types';
import { useProjectPanel } from './useProjectPanel';
import { ProjectHeader } from './ProjectHeader';
import { ProjectQuickActions } from './ProjectQuickActions';
import { ProjectTabs } from './ProjectTabs';
import { TasksTab } from './TasksTab';

export const ProjectPanel: React.FC<ProjectPanelProps> = ({
  projectId,
  isVisible,
  onClose
}) => {
  const {
    projectData,
    activeTab,
    setActiveTab,
    loading,
    error
  } = useProjectPanel(projectId, isVisible);

  // معالجة مفتاح Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isVisible, onClose]);

  // معالجة النقر خارج اللوحة
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

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
        return <div className="p-6">التفاصيل المالية قيد التطوير</div>;
      case 'legal':
        return <div className="p-6">الشؤون القانونية قيد التطوير</div>;
      case 'client':
        return <div className="p-6">معلومات العميل قيد التطوير</div>;
      case 'reports':
        return <div className="p-6">تقارير المشروع قيد التطوير</div>;
      case 'calendar':
        return <div className="p-6">تقويم المشروع قيد التطوير</div>;
      default:
        return null;
    }
  };

  if (!isVisible) return null;

  const panelContent = (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-end"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-panel-title"
    >
      <div
        className={`
          w-[60vw] h-full bg-white/45 backdrop-blur-[20px] border-l border-white/40
          shadow-[-4px_0_20px_rgba(0,0,0,0.08)] flex flex-col
          transform transition-transform duration-300 ease-out
          ${isVisible ? 'translate-x-0' : 'translate-x-full'}
        `}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: `linear-gradient(135deg, var(--stageColor, #2f6ead)20, #ffffff00 100%), 
                      rgba(255, 255, 255, 0.45)`,
          borderRadius: '20px 0 0 20px'
        }}
      >
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
      </div>
    </div>
  );

  return createPortal(panelContent, document.body);
};

export default ProjectPanel;
