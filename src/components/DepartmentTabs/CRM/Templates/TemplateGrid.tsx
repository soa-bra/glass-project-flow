
import React from 'react';
import { DataCardFrame } from '@/components/shared/visual-data/DataCardFrame';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { Eye, Download, Copy, Edit, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';
import { downloadAsCSV } from '../../shared/downloadUtils';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  createdBy: string;
  lastModified: string;
  usageCount: number;
  variables: any[];
  tags: string[];
  isActive: boolean;
}

interface TemplateGridProps {
  templates: Template[];
  getCategoryText: (category: string) => string;
  getCategoryColor: (category: string) => string;
}

export const TemplateGrid: React.FC<TemplateGridProps> = ({
  templates,
  getCategoryText,
  getCategoryColor
}) => {
  const handlePreview = (template: Template) => {
    toast.info(`معاينة: ${template.name}`, { description: template.description });
  };

  const handleDownload = (template: Template) => {
    downloadAsCSV(
      ['الرقم', 'الاسم', 'الفئة', 'الوصف', 'مرات الاستخدام', 'المتغيرات'],
      [[template.id, template.name, template.category, template.description, String(template.usageCount), template.variables.map(v => v.name || v).join(', ')]],
      `قالب-${template.id}`
    );
    toast.success(`تم تحميل القالب: ${template.name}`);
  };

  const handleCopy = (template: Template) => {
    navigator.clipboard.writeText(`قالب: ${template.name}\nالوصف: ${template.description}\nالمتغيرات: ${template.variables.map(v => v.name || v).join(', ')}`);
    toast.success('تم نسخ بيانات القالب');
  };

  const handleEdit = (template: Template) => {
    toast.info(`تعديل القالب: ${template.name}`, { description: 'سيتم فتح محرر القوالب قريباً' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <DataCardFrame key={template.id} title={template.name} className="hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(template.category)}`}>
              {getCategoryText(template.category)}
            </span>
          </div>
          <p className="text-sm text-gray-600 font-arabic mb-3">{template.description}</p>

          <div className="flex items-center justify-between text-sm text-gray-500 font-arabic mb-4">
            <div className="flex items-center"><User className="h-3 w-3 ml-1" /><span>{template.createdBy}</span></div>
            <div className="flex items-center"><Calendar className="h-3 w-3 ml-1" /><span>{template.lastModified}</span></div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 font-arabic mb-4">
            <div>استخدم {template.usageCount} مرة</div>
            <div>{template.variables.length} متغير</div>
          </div>

          {template.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {template.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-arabic">{tag}</span>
              ))}
              {template.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-arabic">+{template.tags.length - 3}</span>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <BaseActionButton size="sm" variant="outline" className="flex-1 font-arabic" onClick={() => handlePreview(template)}>
              <Eye className="h-3 w-3 ml-1" />معاينة
            </BaseActionButton>
            <BaseActionButton size="sm" variant="outline" className="font-arabic" onClick={() => handleDownload(template)}>
              <Download className="h-3 w-3 ml-1" />تحميل
            </BaseActionButton>
            <BaseActionButton size="sm" variant="outline" className="font-arabic" onClick={() => handleCopy(template)}>
              <Copy className="h-3 w-3 ml-1" />نسخ
            </BaseActionButton>
            <BaseActionButton size="sm" variant="outline" className="text-red-600 hover:text-red-700 font-arabic" onClick={() => handleEdit(template)}>
              <Edit className="h-3 w-3 ml-1" />تعديل
            </BaseActionButton>
          </div>
        </DataCardFrame>
      ))}
    </div>
  );
};
