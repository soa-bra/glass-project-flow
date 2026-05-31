
import React, { useState } from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { NumericStatCard } from '@/components/shared/visual-data';
import { FileText, Download, Eye, Copy, Plus, Search } from 'lucide-react';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { downloadAsCSV } from '../shared/downloadUtils';
import { toast } from 'sonner';

export const TemplatesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState({ popular: false, recent: false });

  const templateCategories = [
    { name: 'حملات التسويق الرقمي', count: 12, icon: FileText, color: 'text-blue-600' },
    { name: 'البريد الإلكتروني', count: 8, icon: FileText, color: 'text-green-600' },
    { name: 'وسائل التواصل الاجتماعي', count: 15, icon: FileText, color: 'text-purple-600' },
    { name: 'العروض التقديمية', count: 6, icon: FileText, color: 'text-orange-600' },
  ];

  const [popularTemplates, setPopularTemplates] = useState([
    { name: 'قالب حملة إعلانية رقمية', category: 'التسويق الرقمي', downloads: 156, lastUpdated: '2024-01-15', status: 'محدث', type: 'PowerPoint' },
    { name: 'نموذج تقرير أداء الحملة', category: 'التقارير', downloads: 89, lastUpdated: '2024-01-10', status: 'محدث', type: 'Excel' },
    { name: 'قالب منشور وسائل التواصل', category: 'وسائل التواصل', downloads: 203, lastUpdated: '2024-01-08', status: 'محدث', type: 'PSD' },
    { name: 'نموذج طلب موافقة حملة', category: 'الموافقات', downloads: 67, lastUpdated: '2024-01-05', status: 'قديم', type: 'Word' },
  ]);

  const recentTemplates = [
    { name: 'قالب استراتيجية المحتوى الشهرية', category: 'التخطيط', createdDate: '2024-01-12', createdBy: 'سارة أحمد', type: 'Excel' },
    { name: 'نموذج تحليل المنافسين', category: 'التحليل', createdDate: '2024-01-10', createdBy: 'محمد علي', type: 'PowerPoint' },
    { name: 'قالب تقويم المحتوى', category: 'التخطيط', createdDate: '2024-01-08', createdBy: 'فاطمة سالم', type: 'Excel' },
  ];

  const handleDownload = (template: { name: string; category: string; type: string }) => {
    downloadAsCSV(['الاسم', 'الفئة', 'النوع'], [[template.name, template.category, template.type]], `قالب-تسويق`);
    toast.success(`تم تحميل: ${template.name}`);
  };

  const handlePreview = (name: string) => toast.info(`معاينة: ${name}`);

  const handleCopy = (template: { name: string; category: string; downloads: number; lastUpdated: string; status: string; type: string }) => {
    setPopularTemplates(prev => [{ ...template, name: `نسخة من ${template.name}`, downloads: 0 }, ...prev]);
    toast.success('تم نسخ القالب');
  };

  const handleAddTemplate = () => toast.success('تم فتح نموذج إضافة قالب جديد');
  const handleFilter = () => toast.info('تم تطبيق الفلتر');

  const filtered = searchTerm
    ? popularTemplates.filter(t => t.name.includes(searchTerm) || t.category.includes(searchTerm))
    : popularTemplates;

  return (
    <div className="space-y-6 p-6 bg-transparent">
      <BaseBox variant="operations" className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="البحث في النماذج والقوالب..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-arabic" />
          </div>
          <BaseActionButton variant="outline" size="sm" onClick={handleFilter}>فلترة</BaseActionButton>
          <BaseActionButton variant="primary" size="sm" onClick={handleAddTemplate}><Plus className="h-4 w-4 ml-1" /> إضافة قالب</BaseActionButton>
        </div>
      </BaseBox>

      <BaseBox variant="operations" className="p-6">
        <div className="flex items-center gap-2 mb-6"><FileText className="h-6 w-6 text-black" /><h3 className="text-xl font-bold text-black font-arabic">فئات النماذج والقوالب</h3></div>
        <AppDashboardGrid columns={12} minRowHeight="auto">
          {templateCategories.map((category, index) => (
            <AppGridItem key={index} colSpan={3} tabletSpan={3}>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => toast.info(`فئة: ${category.name} - ${category.count} قالب`)}>
                <div className="flex items-center justify-between mb-3"><category.icon className={`h-6 w-6 ${category.color}`} /><BaseBadge variant="default" size="sm">{category.count}</BaseBadge></div>
                <h4 className="font-medium font-arabic text-sm">{category.name}</h4>
              </div>
            </AppGridItem>
          ))}
        </AppDashboardGrid>
      </BaseBox>

      <AppDashboardGrid columns={12} minRowHeight="auto">
        <AppGridItem colSpan={6}>
          <BaseBox variant="operations" className="p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2"><Download className="h-5 w-5 text-black" /><h3 className="text-xl font-bold text-black font-arabic">الأكثر استخداماً</h3></div>
              <BaseActionButton variant="outline" size="sm" onClick={() => setShowAll(p => ({ ...p, popular: !p.popular }))}>عرض الكل</BaseActionButton>
            </div>
            <div className="space-y-3">
              {(showAll.popular ? filtered : filtered.slice(0, 3)).map((template, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3"><FileText className="h-4 w-4 text-gray-600" /><div><h4 className="font-medium font-arabic text-sm">{template.name}</h4><div className="flex items-center gap-3 text-xs text-gray-500 mt-1"><span className="font-arabic">{template.category}</span><span>{template.downloads} تحميل</span><BaseBadge variant={template.status === 'محدث' ? 'success' : 'warning'} size="sm">{template.status}</BaseBadge></div></div></div>
                  <div className="flex items-center gap-1">
                    <BaseActionButton size="sm" variant="outline" onClick={() => handlePreview(template.name)}><Eye className="h-4 w-4" /></BaseActionButton>
                    <BaseActionButton size="sm" variant="outline" onClick={() => handleDownload(template)}><Download className="h-4 w-4" /></BaseActionButton>
                    <BaseActionButton size="sm" variant="outline" onClick={() => handleCopy(template)}><Copy className="h-4 w-4" /></BaseActionButton>
                  </div>
                </div>
              ))}
            </div>
          </BaseBox>
        </AppGridItem>

        <AppGridItem colSpan={6}>
          <BaseBox variant="operations" className="p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2"><Plus className="h-5 w-5 text-black" /><h3 className="text-xl font-bold text-black font-arabic">المضافة حديثاً</h3></div>
              <BaseActionButton variant="outline" size="sm" onClick={() => setShowAll(p => ({ ...p, recent: !p.recent }))}>عرض الكل</BaseActionButton>
            </div>
            <div className="space-y-3">
              {recentTemplates.map((template, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3"><FileText className="h-4 w-4 text-gray-600" /><div><h4 className="font-medium font-arabic text-sm">{template.name}</h4><div className="flex items-center gap-3 text-xs text-gray-500 mt-1"><span className="font-arabic">{template.category}</span><span>{template.createdDate}</span><span className="font-arabic">{template.createdBy}</span></div></div></div>
                  <div className="flex items-center gap-1">
                    <BaseActionButton size="sm" variant="outline" onClick={() => handlePreview(template.name)}><Eye className="h-4 w-4" /></BaseActionButton>
                    <BaseActionButton size="sm" variant="outline" onClick={() => handleDownload(template)}><Download className="h-4 w-4" /></BaseActionButton>
                  </div>
                </div>
              ))}
            </div>
          </BaseBox>
        </AppGridItem>
      </AppDashboardGrid>

      <AppDashboardGrid columns={12} minRowHeight="auto">
        <AppGridItem colSpan={3}><NumericStatCard title="إجمالي القوالب" value={41} description="قالب" accentColor="#a4e2f6" /></AppGridItem>
        <AppGridItem colSpan={3}><NumericStatCard title="إجمالي التحميلات" value={312} description="تحميل" accentColor="#bdeed3" /></AppGridItem>
        <AppGridItem colSpan={3}><NumericStatCard title="مضاف هذا الشهر" value={8} description="قالب" accentColor="#fbe2aa" /></AppGridItem>
        <AppGridItem colSpan={3}><NumericStatCard title="متوسط التقييم" value="4.8" description="من 5" accentColor="#d9d2fd" /></AppGridItem>
      </AppDashboardGrid>
    </div>
  );
};
