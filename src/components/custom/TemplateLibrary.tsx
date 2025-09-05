import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Input } from '@/components/ui/input';
import { FileText, Download, Eye, Plus, Search } from 'lucide-react';
import { FileUploadModal } from './FileUploadModal';
interface Template {
  id: string;
  name: string;
  category: string;
  downloads: number;
}
interface TemplateLibraryProps {
  templates: Template[];
  onTemplateAdded?: (template: Template) => void;
}
export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  templates = [],
  onTemplateAdded
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedTemplates, setUploadedTemplates] = useState<Template[]>([]);
  const defaultTemplates = [{
    id: '1',
    name: 'قالب تقرير المشروع',
    category: 'تقارير',
    downloads: 45
  }, {
    id: '2',
    name: 'نموذج اتفاقية العمل',
    category: 'قانوني',
    downloads: 32
  }, {
    id: '3',
    name: 'قالب خطة المشروع',
    category: 'تخطيط',
    downloads: 67
  }];
  const allTemplates = [...(templates.length > 0 ? templates : defaultTemplates), ...uploadedTemplates];
  const filteredItems = allTemplates.filter(template => template.name.toLowerCase().includes(searchTerm.toLowerCase()) || template.category.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleTemplateUploaded = (files: any[]) => {
    const newTemplates = files.map((file, index) => ({
      id: `uploaded-${Date.now()}-${index}`,
      name: file.name || 'ملف مرفوع',
      category: 'مرفوع',
      downloads: 0
    }));
    setUploadedTemplates(prev => [...prev, ...newTemplates]);
    if (onTemplateAdded) {
      newTemplates.forEach(template => onTemplateAdded(template));
    }
  };
  return <div className="bg-[#FFFFFF] rounded-[41px] p-6 border border-[#DADCE0]">
      {/* شريط البحث وأيقونة الرفع */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            type="text" 
            placeholder="البحث عن القوالب..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            className="h-8 bg-[#FFFFFF] border border-black/80 rounded-full pr-10" 
          />
        </div>
        <button onClick={() => setShowUploadModal(true)} className="w-8 h-8 rounded-full flex items-center justify-center text-black transition-all duration-300 border border-black/80 bg-transparent hover:bg-black/5 hover:scale-105 active:scale-95">
          <Plus size={16} />
        </button>
      </div>

      {/* القوالب */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {filteredItems.map(template => <div key={template.id} className="bg-[#ffFFFF] rounded-3xl p-4 border border-black/10">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <BaseBadge variant="secondary" className="text-xs">
                    {template.category}
                  </BaseBadge>
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
                  <Button size="sm" variant="ghost" className="p-1 h-6 w-6">
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="p-1 h-6 w-6">
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>)}
      </div>

      {/* نافذة رفع القوالب */}
      <FileUploadModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} projectTasks={[]} projectId="templates" onFilesUploaded={handleTemplateUploaded} />
    </div>;
};