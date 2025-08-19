import React, { useState } from 'react';
import { Trash2, Archive, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjectManagementHeader } from './ProjectManagementHeader';
import { ProjectProgressBar } from './ProjectProgressBar';
import { useUnifiedTasks } from '@/hooks/useUnifiedTasks';
import { ProjectCardGrid } from './ProjectCardGrid';
import { AddProjectModal } from '@/components/ProjectsColumn/AddProjectModal';
import { FinancialTab, ClientTab, TeamTab, AttachmentsTab, TemplatesTab } from '@/components/ProjectPanel/ProjectTabs';
import { TaskManagementTab } from './TaskManagementTab';
import { ReportsTab } from './ReportsTab';
import { Project } from '@/types/project';
import { ProjectData } from '@/types';
import { Reveal, Stagger } from '@/components/shared/motion';
import { cn } from '@/lib/utils';
interface ProjectManagementBoardProps {
  project: Project;
  isVisible: boolean;
  onClose: () => void;
  isSidebarCollapsed: boolean;
  onProjectUpdated?: (project: ProjectData) => void;
  className?: string;
}
export const ProjectManagementBoard: React.FC<ProjectManagementBoardProps> = ({
  project,
  isVisible,
  onClose,
  isSidebarCollapsed,
  onProjectUpdated,
  className = ""
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // استخدام useUnifiedTasks لحساب التقدم الحقيقي بناءً على المهام
  const unifiedTasks = useUnifiedTasks(project.id);
  const actualProgress = unifiedTasks.getProjectProgress();
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
    tasksCount: project.tasksCount || 0
  };
  const tabs = [{
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
  }];

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
              <Reveal delay={0}>
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
                      <div className="w-2 h-2 rounded-full" style={{
                      backgroundColor: project.status === 'success' ? 'var(--status-colors-on-plan)' : project.status === 'warning' ? 'var(--status-colors-delayed)' : project.status === 'error' ? 'var(--status-colors-stopped)' : 'var(--status-colors-in-preparation)'
                    }}></div>
                      {project.status === 'success' ? 'مكتمل' : project.status === 'warning' ? 'متأخر' : project.status === 'error' ? 'متوقف' : 'قيد التحضير'}
                    </div>
                  </div>

                  {/* النبذة التعريفية */}
                  <div className="text-sm text-gray-600 font-arabic leading-relaxed max-w-2xl">
                    {project.description || "تطوير موقع إلكتروني متكامل باستخدام أحدث التقنيات وفقاً للمعايير العالمية مع ضمان الأمان والسرعة في الأداء."}
                  </div>
                </div>
              </Reveal>

              {/* الإحصائيات */}
              <Reveal delay={0.15}>
                <div className="flex-shrink-0">
                  <Stagger delay={0.25} gap={0.12} className="grid grid-cols-3 gap-6 px-[45px] my-0">
                    {/* الإيرادات المتوقعة */}
                    <Stagger.Item className="text-right p-6 py-0 px-[20px]">
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
                    </Stagger.Item>

                    {/* الشكاوى */}
                    <Stagger.Item className="text-right p-6 mx-0 py-0 px-[20px]">
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
                    </Stagger.Item>

                    {/* المشاريع المتأخرة */}
                    <Stagger.Item className="text-right p-6 py-0 px-[20px]">
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
                    </Stagger.Item>
                  </Stagger>
                </div>
              </Reveal>
            </div>

            {/* شريط تقدم المراحل */}
            <Reveal delay={0.3}>
              <div className="flex-shrink-10 my-0 px-0 mx-[15px]">
                <ProjectProgressBar progress={actualProgress} stages={[{
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
            </Reveal>

            {/* المحتوى الرئيسي */}
            <Reveal delay={0.45}>
              <div className="flex-1 min-h-0 my-0 py-0">
                <ProjectCardGrid project={project} />
              </div>
            </Reveal>
          </>;
      case 'tasks':
        return <Reveal delay={0.2}><TaskManagementTab project={project} /></Reveal>;
      case 'finance':
        return <div className="flex-1 overflow-auto">
            <Reveal delay={0.2}><FinancialTab data={project} /></Reveal>
          </div>;
      case 'team':
        return <div className="flex-1 overflow-auto">
            <Reveal delay={0.2}><TeamTab teamData={project.team} /></Reveal>
          </div>;
      case 'client':
        return <div className="flex-1 overflow-auto">
            <Reveal delay={0.2}><ClientTab clientData={null} /></Reveal>
          </div>;
      case 'files':
        return <div className="flex-1 overflow-auto">
            <Reveal delay={0.2}><AttachmentsTab documents={null} /></Reveal>
          </div>;
      case 'templates':
        return <div className="flex-1 overflow-auto">
            <Reveal delay={0.2}><TemplatesTab templates={null} /></Reveal>
          </div>;
      case 'reports':
        return <div className="flex-1 overflow-auto">
            <Reveal delay={0.2}><ReportsTab project={project} /></Reveal>
          </div>;
      default:
        return null;
    }
  };
  if (!isVisible) return null;

  return (
    <main
      className={cn(
        "h-[100dvh] flex flex-col overflow-hidden",
        "[padding-bottom:env(safe-area-inset-bottom)]",
        className
      )}
    >
      <ProjectManagementHeader 
        className="sticky top-0 z-30 shrink-0" 
        project={project} 
        onClose={onClose} 
        onDelete={() => setShowDeleteDialog(true)} 
        onArchive={() => setShowArchiveDialog(true)} 
        onEdit={handleEditProject} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        tabs={tabs} 
      />
      
      <section className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* محتوى التبويب يمرّر رأسيًا */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {renderTabContent()}
        </div>
      </section>

      {/* حوارات التأكيد */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="font-arabic" dir="rtl" style={{
          background: 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '24px'
        }}>
          <DialogHeader>
            <DialogTitle className="text-right">تأكيد حذف المشروع</DialogTitle>
            <DialogDescription className="text-right">
              هل أنت متأكد من أنك تريد حذف هذا المشروع نهائياً؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-3 mt-6">
            <button onClick={() => setShowDeleteDialog(false)} className="bg-white/30 hover:bg-white/40 border border-black/20 text-black font-medium font-arabic rounded-full px-6 py-2 flex items-center gap-2">
              <X size={16} />
              إلغاء
            </button>
            <button onClick={handleDeleteProject} className="bg-red-500 hover:bg-red-600 text-white font-medium font-arabic rounded-full px-6 py-2 flex items-center gap-2">
              <Trash2 size={16} />
              حذف نهائي
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <DialogContent className="font-arabic" dir="rtl" style={{
          background: 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '24px'
        }}>
          <DialogHeader>
            <DialogTitle className="text-right">تأكيد أرشفة المشروع</DialogTitle>
            <DialogDescription className="text-right">
              هل أنت متأكد من أنك تريد أرشفة هذا المشروع؟ يمكنك استعادته لاحقاً من الأرشيف.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-3 mt-6">
            <button onClick={() => setShowArchiveDialog(false)} className="bg-white/30 hover:bg-white/40 border border-black/20 text-black font-medium font-arabic rounded-full px-6 py-2 flex items-center gap-2">
              <X size={16} />
              إلغاء
            </button>
            <button onClick={handleArchiveProject} className="bg-black hover:bg-black/90 text-white font-medium font-arabic rounded-full px-6 py-2 flex items-center gap-2">
              <Archive size={16} />
              أرشفة
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* نافذة تعديل المشروع */}
      <AddProjectModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        onProjectAdded={() => {}} 
        onProjectUpdated={handleProjectUpdated} 
        editingProject={editingProjectData} 
        isEditMode={true} 
      />
    </main>
  );
};