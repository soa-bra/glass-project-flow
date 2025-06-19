import React, { useState } from 'react';
import { X, Edit, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project } from '@/types/project';
interface ProjectManagementHeaderProps {
  project: Project;
  onClose: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onEdit: () => void;
}
export const ProjectManagementHeader: React.FC<ProjectManagementHeaderProps> = ({
  project,
  onClose,
  onDelete,
  onArchive,
  onEdit
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-plan':
        return 'bg-soabra-new-on-plan border-soabra-new-on-plan text-gray-800';
      case 'delayed':
        return 'bg-soabra-new-delayed border-soabra-new-delayed text-gray-800';
      case 'in-progress':
        return 'bg-soabra-new-in-progress border-soabra-new-in-progress text-gray-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case 'on-plan':
        return 'وفق الخطة';
      case 'delayed':
        return 'متأخر';
      case 'in-progress':
        return 'قيد التنفيذ';
      default:
        return 'غير محدد';
    }
  };
  return <div className="flex-shrink-0 mb-6">
      {/* الصف الأول */}
      <div className="flex items-center justify-between mb-6 py-0 my-[18px]">
        {/* العنوان على اليسار */}
        <h1 className="font-medium text-[#2A3437] font-arabic text-3xl my-[12px]">
          إدارة المشروع
        </h1>

        {/* الأزرار على اليمين */}
        <div className="flex items-center gap-3">
          {/* قائمة التعديل */}
          <div className="relative">
            <Select onValueChange={value => {
            if (value === 'delete') onDelete();else if (value === 'archive') onArchive();else if (value === 'edit') onEdit();
          }}>
              <SelectTrigger className="w-auto border-none bg-white/60 backdrop-filter backdrop-blur-lg rounded-lg p-2 h-auto">
                <Edit className="w-5 h-5 text-gray-700" />
              </SelectTrigger>
              <SelectContent className="font-arabic bg-white backdrop-filter backdrop-blur-lg border border-white/20">
                <SelectItem value="edit">تعديل المشروع</SelectItem>
                <SelectItem value="archive">أرشفة المشروع</SelectItem>
                <SelectItem value="delete" className="text-red-600">حذف المشروع</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* زر الإغلاق */}
          <button onClick={onClose} className="w-[50px] h-[50px] rounded-full border-2 border-[#3e494c]/50 flex items-center justify-center transition-all duration-300 group bg-transparent">
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* الصف الثاني */}
      <div className="flex items-center gap-4 mb-4">
        {/* اسم المشروع */}
        <h2 className="text-xl font-arabic font-semibold text-gray-800">
          {project.title}
        </h2>

        {/* مدير المشروع */}
        <div className="px-3 py-1.5 bg-white/60 backdrop-filter backdrop-blur-lg border border-white/20 rounded-lg font-arabic text-sm text-gray-700">
          {project.owner}
        </div>

        {/* حالة المشروع */}
        <div className={`px-3 py-1.5 border rounded-lg font-arabic text-sm flex items-center gap-2 ${getStatusColor(project.status || 'in-progress')}`}>
          <div className="w-2 h-2 rounded-full bg-current"></div>
          {getStatusText(project.status || 'in-progress')}
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
            <span className="font-medium">التسليم:</span> 03 أيام
          </div>
        </div>
      </div>

      {/* الصف الثالث - النبذة التعريفية */}
      <div className="text-sm text-gray-600 font-arabic leading-relaxed max-w-2xl">
        {project.description || "تطوير موقع إلكتروني متكامل باستخدام أحدث التقنيات وفقاً للمعايير العالمية مع ضمان الأمان والسرعة في الأداء."}
      </div>
    </div>;
};