
import React, { useState } from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { BaseActionButton as UnifiedButton } from '@/components/shared/BaseActionButton';
import { BaseBadge as UnifiedBadge } from '@/components/ui/BaseBadge';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { NumericStatCard } from '@/components/shared/visual-data';
import { Input } from '@/components/ui/input';
import { Palette, Upload, Search, Filter, Download, Eye, Edit, Image, FileText, Type } from 'lucide-react';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { GenericDetailModal } from '../shared/GenericDetailModal';
import { GenericFilterPopover, FilterOption } from '../shared/GenericFilterPopover';
import { downloadAsJSON } from '../shared/downloadUtils';
import { toast } from 'sonner';

export const VisualAssetsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [viewingAsset, setViewingAsset] = useState<any>(null);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, string>>({});

  const assetCategories = [
    { id: 'all', name: 'جميع الأصول', count: 245 },
    { id: 'logos', name: 'الشعارات', count: 28 },
    { id: 'fonts', name: 'الخطوط', count: 15 },
    { id: 'colors', name: 'الألوان', count: 12 },
    { id: 'templates', name: 'القوالب', count: 89 },
    { id: 'icons', name: 'الأيقونات', count: 101 },
  ];

  const [assets, setAssets] = useState([
    { id: 1, name: 'شعار سوبرا الرئيسي', type: 'logo', format: 'SVG', size: '2.4 MB', lastUsed: '2024-01-15', downloads: 127, status: 'approved' },
    { id: 2, name: 'قالب العرض التقديمي', type: 'template', format: 'PPTX', size: '5.8 MB', lastUsed: '2024-01-14', downloads: 89, status: 'approved' },
    { id: 3, name: 'مجموعة الألوان الرسمية', type: 'color', format: 'ASE', size: '124 KB', lastUsed: '2024-01-13', downloads: 203, status: 'approved' },
  ]);

  const uploadFields: FormField[] = [
    { name: 'name', label: 'اسم الأصل', type: 'text', required: true, placeholder: 'أدخل اسم الأصل' },
    { name: 'type', label: 'النوع', type: 'select', required: true, options: [
      { value: 'logo', label: 'شعار' }, { value: 'template', label: 'قالب' }, { value: 'color', label: 'ألوان' }, { value: 'font', label: 'خط' }, { value: 'icon', label: 'أيقونة' },
    ]},
    { name: 'format', label: 'الصيغة', type: 'text', required: true, placeholder: 'SVG, PNG, PDF...' },
    { name: 'size', label: 'الحجم', type: 'text', placeholder: '2.4 MB' },
    { name: 'description', label: 'الوصف', type: 'textarea', placeholder: 'وصف الأصل...' },
  ];

  const editFields = editingAsset ? [
    { name: 'name', label: 'اسم الأصل', type: 'text' as const, required: true, defaultValue: editingAsset.name },
    { name: 'format', label: 'الصيغة', type: 'text' as const, required: true, defaultValue: editingAsset.format },
    { name: 'status', label: 'الحالة', type: 'select' as const, required: true, defaultValue: editingAsset.status, options: [
      { value: 'approved', label: 'معتمد' }, { value: 'pending', label: 'قيد المراجعة' },
    ]},
  ] : [];

  const filterOpts: FilterOption[] = [
    { name: 'status', label: 'الحالة', options: [{ value: 'approved', label: 'معتمد' }, { value: 'pending', label: 'قيد المراجعة' }] },
    { name: 'format', label: 'الصيغة', options: [{ value: 'SVG', label: 'SVG' }, { value: 'PNG', label: 'PNG' }, { value: 'PPTX', label: 'PPTX' }, { value: 'PDF', label: 'PDF' }] },
  ];

  const handleUpload = (data: Record<string, string>) => {
    const newAsset = { id: Date.now(), name: data.name, type: data.type, format: data.format, size: data.size || 'غير محدد', lastUsed: new Date().toISOString().split('T')[0], downloads: 0, status: 'approved' };
    setAssets(prev => [newAsset, ...prev]);
  };

  const handleEditAsset = (data: Record<string, string>) => {
    if (!editingAsset) return;
    setAssets(prev => prev.map(a => a.id === editingAsset.id ? { ...a, name: data.name, format: data.format, status: data.status } : a));
    setEditingAsset(null);
  };

  const handleDownloadAsset = (asset: any) => {
    downloadAsJSON({ name: asset.name, type: asset.type, format: asset.format, size: asset.size }, `أصل-${asset.name}`);
    setAssets(prev => prev.map(a => a.id === asset.id ? { ...a, downloads: a.downloads + 1 } : a));
    toast.success(`تم تنزيل: ${asset.name}`);
  };

  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || a.type === selectedCategory;
    const matchesStatus = !advancedFilters.status || advancedFilters.status === 'all' || a.status === advancedFilters.status;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="البحث في الأصول..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-80" />
          </div>
          <GenericFilterPopover
            filters={filterOpts}
            onApply={(values) => setAdvancedFilters(values)}
            onReset={() => setAdvancedFilters({})}
            resultCount={filteredAssets.length}
            triggerButton={<UnifiedButton variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" /> تصفية</UnifiedButton>}
          />
        </div>
        <UnifiedButton onClick={() => setIsUploadOpen(true)}><Upload className="h-4 w-4 mr-2" /> رفع أصل جديد</UnifiedButton>
      </div>

      <AppDashboardGrid columns={12} minRowHeight="auto">
        <AppGridItem colSpan={3}>
          <BaseBox>
            <div className="mb-4"><h3 className="text-lg font-semibold flex items-center gap-2">فئات الأصول</h3></div>
            <div className="space-y-2">
              {assetCategories.map((category) => (
                <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`w-full flex items-center justify-between p-3 rounded-lg text-right transition-colors ${selectedCategory === category.id ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50'}`}>
                  <span className="font-medium">{category.name}</span>
                  <UnifiedBadge variant="info">{category.count}</UnifiedBadge>
                </button>
              ))}
            </div>
          </BaseBox>
        </AppGridItem>

        <AppGridItem colSpan={9}>
          <div className="space-y-6">
            <BaseBox>
              <div className="mb-4"><h3 className="text-lg font-semibold flex items-center gap-2"><Palette className="h-5 w-5" /> الأصول البصرية ({filteredAssets.length})</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAssets.map((asset) => (
                  <div key={asset.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {asset.type === 'logo' && <Image className="h-4 w-4 text-blue-600" />}
                        {asset.type === 'template' && <FileText className="h-4 w-4 text-green-600" />}
                        {asset.type === 'color' && <Palette className="h-4 w-4 text-purple-600" />}
                        {!['logo', 'template', 'color'].includes(asset.type) && <Type className="h-4 w-4 text-gray-600" />}
                      </div>
                      <UnifiedBadge variant={asset.status === 'approved' ? 'success' : 'warning'}>
                        {asset.status === 'approved' ? 'معتمد' : 'قيد المراجعة'}
                      </UnifiedBadge>
                    </div>
                    <h3 className="font-medium mb-2">{asset.name}</h3>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <div className="flex justify-between"><span>الصيغة:</span><span>{asset.format}</span></div>
                      <div className="flex justify-between"><span>الحجم:</span><span>{asset.size}</span></div>
                      <div className="flex justify-between"><span>التحميلات:</span><span>{asset.downloads}</span></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <UnifiedButton size="sm" variant="outline" onClick={() => setViewingAsset(asset)}><Eye className="h-3 w-3 mr-1" /> عرض</UnifiedButton>
                      <UnifiedButton size="sm" variant="outline" onClick={() => handleDownloadAsset(asset)}><Download className="h-3 w-3" /></UnifiedButton>
                      <UnifiedButton size="sm" variant="outline" onClick={() => setEditingAsset(asset)}><Edit className="h-3 w-3" /></UnifiedButton>
                    </div>
                  </div>
                ))}
              </div>
            </BaseBox>

            <AppDashboardGrid columns={12} minRowHeight="auto">
              <AppGridItem colSpan={4}>
                <NumericStatCard title="إجمالي التحميلات" value={assets.reduce((s, a) => s + a.downloads, 0)} description="تحميل" accentColor="#a4e2f6" />
              </AppGridItem>
              <AppGridItem colSpan={4}>
                <NumericStatCard title="معدل الاستخدام" value="89%" description="نسبة" accentColor="#bdeed3" />
              </AppGridItem>
              <AppGridItem colSpan={4}>
                <NumericStatCard title="إجمالي الأصول" value={assets.length} description="أصل" accentColor="#d9d2fd" />
              </AppGridItem>
            </AppDashboardGrid>
          </div>
        </AppGridItem>
      </AppDashboardGrid>

      <GenericFormModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="رفع أصل بصري جديد" fields={uploadFields} onSubmit={handleUpload} submitLabel="رفع الأصل" successMessage="تم رفع الأصل بنجاح" />
      {editingAsset && <GenericFormModal isOpen={!!editingAsset} onClose={() => setEditingAsset(null)} title={`تعديل: ${editingAsset.name}`} fields={editFields} onSubmit={handleEditAsset} submitLabel="حفظ التعديلات" successMessage="تم تحديث الأصل" />}
      {viewingAsset && (
        <GenericDetailModal isOpen={!!viewingAsset} onClose={() => setViewingAsset(null)} title={`تفاصيل: ${viewingAsset.name}`} fields={[
          { label: 'الاسم', value: viewingAsset.name }, { label: 'النوع', value: viewingAsset.type }, { label: 'الصيغة', value: viewingAsset.format },
          { label: 'الحجم', value: viewingAsset.size }, { label: 'التحميلات', value: viewingAsset.downloads }, { label: 'آخر استخدام', value: viewingAsset.lastUsed },
          { label: 'الحالة', value: viewingAsset.status === 'approved' ? 'معتمد' : 'قيد المراجعة' },
        ]} />
      )}
    </div>
  );
};
