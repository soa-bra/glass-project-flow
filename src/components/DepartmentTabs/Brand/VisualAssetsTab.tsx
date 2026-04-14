
import React, { useState } from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { BaseActionButton as UnifiedButton } from '@/components/shared/BaseActionButton';
import { BaseBadge as UnifiedBadge } from '@/components/ui/BaseBadge';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { NumericStatCard } from '@/components/shared/visual-data';
import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Palette, Upload, Search, Filter, Download, Eye, Edit,
  Image, FileText, Type, Grid3X3, Tag, HardDrive, Calendar,
  BarChart3, Shield, ExternalLink, Copy,
} from 'lucide-react';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { GenericFilterPopover, FilterOption } from '../shared/GenericFilterPopover';
import { downloadAsJSON } from '../shared/downloadUtils';
import { toast } from 'sonner';

// ─── Type helpers ───────────────────────────────────────────────
const ASSET_TYPE_MAP: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  logo:     { label: 'شعار',   icon: Image,    color: '#3DA8F5' },
  template: { label: 'قالب',   icon: FileText, color: '#3DBE8B' },
  color:    { label: 'ألوان',  icon: Palette,  color: '#a855f4' },
  font:     { label: 'خط',     icon: Type,     color: '#F6C445' },
  icon:     { label: 'أيقونة', icon: Grid3X3,  color: '#E5564D' },
};

const FORMAT_OPTIONS = [
  { value: 'SVG', label: 'SVG' }, { value: 'PNG', label: 'PNG' },
  { value: 'PDF', label: 'PDF' }, { value: 'AI', label: 'AI' },
  { value: 'EPS', label: 'EPS' }, { value: 'PPTX', label: 'PPTX' },
  { value: 'FIGMA', label: 'Figma' }, { value: 'ASE', label: 'ASE' },
  { value: 'TTF', label: 'TTF' }, { value: 'OTF', label: 'OTF' },
  { value: 'WOFF2', label: 'WOFF2' },
];

