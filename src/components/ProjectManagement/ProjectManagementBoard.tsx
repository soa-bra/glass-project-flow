
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

  // بيانات وهمية للإحصائيات
  const mockStats = {
    expectedRevenue: 250,
    complaints: 12,
    delayedProjects: 3
  };

  return (
    <div 
      className={`fixed z-[1200] ${isSidebarCollapsed ? 'project-details-collapsed' : 'project-details-expanded'}`}
      style={{
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

      {/* الإحصائيات - منقولة لتكون مع معلومات المشروع */}
      <div className="flex justify-between items-start mb-6 flex-shrink-0">
        {/* معلومات المشروع الأساسية */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            {/* اسم المشروع */}
            <h2 className="text-xl font-arabic font-semibold text-gray-800">
              {project.title}
            </h2>

            {/* مدير المشروع */}
            <div className="px-3 py-1.5 bg-transparent border-2 border-black rounded-full font-arabic text-sm text-gray-700">
              {project.owner}
            </div>

            {/* حالة المشروع */}
            <div className="px-3 py-1.5 bg-transparent border-2 border-black rounded-full font-arabic text-sm flex items-center gap-2 text-gray-700">
              <div className="w-2 h-2 rounded-full bg-current"></div>
              قيد التنفيذ
            </div>

            {/* بيانات التعريف السريعة */}
            <div className="flex items-center gap-4 mr-4">
              <div className="text-sm font-arabic text-gray-600">
                <span className="font-medium">الميزانية:</span> {project.value} ر.س
              </div>
              <div className="text-sm font-arabic text-gray-600">
                <span className="font-medium">الفريق:</span> 08 أشخاص
              </div>
              <div className="text-sm font-arabic text-gray-600">
                <span className="font-medium">التسليم:</span> 03 يوم
              </div>
            </div>
          </div>

          {/* النبذة التعريفية */}
          <div className="text-sm text-gray-600 font-arabic leading-relaxed max-w-2xl">
            {project.description || "تطوير موقع إلكتروني متكامل باستخدام أحدث التقنيات وفقاً للمعايير العالمية مع ضمان الأمان والسرعة في الأداء."}
          </div>
        </div>

        {/* الإحصائيات - منقولة من تحت شريط التقدم */}
        <div className="flex-shrink-0">
          <div className="grid grid-cols-3 gap-6 px-[4px]">
            {/* الإيرادات المتوقعة */}
            <div className="text-right p-6 py-0">
              <div className="mb-2">
                <span className="text-sm text-black font-arabic font-medium">الإيرادات المتوقعة</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1 px-0 mx-0">
                <div className="text-3xl font-normal text-gray-900 font-arabic">
                  {mockStats.expectedRevenue || 0}
                </div>
                <div className="text-xs text-black font-arabic font-bold">الف</div>
              </div>
              <div className="text-xs font-Regular text-black font-arabic">ريال سعودي عن الربع الأول</div>
            </div>

            {/* الشكاوى */}
            <div className="text-right p-6 mx-0 px-[24px] py-0">
              <div className="mb-2">
                <span className="text-sm text-black font-arabic font-medium">الشكاوى</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1 px-0 mx-0">
                <div className="text-3xl font-normal text-gray-900 font-arabic">
                  {String(mockStats.complaints || 0).padStart(2, '0')}
                </div>
                <div className="text-xs text-black font-arabic font-bold">شكاوى</div>
              </div>
              <div className="text-xs font-Regular text-black font-arabic">الشكاوى والملاحظات التي المكررة</div>
            </div>

            {/* المشاريع المتأخرة */}
            <div className="text-right p-6 py-0">
              <div className="mb-2">
                <span className="text-sm text-black font-arabic font-medium">المشاريع المتأخرة</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1 px-0 mx-0">
                <div className="text-3xl font-normal text-gray-900 font-arabic">
                  {String(mockStats.delayedProjects || 0).padStart(2, '0')}
                </div>
                <div className="text-xs text-black font-arabic font-bold">مشاريع</div>
              </div>
              <div className="text-xs font-Regular text-black font-arabic">تحتاج إلى تدخل ومعالجة</div>
            </div>
          </div>
        </div>
      </div>

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
