import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjectManagementHeader } from './ProjectManagementHeader';
import { ProjectProgressBar } from './ProjectProgressBar';
import { ProjectCardGrid } from './ProjectCardGrid';
import { AddProjectModal } from '@/components/ProjectsColumn/AddProjectModal';
import { FinancialTab, ClientTab, TeamTab, AttachmentsTab, TemplatesTab } from '@/components/ProjectPanel/ProjectTabs';
import { TaskManagementTab } from './TaskManagementTab';
import { ReportsTab } from './ReportsTab';
import { Project } from '@/types/project';
import { ProjectData } from '@/types';

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
        return <>
            {/* الإحصائيات - منقولة لتكون مع معلومات المشروع */}
            <div className="flex justify-between items-start mb-6 flex-shrink-0 py-0 my-0">
              {/* معلومات المشروع الأساسية */}
              <div className="flex-1 mx-[15px]">
                <div className="flex items-center gap-4 mb-4">
                  {/* اسم المشروع */}
                  <h2 className="text-xl font-arabic font-semibold text-gray-800">
                    {project.title}
                  </h2>

                  {/* مدير المشروع */}
                  <div className="px-3 py-1.5 bg-transparent border border-black rounded-full font-arabic text-sm text-black">
                    {project.owner}
                  </div>

                  {/* حالة المشروع */}
                  <div className="px-3 py-1.5 bg-transparent border border-black rounded-full font-arabic text-sm flex items-center gap-2 text-black">
                    <div className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: project.status === 'success' ? 'var(--status-colors-on-plan)' :
                                         project.status === 'warning' ? 'var(--status-colors-delayed)' :
                                         project.status === 'error' ? 'var(--status-colors-stopped)' :
                                         'var(--status-colors-in-preparation)'
                      }}></div>
                    {project.status === 'success' ? 'مكتمل' :
                     project.status === 'warning' ? 'متأخر' :
                     project.status === 'error' ? 'متوقف' :
                     'قيد التحضير'}
                  </div>
                </div>

                {/* النبذة التعريفية */}
                <div className="text-sm text-gray-600 font-arabic leading-relaxed max-w-2xl">
                  {project.description || "تطوير موقع إلكتروني متكامل باستخدام أحدث التقنيات وفقاً للمعايير العالمية مع ضمان الأمان والسرعة في الأداء."}
                </div>
              </div>

              {/* الإحصائيات */}
              <div className="flex-shrink-0">
                <div className="grid grid-cols-3 gap-6 px-[45px] my-0">
                  {/* الإيرادات المتوقعة */}
                  <div className="text-right p-6 py-0 px-[20px]">
                    <div className="mb-2">
                      <span className="text-sm text-black font-arabic font-medium">الإيرادات المتوقعة</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-1 px-0 mx-0">
                      <div className="text-3xl font-normal text-gray-900 font-arabic">
                        {mockStats.expectedRevenue || 0}
                      </div>
                      <div className="text-xs text-black font-arabic font-bold">الف</div>
                    </div>
                    <div className="text-xs font-Regular text-black font-arabic">ريال سعودي والمتبقي منها 25 الف</div>
                  </div>

                  {/* الشكاوى */}
                  <div className="text-right p-6 mx-0 py-0 px-[20px]">
                    <div className="mb-2">
                      <span className="text-sm text-black font-arabic font-medium">الشكاوى</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-1 px-0 mx-0">
                      <div className="text-3xl font-normal text-gray-900 font-arabic">
                        {String(mockStats.complaints || 0).padStart(2, '0')}
                      </div>
                      <div className="text-xs text-black font-arabic font-bold">يوم</div>
                    </div>
                    <div className="text-xs font-Regular text-black font-arabic">وعدد المهام المتبقية: 5 مهام</div>
                  </div>

                  {/* المشاريع المتأخرة */}
                  <div className="text-right p-6 py-0 px-[20px]">
                    <div className="mb-2">
                      <span className="text-sm text-black font-arabic font-medium">عدد اعضاء فريق المشروع</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-1 px-0 mx-0">
                      <div className="text-3xl font-normal text-gray-900 font-arabic">
                        {String(mockStats.delayedProjects || 0).padStart(2, '0')}
                      </div>
                      <div className="text-xs text-black font-arabic font-bold">عضو</div>
                    </div>
                    <div className="text-xs font-Regular text-black font-arabic">ومعدل الانجاز العام 94٪</div>
                  </div>
                </div>
              </div>
            </div>

            {/* شريط تقدم المراحل */}
            <div className="flex-shrink-10 my-0 px-0 mx-[15px]">
              <ProjectProgressBar progress={project.progress || 0} stages={[{
              label: 'التحضير'
            }, {
              label: 'التنفيذ المبدئي'
            }, {
              label: 'المراجعة الأولية'
            }, {
              label: 'المعالجة الأولية'
            }, {
              label: 'المراجعة النهائية'
            }, {
              label: 'المعالجة النهائية'
            }]} />
            </div>

            {/* المحتوى الرئيسي */}
            <div className="flex-1 min-h-0 my-0 py-[12px]">
              <ProjectCardGrid project={project} />
            </div>
          </>;
      case 'tasks':
        return <TaskManagementTab project={project} />;
      case 'finance':
        return <div className="flex-1 overflow-auto">
            <FinancialTab data={project} />
          </div>;
      case 'team':
        return <div className="flex-1 overflow-auto">
            <TeamTab teamData={project.team} />
          </div>;
      case 'client':
        return <div className="flex-1 overflow-auto">
            <ClientTab clientData={null} />
          </div>;
      case 'files':
        return <div className="flex-1 overflow-auto">
            <AttachmentsTab documents={null} />
          </div>;
      case 'templates':
        return <div className="flex-1 overflow-auto">
            <TemplatesTab templates={null} />
          </div>;
      case 'reports':
        return <div className="flex-1 overflow-auto">
            <ReportsTab project={project} />
          </div>;
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
