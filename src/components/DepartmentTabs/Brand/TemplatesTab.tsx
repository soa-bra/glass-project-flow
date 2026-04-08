import React, { useState } from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { Input } from '@/components/ui/input';
import { 
  FileText, Image, Presentation, Layout,
  Download, Eye, Edit, Upload, Search, Filter, Star, Calendar
} from 'lucide-react';

export const TemplatesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templateCategories = [
    { id: 'all', name: 'جميع القوالب', count: 87, icon: FileText },
    { id: 'presentations', name: 'العروض التقديمية', count: 23, icon: Presentation },
    { id: 'documents', name: 'المستندات', count: 31, icon: FileText },
    { id: 'social', name: 'وسائل التواصل', count: 19, icon: Image },
    { id: 'reports', name: 'التقارير', count: 14, icon: Layout },
  ];

  const templates = [
    { id: 1, name: 'قالب العرض التقديمي الرسمي', category: 'presentations', type: 'PPTX', description: 'قالب موحد للعروض التقديمية مع الهوية البصرية لسوبرا', downloads: 234, rating: 4.8, lastUpdated: '2024-01-15', culturalCompliance: 96, tags: ['رسمي', 'عروض', 'هوية'] },
    { id: 2, name: 'نموذج التقرير الشهري', category: 'reports', type: 'DOCX', description: 'نموذج موحد للتقارير الشهرية مع المؤشرات الثقافية', downloads: 189, rating: 4.6, lastUpdated: '2024-01-12', culturalCompliance: 92, tags: ['تقارير', 'شهري', 'مؤشرات'] },
    { id: 3, name: 'قالب منشورات وسائل التواصل', category: 'social', type: 'PSD', description: 'مجموعة قوالب لمنشورات وسائل التواصل الاجتماعي', downloads: 356, rating: 4.9, lastUpdated: '2024-01-10', culturalCompliance: 98, tags: ['سوشيال', 'منشورات', 'تفاعل'] },
    { id: 4, name: 'نموذج دراسة الحالة', category: 'documents', type: 'DOCX', description: 'نموذج لكتابة دراسات الحالة بالمعايير الأكاديمية', downloads: 127, rating: 4.5, lastUpdated: '2024-01-08', culturalCompliance: 94, tags: ['دراسة', 'أكاديمي', 'بحث'] },
  ];

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.includes(searchTerm) || t.description.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgba(11,15,18,0.30)] h-4 w-4" />
            <Input placeholder="البحث في القوالب..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-80 rounded-full" />
          </div>
          <BaseActionButton variant="outline" size="sm" icon={<Filter className="w-4 h-4" />}>تصفية</BaseActionButton>
        </div>
        <BaseActionButton variant="primary" size="md" icon={<Upload className="w-4 h-4" />}>رفع قالب جديد</BaseActionButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <BaseBox title="فئات القوالب">
            <div className="space-y-2">
              {templateCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-full text-right transition-colors font-arabic ${
                      selectedCategory === category.id ? 'bg-[rgba(11,15,18,0.04)] border border-[#DADCE0]' : 'hover:bg-[rgba(11,15,18,0.02)]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-[#0B0F12]" />
                      <span className="text-[12px] font-medium text-[#0B0F12]">{category.name}</span>
                    </div>
                    <BaseBadge variant="secondary" size="sm">{category.count}</BaseBadge>
                  </button>
                );
              })}
            </div>
          </BaseBox>

          <BaseBox title="إحصائيات القوالب">
            <div className="space-y-4">
              {[
                { value: '2,847', label: 'إجمالي التحميلات' },
                { value: '4.7', label: 'متوسط التقييم' },
                { value: '94%', label: 'التوافق الثقافي' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-[28px] font-bold text-[#0B0F12] font-arabic">{stat.value}</div>
                  <div className="text-[11px] text-[rgba(11,15,18,0.50)] font-arabic">{stat.label}</div>
                </div>
              ))}
            </div>
          </BaseBox>
        </div>

        {/* Templates Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <BaseBox key={template.id}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-[#0B0F12] font-arabic mb-1">{template.name}</h3>
                    <p className="text-[11px] text-[rgba(11,15,18,0.50)] font-arabic mb-2">{template.description}</p>
                    <div className="flex items-center gap-2">
                      <BaseBadge variant="outline" size="sm">{template.type}</BaseBadge>
                      <div className="flex items-center gap-1 text-[11px] text-[rgba(11,15,18,0.50)]">
                        <Star className="h-3 w-3 fill-[#F6C445] text-[#F6C445]" />
                        <span>{template.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Template Preview */}
                <div className="aspect-video bg-[rgba(11,15,18,0.02)] rounded-[14px] flex items-center justify-center mb-3">
                  <div className="text-center text-[rgba(11,15,18,0.30)]">
                    <Image className="h-10 w-10 mx-auto mb-1" />
                    <div className="text-[10px] font-arabic">معاينة القالب</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px] font-arabic mb-3">
                  <div><span className="text-[rgba(11,15,18,0.40)]">التحميلات:</span> <span className="font-bold text-[#0B0F12]">{template.downloads}</span></div>
                  <div><span className="text-[rgba(11,15,18,0.40)]">التوافق:</span> <span className="font-bold text-[#0B0F12]">{template.culturalCompliance}%</span></div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {template.tags.map((tag, i) => (
                    <BaseBadge key={i} variant="secondary" size="sm">{tag}</BaseBadge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <BaseActionButton variant="outline" size="sm" icon={<Eye className="w-3 h-3" />}>معاينة</BaseActionButton>
                  <BaseActionButton variant="outline" size="sm" icon={<Download className="w-3 h-3" />}>تحميل</BaseActionButton>
                  <BaseActionButton variant="outline" size="sm" icon={<Edit className="w-3 h-3" />} />
                </div>

                <div className="flex items-center gap-1 text-[10px] text-[rgba(11,15,18,0.30)] mt-3 font-arabic">
                  <Calendar className="h-3 w-3" />
                  <span>آخر تحديث: {template.lastUpdated}</span>
                </div>
              </BaseBox>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <BaseBox>
              <div className="text-center py-8">
                <FileText className="h-10 w-10 text-[rgba(11,15,18,0.20)] mx-auto mb-3" />
                <h3 className="text-sm font-bold text-[#0B0F12] font-arabic mb-1">لا توجد قوالب</h3>
                <p className="text-[11px] text-[rgba(11,15,18,0.50)] font-arabic mb-4">
                  {searchTerm ? 'لم يتم العثور على قوالب تطابق البحث' : 'لم يتم إنشاء أي قوالب بعد'}
                </p>
                <BaseActionButton variant="primary" size="sm" icon={<Upload className="w-4 h-4" />}>إضافة قالب جديد</BaseActionButton>
              </div>
            </BaseBox>
          )}
        </div>
      </div>
    </div>
  );
};
