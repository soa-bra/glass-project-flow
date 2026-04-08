
import React, { useState } from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Plus, Search, Download, Edit, Copy, Upload, Eye, Calendar, User } from 'lucide-react';
import { mockCSRTemplates } from './data';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { GenericDetailModal, DetailField } from '../shared/GenericDetailModal';
import { downloadAsCSV } from '../shared/downloadUtils';
import { toast } from 'sonner';

export const TemplatesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [templates, setTemplates] = useState(mockCSRTemplates);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewingTemplate, setViewingTemplate] = useState<any>(null);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [uploadName, setUploadName] = useState('');
  const [uploadCategory, setUploadCategory] = useState('proposal');
  const [uploadDesc, setUploadDesc] = useState('');

  const getCategoryText = (c: string) => ({ proposal: 'مقترح', agreement: 'اتفاقية', report: 'تقرير', evaluation: 'تقييم', contract: 'عقد' }[c] || c);
  const getCategoryColor = (c: string) => ({ proposal: 'bg-blue-100 text-blue-800', agreement: 'bg-green-100 text-green-800', report: 'bg-orange-100 text-orange-800', evaluation: 'bg-purple-100 text-purple-800', contract: 'bg-red-100 text-red-800' }[c] || 'bg-gray-100 text-gray-800');

  const filteredTemplates = templates.filter(t => {
    const ms = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.description.toLowerCase().includes(searchTerm.toLowerCase());
    return ms && (selectedCategory === 'all' || t.category === selectedCategory) && t.isActive;
  });

  const templateStats = {
    total: templates.length,
    mostUsed: templates.reduce((prev, cur) => prev.usageCount > cur.usageCount ? prev : cur),
    categories: [...new Set(templates.map(t => t.category))].length,
  };

  const addFields: FormField[] = [
    { name: 'name', label: 'اسم القالب', type: 'text', required: true, placeholder: 'اسم وصفي' },
    { name: 'category', label: 'الفئة', type: 'select', required: true, options: [
      { value: 'proposal', label: 'مقترح' }, { value: 'agreement', label: 'اتفاقية' }, { value: 'report', label: 'تقرير' }, { value: 'evaluation', label: 'تقييم' }, { value: 'contract', label: 'عقد' },
    ]},
    { name: 'description', label: 'الوصف', type: 'textarea', required: true, placeholder: 'وصف القالب...' },
  ];

  const handleAddTemplate = (data: Record<string, string>) => {
    const newT = { id: `t-${Date.now()}`, name: data.name, category: data.category as CSRTemplate['category'], description: data.description, fileUrl: '', createdBy: 'المستخدم الحالي', createdDate: new Date().toISOString().split('T')[0], lastModified: new Date().toISOString(), usageCount: 0, isActive: true, variables: [] as string[], tags: [] as string[] };
    setTemplates(prev => [newT, ...prev]);
  };

  const handleEditTemplate = (data: Record<string, string>) => {
    if (!editingTemplate) return;
    setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? { ...t, name: data.name, category: data.category as CSRTemplate['category'], description: data.description, lastModified: new Date().toISOString() } : t));
    setEditingTemplate(null);
  };

  const handleUploadSubmit = () => {
    if (!uploadName) { toast.error('يرجى إدخال اسم القالب'); return; }
    const newT: any = { id: `u-${Date.now()}`, name: uploadName, category: uploadCategory, description: uploadDesc || 'قالب مرفوع', createdBy: 'المستخدم الحالي', lastModified: new Date().toISOString(), usageCount: 0, isActive: true, variables: [], tags: ['مرفوع'] };
    setTemplates(prev => [newT, ...prev]);
    setShowUploadForm(false); setUploadName(''); setUploadDesc('');
    toast.success('تم رفع القالب بنجاح');
  };

  const handleDownload = (t: any) => {
    downloadAsCSV(['الاسم', 'الفئة', 'الوصف', 'المنشئ', 'الاستخدام'], [[t.name, t.category, t.description, t.createdBy, String(t.usageCount)]], `قالب-${t.id}`);
    toast.success(`تم تحميل: ${t.name}`);
  };

  const handleCopy = (t: any) => {
    const copy: any = { ...t, id: `c-${Date.now()}`, name: `نسخة من ${t.name}`, usageCount: 0, lastModified: new Date().toISOString() };
    setTemplates(prev => [copy, ...prev]);
    toast.success('تم نسخ القالب');
  };

  const getViewFields = (t: any): DetailField[] => [
    { label: 'الاسم', value: t.name }, { label: 'الفئة', value: getCategoryText(t.category) },
    { label: 'الوصف', value: t.description }, { label: 'المنشئ', value: t.createdBy },
    { label: 'آخر تعديل', value: new Date(t.lastModified).toLocaleDateString('ar-SA') },
    { label: 'مرات الاستخدام', value: String(t.usageCount) },
    { label: 'المتغيرات', value: t.variables?.length ? t.variables.join(', ') : 'لا يوجد' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96"><Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" /><Input placeholder="البحث في النماذج..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pr-10" /></div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white">
            <option value="all">جميع الفئات</option><option value="proposal">مقترح</option><option value="agreement">اتفاقية</option><option value="report">تقرير</option><option value="evaluation">تقييم</option><option value="contract">عقد</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowUploadForm(!showUploadForm)} className="font-arabic"><Upload className="ml-2 h-4 w-4" /> رفع قالب</Button>
          <Button onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-arabic"><Plus className="ml-2 h-4 w-4" /> إنشاء قالب جديد</Button>
        </div>
      </div>

      {showUploadForm && (
        <GenericCard>
          <h3 className="text-lg font-bold font-arabic mb-4">رفع قالب جديد</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-sm font-semibold font-arabic mb-2">اسم القالب</label><Input placeholder="اسم وصفي" value={uploadName} onChange={e => setUploadName(e.target.value)} /></div>
            <div><label className="block text-sm font-semibold font-arabic mb-2">الفئة</label><select value={uploadCategory} onChange={e => setUploadCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white"><option value="proposal">مقترح</option><option value="agreement">اتفاقية</option><option value="report">تقرير</option><option value="evaluation">تقييم</option><option value="contract">عقد</option></select></div>
          </div>
          <div className="mb-4"><label className="block text-sm font-semibold font-arabic mb-2">الوصف</label><Input placeholder="وصف مختصر" value={uploadDesc} onChange={e => setUploadDesc(e.target.value)} /></div>
          <div className="mb-4"><div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"><Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" /><p className="text-gray-600 font-arabic">اسحب الملف هنا أو انقر للتحديد</p><p className="text-sm text-gray-500 font-arabic">يدعم: PDF, DOCX, XLSX</p></div></div>
          <div className="flex gap-2">
            <Button onClick={handleUploadSubmit} className="bg-green-600 hover:bg-green-700 text-white font-arabic">رفع القالب</Button>
            <Button variant="outline" onClick={() => setShowUploadForm(false)} className="font-arabic">إلغاء</Button>
          </div>
        </GenericCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GenericCard className="text-center"><FileText className="h-8 w-8 text-blue-600 mx-auto mb-4" /><h3 className="text-2xl font-bold font-arabic text-gray-900">{templateStats.total}</h3><p className="text-gray-600 font-arabic">إجمالي القوالب</p><div className="mt-2 text-sm text-blue-600 font-arabic">{filteredTemplates.length} نشط</div></GenericCard>
        <GenericCard className="text-center"><Download className="h-8 w-8 text-green-600 mx-auto mb-4" /><h3 className="text-2xl font-bold font-arabic text-gray-900">{templateStats.mostUsed.usageCount}</h3><p className="text-gray-600 font-arabic">أكثر استخداماً</p><div className="mt-2 text-sm text-green-600 font-arabic">{templateStats.mostUsed.name}</div></GenericCard>
        <GenericCard className="text-center"><Copy className="h-8 w-8 text-purple-600 mx-auto mb-4" /><h3 className="text-2xl font-bold font-arabic text-gray-900">{templateStats.categories}</h3><p className="text-gray-600 font-arabic">الفئات المتاحة</p></GenericCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <GenericCard key={template.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-2"><h4 className="font-semibold font-arabic text-gray-900">{template.name}</h4><span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(template.category)}`}>{getCategoryText(template.category)}</span></div>
            <p className="text-sm text-gray-600 font-arabic mb-3">{template.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-500 font-arabic mb-4"><div className="flex items-center"><User className="h-3 w-3 ml-1" /><span>{template.createdBy}</span></div><div className="flex items-center"><Calendar className="h-3 w-3 ml-1" /><span>{new Date(template.lastModified).toLocaleDateString('ar-SA')}</span></div></div>
            <div className="flex items-center justify-between text-sm text-gray-500 font-arabic mb-4"><div>استخدم {template.usageCount} مرة</div><div>{template.variables.length} متغير</div></div>
            {template.tags.length > 0 && <div className="flex flex-wrap gap-1 mb-4">{template.tags.slice(0, 3).map((tag, i) => <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-arabic">{tag}</span>)}</div>}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 font-arabic" onClick={() => setViewingTemplate(template)}><Eye className="h-3 w-3 ml-1" /> معاينة</Button>
              <Button size="sm" variant="outline" className="font-arabic" onClick={() => handleDownload(template)}><Download className="h-3 w-3 ml-1" /> تحميل</Button>
              <Button size="sm" variant="outline" className="font-arabic" onClick={() => handleCopy(template)}><Copy className="h-3 w-3 ml-1" /> نسخ</Button>
              <Button size="sm" variant="outline" className="text-blue-600 hover:text-blue-700 font-arabic" onClick={() => setEditingTemplate(template)}><Edit className="h-3 w-3 ml-1" /> تعديل</Button>
            </div>
          </GenericCard>
        ))}
      </div>

      <GenericCard>
        <h3 className="text-lg font-bold font-arabic mb-4">دليل المتغيرات المتاحة للمبادرات الاجتماعية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div><h4 className="font-semibold font-arabic text-gray-900 mb-2">معلومات المبادرة</h4><div className="space-y-1 text-sm font-arabic"><div className="flex justify-between"><span className="text-gray-600">اسم المبادرة:</span><code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{initiative_name}}"}</code></div><div className="flex justify-between"><span className="text-gray-600">الفئة:</span><code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{category}}"}</code></div><div className="flex justify-between"><span className="text-gray-600">الميزانية:</span><code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{budget}}"}</code></div></div></div>
          <div><h4 className="font-semibold font-arabic text-gray-900 mb-2">معلومات الشراكة</h4><div className="space-y-1 text-sm font-arabic"><div className="flex justify-between"><span className="text-gray-600">اسم الشريك:</span><code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{partner_name}}"}</code></div><div className="flex justify-between"><span className="text-gray-600">نوع الشراكة:</span><code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{partnership_type}}"}</code></div><div className="flex justify-between"><span className="text-gray-600">المدة:</span><code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{duration}}"}</code></div></div></div>
          <div><h4 className="font-semibold font-arabic text-gray-900 mb-2">مؤشرات الأداء</h4><div className="space-y-1 text-sm font-arabic"><div className="flex justify-between"><span className="text-gray-600">المستفيدين:</span><code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{beneficiaries}}"}</code></div><div className="flex justify-between"><span className="text-gray-600">مؤشر الأثر:</span><code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{impact_index}}"}</code></div><div className="flex justify-between"><span className="text-gray-600">SROI:</span><code className="bg-gray-100 px-2 py-1 rounded text-xs">{"{{sroi_value}}"}</code></div></div></div>
        </div>
      </GenericCard>

      <GenericFormModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="إنشاء قالب جديد" fields={addFields} onSubmit={handleAddTemplate} submitLabel="إنشاء" successMessage="تم إنشاء القالب بنجاح" />
      {editingTemplate && <GenericFormModal isOpen={!!editingTemplate} onClose={() => setEditingTemplate(null)} title={`تعديل: ${editingTemplate.name}`} fields={addFields.map(f => ({ ...f, defaultValue: String((editingTemplate as any)[f.name] || '') }))} onSubmit={handleEditTemplate} submitLabel="حفظ" successMessage="تم تحديث القالب بنجاح" />}
      {viewingTemplate && <GenericDetailModal isOpen={!!viewingTemplate} onClose={() => setViewingTemplate(null)} title={viewingTemplate.name} fields={getViewFields(viewingTemplate)} />}
    </div>
  );
};
