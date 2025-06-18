import React, { useState } from 'react';
import { X, Edit, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
  const [activeTab, setActiveTab] = useState('overview');
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
        padding: "32px 40px",
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

      {/* التبويبات والمحتوى */}
      <div className="flex-1 min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          {/* شريط التبويبات */}
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <TabsList className="bg-transparent p-0 h-auto gap-1">
              <TabsTrigger 
                value="overview" 
                className="text-base font-arabic data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white/30 rounded-full px-4 py-2"
              >
                نظرة عامة
              </TabsTrigger>
              <TabsTrigger 
                value="tasks" 
                className="text-base font-arabic data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white/30 rounded-full px-4 py-2"
              >
                إدارة المهام
              </TabsTrigger>
              <TabsTrigger 
                value="finance" 
                className="text-base font-arabic data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white/30 rounded-full px-4 py-2"
              >
                الوضع المالي
              </TabsTrigger>
              <TabsTrigger 
                value="attachments" 
                className="text-base font-arabic data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white/30 rounded-full px-4 py-2"
              >
                المرفقات
              </TabsTrigger>
              <TabsTrigger 
                value="client" 
                className="text-base font-arabic data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white/30 rounded-full px-4 py-2"
              >
                العميل
              </TabsTrigger>
              <TabsTrigger 
                value="team" 
                className="text-base font-arabic data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white/30 rounded-full px-4 py-2"
              >
                الفريق
              </TabsTrigger>
              <TabsTrigger 
                value="reports" 
                className="text-base font-arabic data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white/30 rounded-full px-4 py-2"
              >
                التقارير
              </TabsTrigger>
            </TabsList>
          </div>

          {/* محتوى التبويبات */}
          <div className="flex-1 min-h-0">
            <TabsContent value="overview" className="flex-1 m-0 p-0 h-full">
              <ProjectCardGrid project={project} />
            </TabsContent>
            
            <TabsContent value="tasks" className="flex-1 m-0 p-0 h-full">
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500 font-arabic">
                  <h3 className="text-xl font-semibold mb-2">إدارة المهام</h3>
                  <p>محتوى إدارة المهام قيد التطوير</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="finance" className="flex-1 m-0 p-0 h-full">
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500 font-arabic">
                  <h3 className="text-xl font-semibold mb-2">الوضع المالي</h3>
                  <p>محتوى الوضع المالي قيد التطوير</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="attachments" className="flex-1 m-0 p-0 h-full">
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500 font-arabic">
                  <h3 className="text-xl font-semibold mb-2">المرفقات</h3>
                  <p>محتوى المرفقات قيد التطوير</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="client" className="flex-1 m-0 p-0 h-full">
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500 font-arabic">
                  <h3 className="text-xl font-semibold mb-2">العميل</h3>
                  <p>محتوى العميل قيد التطوير</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="team" className="flex-1 m-0 p-0 h-full">
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500 font-arabic">
                  <h3 className="text-xl font-semibold mb-2">الفريق</h3>
                  <p>محتوى الفريق قيد التطوير</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reports" className="flex-1 m-0 p-0 h-full">
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500 font-arabic">
                  <h3 className="text-xl font-semibold mb-2">التقارير</h3>
                  <p>محتوى التقارير قيد التطوير</p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
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
