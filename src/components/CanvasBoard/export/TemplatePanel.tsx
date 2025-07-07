import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Save, Download, Upload, Star, Search } from 'lucide-react';
import { toast } from 'sonner';
interface CanvasTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  elements: any[];
  tags: string[];
  createdAt: Date;
  isStarred: boolean;
}
interface TemplatePanelProps {
  currentElements: any[];
  onLoadTemplate: (template: CanvasTemplate) => void;
  onSaveAsTemplate: (name: string, description: string) => void;
}
export const TemplatePanel: React.FC<TemplatePanelProps> = ({
  currentElements,
  onLoadTemplate,
  onSaveAsTemplate
}) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'save'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  // قوالب وهمية للعرض
  const mockTemplates: CanvasTemplate[] = [{
    id: '1',
    name: 'خريطة ذهنية أساسية',
    description: 'قالب لإنشاء خرائط ذهنية بسيطة ومنظمة',
    thumbnail: '/placeholder.svg',
    elements: [],
    tags: ['خريطة ذهنية', 'تنظيم', 'أساسي'],
    createdAt: new Date('2024-01-15'),
    isStarred: true
  }, {
    id: '2',
    name: 'لوحة العصف الذهني',
    description: 'قالب مثالي لجلسات العصف الذهني والأفكار الإبداعية',
    thumbnail: '/placeholder.svg',
    elements: [],
    tags: ['عصف ذهني', 'إبداع', 'فريق'],
    createdAt: new Date('2024-01-10'),
    isStarred: false
  }, {
    id: '3',
    name: 'مخطط تدفق العمليات',
    description: 'لتصميم مخططات تدفق العمليات والإجراءات',
    thumbnail: '/placeholder.svg',
    elements: [],
    tags: ['تدفق', 'عمليات', 'مخطط'],
    createdAt: new Date('2024-01-05'),
    isStarred: true
  }];
  const [templates] = useState(mockTemplates);
  const [starredTemplates, setStarredTemplates] = useState(mockTemplates.filter(t => t.isStarred).map(t => t.id));
  const filteredTemplates = templates.filter(template => template.name.toLowerCase().includes(searchQuery.toLowerCase()) || template.description.toLowerCase().includes(searchQuery.toLowerCase()) || template.tags.some(tag => tag.includes(searchQuery)));
  const handleLoadTemplate = (template: CanvasTemplate) => {
    onLoadTemplate(template);
    toast.success(`تم تحميل القالب: ${template.name}`);
  };
  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      toast.error('يرجى إدخال اسم القالب');
      return;
    }
    if (currentElements.length === 0) {
      toast.error('لا توجد عناصر لحفظها في القالب');
      return;
    }
    onSaveAsTemplate(templateName, templateDescription);
    setTemplateName('');
    setTemplateDescription('');
    toast.success(`تم حفظ القالب: ${templateName}`);
  };
  const toggleStar = (templateId: string) => {
    setStarredTemplates(prev => prev.includes(templateId) ? prev.filter(id => id !== templateId) : [...prev, templateId]);
  };
  const renderBrowseTab = () => <div className="space-y-4">
      {/* شريط البحث */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="البحث في القوالب..." className="pl-10 font-arabic" />
      </div>

      {/* قوالب مميزة */}
      {starredTemplates.length > 0 && <div>
          <h4 className="text-sm font-medium font-arabic mb-2 flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            قوالب مميزة
          </h4>
          <div className="space-y-2">
            {templates.filter(t => starredTemplates.includes(t.id)).map(template => <div key={template.id} className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium font-arabic">{template.name}</h5>
                  <button onClick={() => toggleStar(template.id)} className="text-yellow-500 hover:text-yellow-600">
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 font-arabic mb-2">
                  {template.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    {template.tags.slice(0, 2).map(tag => <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {tag}
                      </span>)}
                  </div>
                  <Button onClick={() => handleLoadTemplate(template)} size="sm" className="rounded-full">
                    تحميل
                  </Button>
                </div>
              </div>)}
          </div>
        </div>}

      {/* جميع القوالب */}
      <div>
        <h4 className="text-sm font-medium font-arabic mb-2">
          جميع القوالب ({filteredTemplates.length})
        </h4>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {filteredTemplates.map(template => <div key={template.id} className="border rounded-lg p-3 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-medium font-arabic">{template.name}</h5>
                <button onClick={() => toggleStar(template.id)} className={`hover:text-yellow-600 ${starredTemplates.includes(template.id) ? 'text-yellow-500' : 'text-gray-400'}`}>
                  <Star className={`w-4 h-4 ${starredTemplates.includes(template.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
              <p className="text-sm text-gray-600 font-arabic mb-2">
                {template.description}
              </p>
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  {template.tags.slice(0, 2).map(tag => <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {tag}
                    </span>)}
                </div>
                <Button onClick={() => handleLoadTemplate(template)} size="sm" variant="outline" className="text-xs">
                  تحميل
                </Button>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
  const renderSaveTab = () => <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="text-sm font-arabic">
          العناصر الحالية: <strong>{currentElements.length}</strong>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium font-arabic mb-2 block">اسم القالب</label>
        <Input value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="مثال: قالب العصف الذهني المتقدم" className="font-arabic" />
      </div>

      <div>
        <label className="text-sm font-medium font-arabic mb-2 block">وصف القالب</label>
        <Textarea value={templateDescription} onChange={e => setTemplateDescription(e.target.value)} placeholder="وصف مختصر عن القالب واستخداماته..." className="font-arabic resize-none" rows={3} />
      </div>

      <Button onClick={handleSaveTemplate} disabled={!templateName.trim() || currentElements.length === 0} className="w-full rounded-full">
        <Save className="w-4 h-4 mr-2" />
        حفظ كقالب
      </Button>

      <div className="text-xs text-gray-500 font-arabic">
        💡 سيتم حفظ جميع العناصر الموجودة حالياً على اللوحة
      </div>
    </div>;
  return;
};