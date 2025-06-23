
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjectManagementHeader } from './ProjectManagementHeader';
import { ProjectProgressBar } from './ProjectProgressBar';
import { ProjectCardGrid } from './ProjectCardGrid';
import { Project } from '@/types/project';

interface ProjectManagementBoardProps {
  project: Project;
  isVisible: boolean;
  onClose: () => void;
  isSidebarCollapsed: boolean;
}

export const ProjectManagementBoard: React.FC<ProjectManagementBoardProps> = ({
  project,
  isVisible,
  onClose,
  isSidebarCollapsed
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  if (!isVisible) return null;

  const handleDeleteProject = () => {
    console.log('حذف المشروع:', project.id);
    setShowDeleteDialog(false);
    onClose();
  };

  const handleArchiveProject = () => {
    console.log('أرشفة المشروع:', project.id);
    setShowArchiveDialog(false);
    onClose();
  };

  const handleEditProject = () => {
    console.log('تعديل المشروع:', project.id);
  };

  const tabs = [
    { id: 'overview', label: 'نظرة عامة' },
    { id: 'tasks', label: 'إدارة المهام' },
    { id: 'finance', label: 'الوضع المالي' },
    { id: 'team', label: 'الفريق' },
    { id: 'client', label: 'العميل' },
    { id: 'files', label: 'المرفقات' },
    { id: 'reports', label: 'التقارير' }
  ];

  return (
    <div 
      className={`fixed z-[1200] ${isSidebarCollapsed ? 'project-details-collapsed' : 'project-details-expanded'}`}
      style={{
        top: "var(--sidebar-top-offset)",
        height: "calc(100vh - var(--sidebar-top-offset))",
        borderRadius: "24px",
        background: "#ebe2e9",
        border: "1px solid rgba(255,255,255,0.2)",
        transition: "all var(--animation-duration-main) cubic-bezier(0.4,0,0.2,1)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
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

      {/* شريط تقدم المراحل */}
      <div className="mb-6 flex-shrink-0">
        <ProjectProgressBar
          progress={project.progress || 0}
          stages={[
            { label: 'التحضير' },
            { label: 'التنفيذ المبدئي' },
            { label: 'المراجعة الأولية' },
            { label: 'المعالجة الأولية' },
            { label: 'المراجعة النهائية' },
            { label: 'المعالجة النهائية' },
          ]}
        />
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex-1 min-h-0">
        <ProjectCardGrid project={project} />
      </div>

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
            <button 
              onClick={() => setShowDeleteDialog(false)} 
              className="px-4 py-2 bg-white/60 backdrop-filter backdrop-blur-lg border border-white/20 rounded-lg hover:bg-white/80 transition-colors font-arabic"
            >
              إلغاء
            </button>
            <button 
              onClick={handleDeleteProject} 
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-arabic"
            >
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
            <button 
              onClick={() => setShowArchiveDialog(false)} 
              className="px-4 py-2 bg-white/60 backdrop-filter backdrop-blur-lg border border-white/20 rounded-lg hover:bg-white/80 transition-colors font-arabic"
            >
              إلغاء
            </button>
            <button 
              onClick={handleArchiveProject} 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-arabic"
            >
              أرشفة
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