export const VisualAssetsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [viewingAsset, setViewingAsset] = useState<any>(null);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, string>>({});

  const [assets, setAssets] = useState([
    { id: 1, name: 'شعار سوبرا الرئيسي', type: 'logo', format: 'SVG', size: '2.4 MB', lastUsed: '2024-01-15', downloads: 127, status: 'approved', description: 'الشعار الرسمي للاستخدام في جميع المطبوعات والمنصات الرقمية', tags: ['رئيسي', 'رسمي', 'هوية'] },
    { id: 2, name: 'قالب العرض التقديمي', type: 'template', format: 'PPTX', size: '5.8 MB', lastUsed: '2024-01-14', downloads: 89, status: 'approved', description: 'قالب العروض التقديمية الرسمي المعتمد من فريق العلامة التجارية', tags: ['عروض', 'رسمي'] },
    { id: 3, name: 'مجموعة الألوان الرسمية', type: 'color', format: 'ASE', size: '124 KB', lastUsed: '2024-01-13', downloads: 203, status: 'approved', description: 'لوحة الألوان الرسمية المعتمدة في دليل الهوية البصرية', tags: ['ألوان', 'هوية', 'دليل'] },
    { id: 4, name: 'خط IBM Plex Arabic', type: 'font', format: 'WOFF2', size: '340 KB', lastUsed: '2024-01-12', downloads: 156, status: 'approved', description: 'الخط الرسمي المعتمد لجميع واجهات المستخدم والمطبوعات', tags: ['خط', 'واجهات', 'طباعة'] },
    { id: 5, name: 'أيقونات النظام الأساسية', type: 'icon', format: 'SVG', size: '1.1 MB', lastUsed: '2024-01-11', downloads: 78, status: 'approved', description: 'مجموعة الأيقونات المعتمدة للمنتجات الرقمية', tags: ['أيقونات', 'واجهات'] },
    { id: 6, name: 'شعار سوبرا — النسخة الداكنة', type: 'logo', format: 'PNG', size: '890 KB', lastUsed: '2024-01-10', downloads: 45, status: 'pending', description: 'نسخة الخلفية الداكنة من الشعار — قيد المراجعة النهائية', tags: ['شعار', 'داكن'] },
  ]);

  const assetCategories = [
    { id: 'all', name: 'جميع الأصول', count: assets.length },
    ...Object.entries(ASSET_TYPE_MAP).map(([id, { label }]) => ({
      id, name: label, count: assets.filter(a => a.type === id).length,
    })),
  ];

  // ── Upload fields ──
  const uploadFields: FormField[] = [
    { name: 'name', label: 'اسم الأصل', type: 'text', required: true, placeholder: 'مثال: شعار سوبرا — النسخة الأفقية' },
    { name: 'description', label: 'الوصف والإرشادات', type: 'textarea', placeholder: 'وصف الأصل وإرشادات الاستخدام المعتمدة...' },
    { name: 'type', label: 'تصنيف الأصل', type: 'select', required: true, options: Object.entries(ASSET_TYPE_MAP).map(([v, { label }]) => ({ value: v, label })) },
    { name: 'format', label: 'صيغة الملف', type: 'select', required: true, options: FORMAT_OPTIONS },
    { name: 'size', label: 'حجم الملف', type: 'text', placeholder: '2.4 MB' },
    { name: 'tags', label: 'الوسوم (مفصولة بفاصلة)', type: 'text', placeholder: 'هوية، رسمي، شعار' },
  ];

  // ── Handlers ──
  const handleUpload = (data: Record<string, string>) => {
    const newAsset = {
      id: Date.now(),
      name: data.name,
      type: data.type,
      format: data.format,
      size: data.size || 'غير محدد',
      lastUsed: new Date().toISOString().split('T')[0],
      downloads: 0,
      status: 'pending' as const,
      description: data.description || '',
      tags: data.tags ? data.tags.split('،').map(t => t.trim()).filter(Boolean) : [],
    };
    setAssets(prev => [newAsset, ...prev]);
  };

  const handleEditAsset = (data: Record<string, string>) => {
    if (!editingAsset) return;
    setAssets(prev => prev.map(a => a.id === editingAsset.id ? {
      ...a,
      name: data.name,
      format: data.format,
      status: data.status,
      description: data.description || a.description,
      tags: data.tags ? data.tags.split('،').map((t: string) => t.trim()).filter(Boolean) : a.tags,
    } : a));
    setEditingAsset(null);
  };

  const handleDownloadAsset = (asset: any) => {
    downloadAsJSON({ name: asset.name, type: asset.type, format: asset.format, size: asset.size, description: asset.description, tags: asset.tags }, `أصل-${asset.name}`);
    setAssets(prev => prev.map(a => a.id === asset.id ? { ...a, downloads: a.downloads + 1 } : a));
    toast.success(`تم تنزيل: ${asset.name}`);
  };

  const editFields: FormField[] = editingAsset ? [
    { name: 'name', label: 'اسم الأصل', type: 'text', required: true, defaultValue: editingAsset.name },
    { name: 'description', label: 'الوصف والإرشادات', type: 'textarea', defaultValue: editingAsset.description || '' },
    { name: 'format', label: 'صيغة الملف', type: 'select', required: true, defaultValue: editingAsset.format, options: FORMAT_OPTIONS },
    { name: 'status', label: 'حالة الاعتماد', type: 'select', required: true, defaultValue: editingAsset.status, options: [
      { value: 'approved', label: 'معتمد' }, { value: 'pending', label: 'قيد المراجعة' }, { value: 'archived', label: 'مؤرشف' },
    ]},
    { name: 'tags', label: 'الوسوم (مفصولة بفاصلة)', type: 'text', defaultValue: (editingAsset.tags || []).join('، ') },
  ] : [];

  const filterOpts: FilterOption[] = [
    { name: 'status', label: 'حالة الاعتماد', options: [{ value: 'approved', label: 'معتمد' }, { value: 'pending', label: 'قيد المراجعة' }] },
    { name: 'format', label: 'صيغة الملف', options: FORMAT_OPTIONS.slice(0, 6) },
  ];

  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.tags || []).some(t => t.includes(searchTerm));
    const matchesCategory = selectedCategory === 'all' || a.type === selectedCategory;
    const matchesStatus = !advancedFilters.status || advancedFilters.status === 'all' || a.status === advancedFilters.status;
    const matchesFormat = !advancedFilters.format || advancedFilters.format === 'all' || a.format === advancedFilters.format;
    return matchesSearch && matchesCategory && matchesStatus && matchesFormat;
  });

  const AssetTypeIcon = ({ type }: { type: string }) => {
    const entry = ASSET_TYPE_MAP[type];
    if (!entry) return <Type className="h-4 w-4" />;
    const Icon = entry.icon;
    return <Icon className="h-4 w-4" style={{ color: entry.color }} />;
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[rgba(11,15,18,0.4)] h-4 w-4" />
            <Input
              placeholder="البحث بالاسم أو الوسم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <GenericFilterPopover
            filters={filterOpts}
            onApply={(values) => setAdvancedFilters(values)}
            onReset={() => setAdvancedFilters({})}
            resultCount={filteredAssets.length}
            triggerButton={
              <UnifiedButton variant="outline" size="sm" className="flex items-center gap-1.5">
                <Filter className="h-4 w-4" /> تصفية
                {Object.keys(advancedFilters).length > 0 && (
                  <UnifiedBadge variant="info" className="text-[10px] px-1.5 py-0">{Object.keys(advancedFilters).length}</UnifiedBadge>
                )}
              </UnifiedButton>
            }
          />
        </div>
        <UnifiedButton onClick={() => setIsUploadOpen(true)} className="flex items-center gap-1.5">
          <Upload className="h-4 w-4" /> رفع أصل جديد
        </UnifiedButton>
      </div>

      {/* ── Layout: Sidebar + Content ── */}
      <AppDashboardGrid columns={12} minRowHeight="auto">
        {/* Category sidebar */}
        <AppGridItem colSpan={3}>
          <BaseBox>
            <div className="mb-3">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <Palette className="h-4 w-4" /> تصنيفات الأصول
              </h3>
            </div>
            <div className="space-y-1">
              {assetCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-right text-sm transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-[rgba(11,15,18,0.06)] font-semibold'
                      : 'hover:bg-[rgba(11,15,18,0.03)]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {cat.id !== 'all' && <AssetTypeIcon type={cat.id} />}
                    {cat.name}
                  </span>
                  <span className="text-xs text-[rgba(11,15,18,0.5)] tabular-nums">{cat.count}</span>
                </button>
              ))}
            </div>
          </BaseBox>
        </AppGridItem>

        {/* Asset grid */}
        <AppGridItem colSpan={9}>
          <div className="space-y-6">
            <BaseBox>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <Palette className="h-4 w-4" /> الأصول البصرية
                </h3>
                <span className="text-sm text-[rgba(11,15,18,0.5)]">{filteredAssets.length} أصل</span>
              </div>

              {filteredAssets.length === 0 ? (
                <div className="text-center py-12 text-[rgba(11,15,18,0.4)]">
                  <Image className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-arabic">لا توجد أصول مطابقة للبحث أو التصفية الحالية</p>
                </div>
              ) : (
                <AppDashboardGrid columns={12} minRowHeight="auto">
                  {filteredAssets.map((asset) => (
                    <AppGridItem key={asset.id} colSpan={4} tabletSpan={6}>
                      <AppCardSurface density="compact" interactive="hoverable" className="h-full flex flex-col">
                        {/* Card header: icon + status */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <AssetTypeIcon type={asset.type} />
                            <span className="text-xs text-[rgba(11,15,18,0.5)]">{ASSET_TYPE_MAP[asset.type]?.label || asset.type}</span>
                          </div>
                          <UnifiedBadge variant={asset.status === 'approved' ? 'success' : 'warning'}>
                            {asset.status === 'approved' ? 'معتمد' : 'قيد المراجعة'}
                          </UnifiedBadge>
                        </div>

                        {/* Name + description */}
                        <h4 className="font-semibold text-sm mb-1 line-clamp-1">{asset.name}</h4>
                        {asset.description && (
                          <p className="text-xs text-[rgba(11,15,18,0.5)] line-clamp-2 mb-3">{asset.description}</p>
                        )}

                        {/* Metadata */}
                        <div className="flex-1 space-y-1.5 text-xs text-[rgba(11,15,18,0.7)] mb-3">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1"><HardDrive className="h-3 w-3" /> {asset.format}</span>
                            <span>{asset.size}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1"><Download className="h-3 w-3" /> {asset.downloads} تحميل</span>
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {asset.lastUsed}</span>
                          </div>
                        </div>

                        {/* Tags */}
                        {asset.tags && asset.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {asset.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="text-[10px] px-1.5 py-0.5 bg-[rgba(11,15,18,0.05)] rounded-full text-[rgba(11,15,18,0.6)]">{tag}</span>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 pt-2 border-t border-[#DADCE0]">
                          <UnifiedButton size="sm" variant="outline" className="flex-1 flex items-center justify-center gap-1" onClick={() => setViewingAsset(asset)}>
                            <Eye className="h-3 w-3" /> عرض
                          </UnifiedButton>
                          <UnifiedButton size="sm" variant="outline" onClick={() => handleDownloadAsset(asset)}>
                            <Download className="h-3 w-3" />
                          </UnifiedButton>
                          <UnifiedButton size="sm" variant="outline" onClick={() => setEditingAsset(asset)}>
                            <Edit className="h-3 w-3" />
                          </UnifiedButton>
                        </div>
                      </AppCardSurface>
                    </AppGridItem>
                  ))}
                </AppDashboardGrid>
              )}
            </BaseBox>

            {/* Stats row */}
            <AppDashboardGrid columns={12} minRowHeight="auto">
              <AppGridItem colSpan={4}>
                <NumericStatCard title="إجمالي التحميلات" value={assets.reduce((s, a) => s + a.downloads, 0)} description="تحميل" accentColor="#a4e2f6" />
              </AppGridItem>
              <AppGridItem colSpan={4}>
                <NumericStatCard title="أصول معتمدة" value={assets.filter(a => a.status === 'approved').length} description={`من ${assets.length}`} accentColor="#bdeed3" />
              </AppGridItem>
              <AppGridItem colSpan={4}>
                <NumericStatCard title="صيغ مستخدمة" value={new Set(assets.map(a => a.format)).size} description="صيغة" accentColor="#d9d2fd" />
              </AppGridItem>
            </AppDashboardGrid>
          </div>
        </AppGridItem>
      </AppDashboardGrid>

      {/* ════════════════════════════════════════════════
          MODAL: Upload Asset
         ════════════════════════════════════════════════ */}
      <GenericFormModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="رفع أصل بصري جديد"
        fields={uploadFields}
        onSubmit={handleUpload}
        submitLabel="رفع الأصل"
        successMessage="تم رفع الأصل بنجاح — سيظهر بحالة «قيد المراجعة» حتى الاعتماد"
      />

      {/* ════════════════════════════════════════════════
          MODAL: Edit Asset
         ════════════════════════════════════════════════ */}
      {editingAsset && (
        <GenericFormModal
          isOpen={!!editingAsset}
          onClose={() => setEditingAsset(null)}
          title={`تعديل: ${editingAsset.name}`}
          fields={editFields}
          onSubmit={handleEditAsset}
          submitLabel="حفظ التعديلات"
          successMessage="تم تحديث الأصل بنجاح"
        />
      )}

      {/* ════════════════════════════════════════════════
          MODAL: View Asset Details (specialized)
         ════════════════════════════════════════════════ */}
      {viewingAsset && (
        <Dialog open={!!viewingAsset} onOpenChange={() => setViewingAsset(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold font-arabic text-center">تفاصيل الأصل</DialogTitle>
            </DialogHeader>

            <div className="space-y-5 mt-4">
              {/* Hero section */}
              <div className="p-4 bg-white/30 rounded-2xl border border-black/5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(11,15,18,0.05)] flex items-center justify-center">
                      <AssetTypeIcon type={viewingAsset.type} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold font-arabic">{viewingAsset.name}</h3>
                      <span className="text-xs text-[rgba(11,15,18,0.5)]">
                        {ASSET_TYPE_MAP[viewingAsset.type]?.label || viewingAsset.type} • {viewingAsset.format}
                      </span>
                    </div>
                  </div>
                  <UnifiedBadge variant={viewingAsset.status === 'approved' ? 'success' : 'warning'}>
                    {viewingAsset.status === 'approved' ? 'معتمد' : 'قيد المراجعة'}
                  </UnifiedBadge>
                </div>
                {viewingAsset.description && (
                  <p className="text-sm text-[rgba(11,15,18,0.7)] font-arabic mt-3">{viewingAsset.description}</p>
                )}
              </div>

              {/* Metadata grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: HardDrive, label: 'الصيغة', value: viewingAsset.format },
                  { icon: Tag, label: 'الحجم', value: viewingAsset.size },
                  { icon: Download, label: 'التحميلات', value: `${viewingAsset.downloads} مرة` },
                  { icon: Calendar, label: 'آخر استخدام', value: viewingAsset.lastUsed },
                  { icon: Shield, label: 'حالة الاعتماد', value: viewingAsset.status === 'approved' ? 'معتمد' : 'قيد المراجعة' },
                  { icon: BarChart3, label: 'التصنيف', value: ASSET_TYPE_MAP[viewingAsset.type]?.label || viewingAsset.type },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3 bg-white/30 rounded-xl border border-black/5">
                    <item.icon className="h-4 w-4 text-[rgba(11,15,18,0.4)] shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-[rgba(11,15,18,0.5)] font-arabic">{item.label}</div>
                      <div className="text-sm font-semibold font-arabic truncate">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              {viewingAsset.tags && viewingAsset.tags.length > 0 && (
                <div className="p-4 bg-white/30 rounded-2xl border border-black/5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Tag className="h-4 w-4 text-[rgba(11,15,18,0.4)]" />
                    <span className="text-sm font-semibold font-arabic">الوسوم</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingAsset.tags.map((tag: string, i: number) => (
                      <UnifiedBadge key={i} variant="outline">{tag}</UnifiedBadge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="flex justify-end gap-2 mt-6">
              <UnifiedButton variant="outline" size="sm" onClick={() => handleDownloadAsset(viewingAsset)}>
                <Download className="h-3.5 w-3.5 ml-1" /> تنزيل
              </UnifiedButton>
              <UnifiedButton variant="outline" size="sm" onClick={() => { setViewingAsset(null); setEditingAsset(viewingAsset); }}>
                <Edit className="h-3.5 w-3.5 ml-1" /> تعديل
              </UnifiedButton>
              <UnifiedButton variant="outline" onClick={() => setViewingAsset(null)}>إغلاق</UnifiedButton>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
