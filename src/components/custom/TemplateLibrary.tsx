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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((template) => (
        <div key={template.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-black/10 hover:shadow-lg transition-all duration-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h4 className="font-semibold text-sm text-black">{template.name}</h4>
                <Badge variant="secondary" className="text-xs mt-1 w-fit">{template.category}</Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-black/60">{template.downloads} تحميل</span>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Eye className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};