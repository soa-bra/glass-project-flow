
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

  return (
    <div
      className={`fixed z-[1200] sync-transition ${
        isSidebarCollapsed ? 'project-details-collapsed' : 'project-details-expanded'
      }`}
      style={{
        top: "var(--sidebar-top-offset)",
        height: "calc(100vh - var(--sidebar-top-offset))",
        borderRadius: "32px",
        background: "var(--backgrounds-project-mgmt-board-bg)",
        boxShadow: "0 8px 32px rgba(31,38,135,0.14), inset 0 1px 0 rgba(255,255,255,0.4)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.2)",
        transition: "all var(--animation-duration-main) cubic-bezier(0.4,0,0.2,1)",
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* الرأس */}
      <ProjectManagementHeader
        project={project}
        onClose={onClose}
        onDelete={() => setShowDeleteDialog(true)}
        onArchive={() => setShowArchiveDialog(true)}
        onEdit={handleEditProject}
      />

      {/* شريط تقدم المراحل */}
      <div className="mb-6 flex-shrink-0">
        <ProjectProgressBar progress={project.progress || 65} />
      </div>

      {/* التبويبات */}
      <div className="flex gap-2 mb-6 flex-shrink-0">
        <div className="bg-black text-white px-6 py-2 rounded-full font-arabic text-sm">
          نظرة عامة
        </div>
        <div className="bg-white/30 text-gray-700 px-6 py-2 rounded-full font-arabic text-sm cursor-pointer hover:bg-white/40 transition-colors">
          التقارير
        </div>
        <div className="bg-white/30 text-gray-700 px-6 py-2 rounded-full font-arabic text-sm cursor-pointer hover:bg-white/40 transition-colors">
          الفريق
        </div>
        <div className="bg-white/30 text-gray-700 px-6 py-2 rounded-full font-arabic text-sm cursor-pointer hover:bg-white/40 transition-colors">
          العميل
        </div>
        <div className="bg-white/30 text-gray-700 px-6 py-2 rounded-full font-arabic text-sm cursor-pointer hover:bg-white/40 transition-colors">
          المرفقات
        </div>
        <div className="bg-white/30 text-gray-700 px-6 py-2 rounded-full font-arabic text-sm cursor-pointer hover:bg-white/40 transition-colors">
          الوضع المالي
        </div>
        <div className="bg-white/30 text-gray-700 px-6 py-2 rounded-full font-arabic text-sm cursor-pointer hover:bg-white/40 transition-colors">
          إدارة المهام
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex-1 min-h-0">
        <ProjectCardGrid project={project} />
      </div>

      {/* حوارات التأكيد */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="font-arabic">
          <DialogHeader>
            <DialogTitle>تأكيد حذف المشروع</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من أنك تريد حذف هذا المشروع نهائياً؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <button
              onClick={() => setShowDeleteDialog(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleDeleteProject}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              حذف نهائي
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <DialogContent className="font-arabic">
          <DialogHeader>
            <DialogTitle>تأكيد أرشفة المشروع</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من أنك تريد أرشفة هذا المشروع؟ يمكنك استعادته لاحقاً من الأرشيف.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <button
              onClick={() => setShowArchiveDialog(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleArchiveProject}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              أرشفة
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
