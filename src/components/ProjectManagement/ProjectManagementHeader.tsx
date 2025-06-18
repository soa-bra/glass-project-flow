
import React, { useState } from 'react';
import { X, Edit, ChevronDown } from 'lucide-react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project } from '@/types/project';

interface ProjectManagementHeaderProps {
  project: Project;
  onClose: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onEdit: () => void;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const ProjectManagementHeader: React.FC<ProjectManagementHeaderProps> = ({
  project,
  onClose,
  onDelete,
  onArchive,
  onEdit,
  activeTab,
  onTabChange
}) => {
  const [showEditMenu, setShowEditMenu] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-plan': return 'bg-green-100 border-green-300 text-green-800';
      case 'delayed': return 'bg-red-100 border-red-300 text-red-800';
      case 'in-progress': return 'bg-blue-100 border-blue-300 text-blue-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on-plan': return 'وفق الخطة';
      case 'delayed': return 'متأخر';
      case 'in-progress': return 'قيد التنفيذ';
      default: return 'غير محدد';
    }
  };

  return (
    <div className="flex-shrink-0 mb-6">
      {/* الصف الأول */}
      <div className="flex items-center justify-between mb-4">
        {/* العنوان على اليسار */}
        <h1 className="text-[32px] font-arabic font-bold text-gray-900">
          لوحة إدارة المشروع
        </h1>

        {/* الأزرار والتبويبات على اليمين */}
        <div className="flex items-center gap-4">
          {/* التبويبات */}
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

          {/* قائمة التعديل */}
          <div className="relative">
            <Select onValueChange={(value) => {
              if (value === 'delete') onDelete();
              else if (value === 'archive') onArchive();
              else if (value === 'edit') onEdit();
            }}>
              <SelectTrigger className="w-auto border-none bg-white/30 rounded-full p-2">
                <Edit className="w-5 h-5" />
              </SelectTrigger>
              <SelectContent className="font-arabic">
                <SelectItem value="edit">تعديل المشروع</SelectItem>
                <SelectItem value="archive">أرشفة المشروع</SelectItem>
                <SelectItem value="delete" className="text-red-600">حذف المشروع</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* زر الإغلاق */}
          <button
            onClick={onClose}
            className="rounded-full bg-white/70 hover:bg-white/100 shadow-lg border border-white/30 w-10 h-10 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* الصف الثاني */}
      <div className="flex items-center gap-4 mb-3">
        {/* اسم المشروع */}
        <h2 className="text-2xl font-arabic font-bold text-gray-900">
          {project.title}
        </h2>

        {/* مدير المشروع */}
        <div className="px-4 py-2 bg-white/40 border border-black rounded-full font-arabic text-sm">
          {project.owner}
        </div>

        {/* حالة المشروع */}
        <div className={`px-4 py-2 border rounded-full font-arabic text-sm flex items-center gap-2 ${getStatusColor(project.status || 'in-progress')}`}>
          <div className="w-2 h-2 rounded-full bg-current"></div>
          {getStatusText(project.status || 'in-progress')}
        </div>

        {/* بيانات التعريف السريعة */}
        <div className="flex items-center gap-3 mr-4">
          <div className="text-sm font-arabic text-gray-600">
            <span className="font-semibold">الميزانية:</span> {project.value} ر.س
          </div>
          <div className="text-sm font-arabic text-gray-600">
            <span className="font-semibold">الفريق:</span> 08 أشخاص
          </div>
          <div className="text-sm font-arabic text-gray-600">
            <span className="font-semibold">التسليم:</span> 03 أيام
          </div>
        </div>
      </div>

      {/* الصف الثالث - النبذة التعريفية */}
      <div className="text-xs text-gray-600 font-arabic leading-relaxed max-w-2xl">
        {project.description || "تطوير موقع إلكتروني متكامل باستخدام أحدث التقنيات وفقاً للمعايير العالمية مع ضمان الأمان والسرعة في الأداء."}
      </div>
    </div>
  );
};
