import React, { useState } from 'react';
import { FileText, Download, Plus, Search, Eye } from 'lucide-react';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { GenericDetailModal, DetailField } from '../shared/GenericDetailModal';
import { downloadAsCSV } from '../shared/downloadUtils';
import { toast } from 'sonner';
import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';

const initialTemplates = [
  { id: 'TPL-001', name: 'عقد خدمات استشارية', category: 'contract', type: 'خدمات', description: 'نموذج عقد للخدمات الاستشارية والتطوير', lastModified: '2024-06-15', createdBy: 'فريق الشؤون القانونية', usage: 25, status: 'active' },
  { id: 'TPL-002', name: 'اتفاقية سرية', category: 'agreement', type: 'سرية', description: 'اتفاقية عدم إفشاء المعلومات السرية', lastModified: '2024-06-10', createdBy: 'المستشار القانوني', usage: 42, status: 'active' },
];

export const TemplatesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [templates, setTemplates] = useState(initialTemplates);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewingTemplate, setViewingTemplate] = useState<any>(null);

  const filteredTemplates = templates.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const addFields: FormField[] = [
    { name: 'name', label: 'اسم النموذج', type: 'text', required: true, placeholder: 'أدخل اسم النموذج' },
    { name: 'category', label: 'الفئة', type: 'select', required: true, options: [
      { value: 'contract', label: 'عقد' }, { value: 'agreement', label: 'اتفاقية' }, { value: 'policy', label: 'سياسة' }, { value: 'form', label: 'نموذج' }, { value: 'letter', label: 'خطاب' },
    ]},
    { name: 'type', label: 'النوع', type: 'text', required: true, placeholder: 'نوع النموذج' },
    { name: 'description', label: 'الوصف', type: 'textarea', required: true, placeholder: 'وصف النموذج...' },
  ];

  const handleAdd = (data: Record<string, string>) => {
    const newTemplate = {
      id: `TPL-${Date.now().toString().slice(-4)}`,
      name: data.name,
      category: data.category,
      type: data.type,
      description: data.description,
      lastModified: new Date().toISOString().split('T')[0],
      createdBy: 'المستخدم الحالي',
      usage: 0,
      status: 'active',
    };
    setTemplates(prev => [newTemplate, ...prev]);
  };

  const handleDownload = (template: any) => {
    downloadAsCSV(
      ['الرقم', 'الاسم', 'الفئة', 'النوع', 'الوصف', 'مرات الاستخدام'],
      [[template.id, template.name, template.category, template.type, template.description, String(template.usage)]],
      `نموذج-${template.id}`
    );
    toast.success(`تم تنزيل النموذج: ${template.name}`);
  };

  const getViewFields = (template: any): DetailField[] => [
    { label: 'الرقم', value: template.id },
    { label: 'الاسم', value: template.name },
    { label: 'الفئة', value: template.category },
    { label: 'النوع', value: template.type },
    { label: 'الوصف', value: template.description },
    { label: 'آخر تعديل', value: template.lastModified },
    { label: 'أنشأه', value: template.createdBy },
    { label: 'مرات الاستخدام', value: String(template.usage) },
  ];

  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-black font-arabic">النماذج والقوالب</h3>
        <button onClick={() => setIsAddOpen(true)} className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-black/90 transition-colors">
          <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center"><Plus className="w-4 h-4" /></div>
          نموذج جديد
        </button>
      </div>

      {/* أدوات البحث */}
      <AppCardSurface density="spacious" interactive="hoverable">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center absolute right-3 top-1/2 transform -translate-y-1/2"><Search className="w-4 h-4 text-black" /></div>
            <input type="text" placeholder="البحث في النماذج..." className="w-full pl-4 pr-12 py-3 bg-transparent border border-black/10 rounded-full focus:ring-2 focus:ring-black/20 text-black font-arabic" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
      </AppCardSurface>

      {/* شبكة النماذج */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => <div key={template.id} className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-9 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center"><FileText className="w-4 h-4 text-black" /></div>
                <span className="px-3 py-1 text-xs rounded-full bg-[#a4e2f6] text-black font-arabic">{template.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <div onClick={() => setViewingTemplate(template)} className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"><Eye className="w-4 h-4 text-black" /></div>
                <div onClick={() => handleDownload(template)} className="w-8 h-8 rounded-full bg-transparent border border-black flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"><Download className="w-4 h-4 text-black" /></div>
              </div>
            </div>
            <h4 className="text-xl font-semibold text-black font-arabic mb-2">{template.name}</h4>
            <p className="text-sm font-normal text-black font-arabic mb-4">{template.description}</p>
            <div className="space-y-2 text-sm font-normal text-black font-arabic">
              <div className="flex justify-between"><span>مرات الاستخدام:</span><span className="text-sm font-bold text-black font-arabic">{template.usage}</span></div>
            </div>
          </div>)}
      </div>

      <GenericFormModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="إضافة نموذج جديد" fields={addFields} onSubmit={handleAdd} submitLabel="إضافة" successMessage="تمت إضافة النموذج بنجاح" />
      {viewingTemplate && <GenericDetailModal isOpen={!!viewingTemplate} onClose={() => setViewingTemplate(null)} title={`تفاصيل: ${viewingTemplate.name}`} fields={getViewFields(viewingTemplate)} />}
    </div>;
};
