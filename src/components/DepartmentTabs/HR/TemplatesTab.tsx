import React, { useState } from 'react';
import { FileText, Download, Eye, Edit, Plus, Search } from 'lucide-react';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Input } from '@/components/ui/input';
import { MetricHeroCard } from '@/components/shared/visual-data/MetricHeroCard';
import { CapsuleBarChart } from '@/components/shared/visual-data/CapsuleBarChart';
import { mockHRTemplates } from './data';

export const TemplatesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

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

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricHeroCard title="إجمالي النماذج" value={mockHRTemplates.length} className="min-h-[120px]" />
        <MetricHeroCard title="الأكثر استخداماً" value={mostUsed.usageCount} description={mostUsed.name} unit="مرة" className="min-h-[120px]" />
        <MetricHeroCard title="محدثة حديثاً" value={recentlyUpdated} description="خلال 30 يوم" className="min-h-[120px]" />
      </div>

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
                <button className="p-2 rounded-full border border-[#DADCE0] hover:bg-[#d9e7ed]/50 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                <button className="p-2 rounded-full border border-[#DADCE0] hover:bg-[#d9e7ed]/50 transition-colors"><Download className="w-3.5 h-3.5" /></button>
                <button className="p-2 rounded-full border border-[#DADCE0] hover:bg-[#d9e7ed]/50 transition-colors"><Edit className="w-3.5 h-3.5" /></button>
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

      {/* Usage chart */}
      <CapsuleBarChart title="أكثر النماذج استخداماً" data={usageData} color="#3DBE8B" />
    </div>
  );
};
