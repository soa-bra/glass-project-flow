
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { Button } from '@/components/ui/button';
import { Eye, Download, Copy, Edit, Calendar, User } from 'lucide-react';

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <GenericCard key={template.id} className="hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold font-arabic text-gray-900">{template.name}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(template.category)}`}>
                  {getCategoryText(template.category)}
                </span>
              </div>
              <p className="text-sm text-gray-600 font-arabic mb-3">{template.description}</p>
            </div>
          </div>

          {/* Template Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500 font-arabic mb-4">
            <div className="flex items-center">
              <User className="h-3 w-3 ml-1" />
              <span>{template.createdBy}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 ml-1" />
              <span>{template.lastModified}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 font-arabic mb-4">
            <div>استخدم {template.usageCount} مرة</div>
            <div>{template.variables.length} متغير</div>
          </div>

          {/* Tags */}
          {template.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {template.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-arabic">
                  {tag}
                </span>
              ))}
              {template.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-arabic">
                  +{template.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 font-arabic">
              <Eye className="h-3 w-3 ml-1" />
              معاينة
            </Button>
            <Button size="sm" variant="outline" className="font-arabic">
              <Download className="h-3 w-3 ml-1" />
              تحميل
            </Button>
            <Button size="sm" variant="outline" className="font-arabic">
              <Copy className="h-3 w-3 ml-1" />
              نسخ
            </Button>
            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 font-arabic">
              <Edit className="h-3 w-3 ml-1" />
              تعديل
            </Button>
          </div>
        </GenericCard>
      ))}
    </div>
  );
};
