import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: string;
  downloads: number;
}

interface TemplateLibraryProps {
  templates: Template[];
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ templates = [] }) => {
  const defaultTemplates = [
    { id: '1', name: 'قالب تقرير المشروع', category: 'تقارير', downloads: 45 },
    { id: '2', name: 'نموذج اتفاقية العمل', category: 'قانوني', downloads: 32 },
    { id: '3', name: 'قالب خطة المشروع', category: 'تخطيط', downloads: 67 }
  ];

  const items = templates.length > 0 ? templates : defaultTemplates;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
      {items.map((template) => (
        <div key={template.id} className="bg-[#F2FFFF] rounded-3xl p-4 border border-black/10">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <Badge variant="secondary" className="text-xs">
                  {template.category}
                </Badge>
                <h4 className="font-medium text-sm text-right mr-2 line-clamp-2">
                  {template.name}
                </h4>
              </div>
              
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>التحميلات: {template.downloads}</span>
                  <span>قالب احترافي</span>
                </div>
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex gap-1 mt-3">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="p-1 h-6 w-6"
                >
                  <Eye className="w-3 h-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="p-1 h-6 w-6"
                >
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};