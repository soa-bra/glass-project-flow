import React, { useState } from 'react';
import { FileText, Download, Eye, Edit, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { MetricHeroCard } from '@/components/shared/visual-data/MetricHeroCard';
import { CapsuleBarChart } from '@/components/shared/visual-data/CapsuleBarChart';
import { mockHRTemplates } from './data';
import { toast } from 'sonner';

export const TemplatesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [previewTemplate, setPreviewTemplate] = useState<typeof mockHRTemplates[0] | null>(null);
  const [editTemplate, setEditTemplate] = useState<typeof mockHRTemplates[0] | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const categories = ['الكل', 'contract', 'evaluation', 'policy', 'form', 'letter'];
  const categoryLabels: Record<string, string> = { contract: 'عقود', evaluation: 'تقييمات', policy: 'سياسات', form: 'نماذج', letter: 'رسائل' };

  const filteredTemplates = mockHRTemplates.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === 'الكل' || t.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const mostUsed = mockHRTemplates.reduce((prev, cur) => (prev.usageCount > cur.usageCount ? prev : cur));
  const recentlyUpdated = mockHRTemplates.filter(t => {
    const d = new Date(t.lastModified);
    const ago = new Date();
    ago.setDate(ago.getDate() - 30);
    return d > ago;
  }).length;

  const usageData = mockHRTemplates
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 5)
    .map(t => ({ label: t.name, value: t.usageCount }));

  const handleDownload = (template: typeof mockHRTemplates[0]) => {
    const blob = new Blob([JSON.stringify({ name: template.name, category: template.category, description: template.description, content: 'محتوى النموذج' }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`تم تحميل: ${template.name}`);
  };

  const handlePreview = (template: typeof mockHRTemplates[0]) => {
    setPreviewTemplate(template);
  };

  const handleEdit = (template: typeof mockHRTemplates[0]) => {
    setEditTemplate(template);
    setEditName(template.name);
    setEditDesc(template.description);
  };

  const handleSaveEdit = () => {
    if (editTemplate) {
      toast.success(`تم حفظ التعديلات على: ${editName}`);
      setEditTemplate(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <AppDashboardGrid columns={12} density="default" minRowHeight="auto">
        <AppGridItem colSpan={4}><MetricHeroCard title="إجمالي النماذج" value={mockHRTemplates.length} className="min-h-[120px]" /></AppGridItem>
        <AppGridItem colSpan={4}><MetricHeroCard title="الأكثر استخداماً" value={mostUsed.usageCount} description={mostUsed.name} unit="مرة" className="min-h-[120px]" /></AppGridItem>
        <AppGridItem colSpan={4}><MetricHeroCard title="محدثة حديثاً" value={recentlyUpdated} description="خلال 30 يوم" className="min-h-[120px]" /></AppGridItem>
      </AppDashboardGrid>

      {/* Search */}
      <div className="rounded-[24px] bg-white border border-[#DADCE0] p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgba(11,15,18,0.30)]" />
            <Input placeholder="البحث في النماذج..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pr-10 rounded-full border-[#DADCE0]" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium font-arabic transition-colors ${selectedCategory === cat ? 'bg-[#0B0F12] text-white' : 'border border-[#DADCE0] text-[#0B0F12] hover:bg-[#d9e7ed]/50'}`}
              >
                {cat === 'الكل' ? cat : categoryLabels[cat] || cat}
              </button>
            ))}
          </div>
        </div>

        {/* Templates list */}
        <div className="space-y-3">
          {filteredTemplates.map((template, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-[18px] border border-[#DADCE0] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-[rgba(11,15,18,0.40)]" />
                  <h4 className="text-sm font-bold text-[#0B0F12] font-arabic">{template.name}</h4>
                  <span className="px-2 py-0.5 rounded-full bg-[#d9e7ed] text-[10px] font-arabic">
                    {categoryLabels[template.category] || template.category}
                  </span>
                </div>
                <p className="text-[11px] text-[rgba(11,15,18,0.50)] font-arabic">{template.description}</p>
                <div className="flex gap-3 mt-1 text-[10px] text-[rgba(11,15,18,0.35)] font-arabic">
                  <span>{template.usageCount} مرة</span>
                  <span>آخر تعديل: {template.lastModified}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handlePreview(template)} className="p-2 rounded-full border border-[#DADCE0] hover:bg-[#d9e7ed]/50 transition-colors" title="عرض"><Eye className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDownload(template)} className="p-2 rounded-full border border-[#DADCE0] hover:bg-[#d9e7ed]/50 transition-colors" title="تحميل"><Download className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleEdit(template)} className="p-2 rounded-full border border-[#DADCE0] hover:bg-[#d9e7ed]/50 transition-colors" title="تعديل"><Edit className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-10 w-10 text-[rgba(11,15,18,0.15)] mx-auto mb-3" />
              <p className="text-sm text-[rgba(11,15,18,0.50)] font-arabic">لا توجد نماذج تطابق البحث</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setPreviewTemplate(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-[24px] border border-[#DADCE0] shadow-[0_12px_28px_rgba(0,0,0,0.10)] w-full max-w-lg max-h-[80vh] overflow-auto p-6 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#0B0F12] font-arabic">{previewTemplate.name}</h3>
              <button onClick={() => setPreviewTemplate(null)} className="p-2 rounded-full hover:bg-[#d9e7ed]/50 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3 text-sm font-arabic" dir="rtl">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[#d9e7ed] text-[10px]">{categoryLabels[previewTemplate.category] || previewTemplate.category}</span>
                <span className="text-[11px] text-[rgba(11,15,18,0.50)]">{previewTemplate.usageCount} مرة استخدام</span>
              </div>
              <p className="text-[rgba(11,15,18,0.70)]">{previewTemplate.description}</p>
              <div className="p-4 rounded-[18px] bg-[#d9e7ed]/20 border border-[#DADCE0]">
                <p className="text-xs text-[rgba(11,15,18,0.40)] mb-2">محتوى النموذج</p>
                <p className="text-[rgba(11,15,18,0.60)]">هذا نموذج {previewTemplate.name} - يحتوي على الحقول والبيانات المطلوبة لإتمام الإجراء.</p>
              </div>
              <p className="text-[10px] text-[rgba(11,15,18,0.35)]">آخر تعديل: {previewTemplate.lastModified}</p>
              <div className="flex justify-end">
                <button onClick={() => { handleDownload(previewTemplate); setPreviewTemplate(null); }} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0B0F12] text-white text-xs font-arabic hover:bg-[#0B0F12]/90 transition-colors">
                  <Download className="w-3.5 h-3.5" /> تحميل
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setEditTemplate(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-[24px] border border-[#DADCE0] shadow-[0_12px_28px_rgba(0,0,0,0.10)] w-full max-w-lg p-6 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#0B0F12] font-arabic">تعديل النموذج</h3>
              <button onClick={() => setEditTemplate(null)} className="p-2 rounded-full hover:bg-[#d9e7ed]/50 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4" dir="rtl">
              <div>
                <label className="block text-xs font-medium text-[rgba(11,15,18,0.50)] font-arabic mb-1">اسم النموذج</label>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="rounded-full border-[#DADCE0]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[rgba(11,15,18,0.50)] font-arabic mb-1">الوصف</label>
                <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={3} className="w-full px-4 py-2 rounded-[18px] border border-[#DADCE0] text-sm font-arabic resize-none focus:outline-none focus:ring-1 focus:ring-[#0B0F12]" />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setEditTemplate(null)} className="px-4 py-2 rounded-full border border-[#DADCE0] text-xs font-arabic hover:bg-[#d9e7ed]/50 transition-colors">إلغاء</button>
                <button onClick={handleSaveEdit} className="px-4 py-2 rounded-full bg-[#0B0F12] text-white text-xs font-arabic hover:bg-[#0B0F12]/90 transition-colors">حفظ التعديلات</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Usage chart */}
      <CapsuleBarChart title="أكثر النماذج استخداماً" data={usageData} color="#3DBE8B" />
    </div>
  );
};
