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
    <div className="space-y-3">
      {items.map((template) => (
        <div key={template.id} className="bg-white/20 rounded-xl p-3 flex items-center justify-between">
          <div className="flex gap-2">
            <Button size="sm" variant="ghost">
              <Eye className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost">
              <Download className="w-3 h-3" />
            </Button>
          </div>
          <div className="text-right flex-1 mr-2">
            <h4 className="font-medium text-sm flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {template.name}
            </h4>
            <div className="flex gap-2 mt-1">
              <Badge variant="secondary">{template.category}</Badge>
              <span className="text-xs text-gray-600">{template.downloads} تحميل</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};