import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjectManagementHeader } from './ProjectManagementHeader';
import { ProjectProgressBar } from './ProjectProgressBar';
import { ProjectCardGrid } from './ProjectCardGrid';
import { AddProjectModal } from '@/components/ProjectsColumn/AddProjectModal';
import { FinancialTab, ClientTab, TeamTab, AttachmentsTab, TemplatesTab } from './ProjectTabs';
import { TaskManagementTab } from './TaskManagementTab';
import { ReportsTab } from './ReportsTab';
import { BaseProjectTabLayout } from './BaseProjectTabLayout';
import { SPACING, TYPOGRAPHY, COLORS, buildCardClasses, LAYOUT } from '@/components/shared/design-system/constants';
import { Project } from '@/types/project';
import { ProjectData } from '@/types';
import { Reveal, Stagger } from '@/components/shared/motion';

interface ProjectManagementBoardProps {
  project: Project;
  isVisible: boolean;
  onClose: () => void;
  isSidebarCollapsed: boolean;
  onProjectUpdated?: (project: ProjectData) => void;
}

export const ProjectManagementBoard: React.FC<ProjectManagementBoardProps> = ({
  project,
  isVisible,
  onClose,
  isSidebarCollapsed,
  onProjectUpdated
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  if (!isVisible) return null;

  const handleDeleteProject = () => {
    // تنفيذ عملية حذف المشروع
    setShowDeleteDialog(false);
    onProjectUpdated?.(editingProjectData);
    onClose();
  };

  const handleArchiveProject = () => {
    // تنفيذ عملية أرشفة المشروع
    setShowArchiveDialog(false);
    onProjectUpdated?.(editingProjectData);
    onClose();
  };

  const handleEditProject = () => {
    setShowEditModal(true);
  };

  const handleProjectUpdated = (updatedProject: ProjectData) => {
    onProjectUpdated?.(updatedProject);
    setShowEditModal(false);
  };

  // تحويل بيانات المشروع للتوافق مع نموذج AddProjectModal
  const editingProjectData: ProjectData = {
    id: Number(project.id),
    name: project.title,
    description: project.description,
    owner: project.owner,
    deadline: project.date,
    team: project.team?.map(t => t.name) || [],
    status: project.status,
    budget: Number(project.value) || 0,
    tasksCount: project.tasksCount || 0,
  };

  const tabs = [
    {
      id: 'overview',
      label: 'نظرة عامة'
    }, {
      id: 'tasks',
      label: 'إدارة المهام'
    }, {
      id: 'finance',
      label: 'الإدارة المالية'
    }, {
      id: 'team',
      label: 'إدارة الفريق'
    }, {
      id: 'client',
      label: 'العميل'
    }, {
      id: 'files',
      label: 'إدارة المرفقات'
    }, {
      id: 'templates',
      label: 'النماذج والقوالب'
    }, {
      id: 'reports',
      label: 'التقارير'
    }
  ];

  // بيانات وهمية للإحصائيات
  const mockStats = {
    expectedRevenue: 250,
    complaints: 12,
    delayedProjects: 3
  };

  // محتوى التبويبات المختلفة
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <BaseProjectTabLayout 
            value="overview"
            kpiStats={[
              {
                title: 'الإيرادات المتوقعة',
                value: String(mockStats.expectedRevenue || 0),
                unit: 'ألف ر.س',
                description: 'الإيرادات المتوقعة من المشروع'
              },
              {
                title: 'أيام التأخير',
                value: String(mockStats.complaints || 0).padStart(2, '0'),
                unit: 'يوم',
                description: 'المهام المتبقية: 5 مهام'
              },
              {
                title: 'أعضاء الفريق',
                value: String(mockStats.delayedProjects || 0).padStart(2, '0'),
                unit: 'عضو',
                description: 'معدل الإنجاز العام 94%'
              }
            ]}
          >
            {/* Project Information */}
            <div className={buildCardClasses('mb-6')}>
              <div className="flex items-center gap-4 mb-4">
                <h2 className={`${TYPOGRAPHY.H2} ${COLORS.PRIMARY_TEXT} ${TYPOGRAPHY.ARABIC_FONT}`}>
                  {project.title}
                </h2>
                <div className="px-3 py-1.5 bg-transparent border border-gray-300 rounded-full text-sm">
                  {project.owner}
                </div>
                <div className="px-3 py-1.5 bg-transparent border border-gray-300 rounded-full text-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: project.status === 'success' ? '#3DBE8B' :
                                       project.status === 'warning' ? '#F6C445' :
                                       project.status === 'error' ? '#E5564D' :
                                       '#3DA8F5'
                    }}></div>
                  {project.status === 'success' ? 'مكتمل' :
                   project.status === 'warning' ? 'متأخر' :
                   project.status === 'error' ? 'متوقف' :
                   'قيد التحضير'}
                </div>
              </div>
              <div className={`${TYPOGRAPHY.BODY} ${COLORS.SECONDARY_TEXT} ${TYPOGRAPHY.ARABIC_FONT} leading-relaxed max-w-2xl`}>
                {project.description || "تطوير موقع إلكتروني متكامل باستخدام أحدث التقنيات وفقاً للمعايير العالمية مع ضمان الأمان والسرعة في الأداء."}
              </div>
            </div>

            {/* Progress Bar */}
            <div className={buildCardClasses('mb-6')}>
              <ProjectProgressBar progress={project.progress || 0} stages={[
                { label: 'التحضير' },
                { label: 'التنفيذ المبدئي' },
                { label: 'المراجعة الأولية' },
                { label: 'المعالجة الأولية' },
                { label: 'المراجعة النهائية' },
                { label: 'المعالجة النهائية' }
              ]} />
            </div>

            {/* Project Cards Grid */}
            <ProjectCardGrid project={project} />
          </BaseProjectTabLayout>
        );
      case 'tasks':
        return <TaskManagementTab project={project} />;
      case 'finance':
        return <FinancialTab data={project} />;
      case 'team':
        return <TeamTab teamData={project.team} />;
      case 'client':
        return <ClientTab clientData={null} />;
      case 'files':
        return <AttachmentsTab documents={null} />;
      case 'templates':
        return <TemplatesTab templates={null} />;
      case 'reports':
        return <ReportsTab project={project} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className={`fixed z-[1200] ${isSidebarCollapsed ? 'project-details-collapsed' : 'project-details-expanded'}`} style={{
        top: "var(--sidebar-top-offset)",
        height: "calc(100vh - var(--sidebar-top-offset))",
        borderRadius: "24px",
        background: "#e4f3f7",
        border: "1px solid rgba(255,255,255,0.2)",
        transition: "all var(--animation-duration-main) cubic-bezier(0.4,0,0.2,1)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        {/* الرأس */}
        <ProjectManagementHeader 
          project={project} 
          onClose={onClose} 
          onDelete={() => setShowDeleteDialog(true)} 
          onArchive={() => setShowArchiveDialog(true)} 
          onEdit={handleEditProject} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          tabs={tabs} 
        />

        {/* محتوى التبويبة النشطة */}
        {renderTabContent()}

        {/* حوارات التأكيد */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="font-arabic bg-white backdrop-filter backdrop-blur-lg border border-white/20">
            <DialogHeader>
              <DialogTitle className="text-gray-800">تأكيد حذف المشروع</DialogTitle>
              <DialogDescription className="text-gray-600">
                هل أنت متأكد من أنك تريد حذف هذا المشروع نهائياً؟ لا يمكن التراجع عن هذا الإجراء.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 justify-end mt-4">
              <button onClick={() => setShowDeleteDialog(false)} className="px-4 py-2 bg-white/60 backdrop-filter backdrop-blur-lg border border-white/20 rounded-lg hover:bg-white/80 transition-colors font-arabic">
                إلغاء
              </button>
              <button onClick={handleDeleteProject} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-arabic">
                حذف نهائي
              </button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
          <DialogContent className="font-arabic bg-white backdrop-filter backdrop-blur-lg border border-white/20">
            <DialogHeader>
              <DialogTitle className="text-gray-800">تأكيد أرشفة المشروع</DialogTitle>
              <DialogDescription className="text-gray-600">
                هل أنت متأكد من أنك تريد أرشفة هذا المشروع؟ يمكنك استعادته لاحقاً من الأرشيف.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 justify-end mt-4">
              <button onClick={() => setShowArchiveDialog(false)} className="px-4 py-2 bg-white/60 backdrop-filter backdrop-blur-lg border border-white/20 rounded-lg hover:bg-white/80 transition-colors font-arabic">
                إلغاء
              </button>
              <button onClick={handleArchiveProject} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-arabic">
                أرشفة
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* نافذة تعديل المشروع */}
      <AddProjectModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onProjectAdded={() => {}} // لن تستخدم في حالة التعديل
        onProjectUpdated={handleProjectUpdated}
        editingProject={editingProjectData}
        isEditMode={true}
      />
    </>
  );
};
