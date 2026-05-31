
import React, { useState } from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { BaseActionButton as UnifiedButton } from '@/components/shared/BaseActionButton';
import { BaseBadge as UnifiedBadge } from '@/components/ui/BaseBadge';
import { Input } from '@/components/ui/input';
import { Calendar, Image, FileText, Settings, Plus, Upload, Search, Filter, Eye, Download } from 'lucide-react';
import { GenericDetailModal, DetailField } from '../shared/GenericDetailModal';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { toast } from 'sonner';

export const ContentAssetsTab: React.FC = () => {
  const [activeView, setActiveView] = useState<'calendar' | 'assets' | 'dam'>('calendar');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<any>(null);

  const [contentCalendar, setContentCalendar] = useState([
    { id: '1', title: 'منشور العودة للمدارس - فيسبوك', content: 'محتوى ترويجي للعودة للمدارس مع عروض خاصة', type: 'post', platform: ['Facebook', 'Instagram'], scheduledDate: '2024-08-15T10:00:00', status: 'scheduled', campaign: 'حملة العودة للمدارس 2024', approvalStatus: 'approved', assets: ['img1', 'img2'] },
    { id: '2', title: 'قصة إنستقرام - نصائح دراسية', content: 'نصائح وإرشادات للطلاب', type: 'story', platform: ['Instagram'], scheduledDate: '2024-08-16T14:30:00', status: 'draft', campaign: 'حملة العودة للمدارس 2024', approvalStatus: 'pending', assets: ['video1'] },
    { id: '3', title: 'إعلان لينكد إن - خدمات الاستشارات', content: 'إعلان مدفوع للخدمات الاستشارية', type: 'ad', platform: ['LinkedIn'], scheduledDate: '2024-08-17T09:00:00', status: 'scheduled', campaign: 'حملة الخدمات المهنية', approvalStatus: 'approved', assets: ['design1', 'copy1'] },
  ]);

  const marketingAssets = [
    { id: 'img1', name: 'صورة العودة للمدارس - رئيسية', type: 'image', category: 'social_media', fileSize: 2.5, dimensions: { width: 1200, height: 630 }, createdBy: 'أحمد المصمم', createdAt: '2024-08-01', status: 'approved', brandCompliant: true, tags: ['عودة_للمدارس', 'تعليم', 'طلاب'] },
    { id: 'video1', name: 'فيديو نصائح دراسية', type: 'video', category: 'social_media', fileSize: 45.2, createdBy: 'سارة المنتجة', createdAt: '2024-08-03', status: 'review', brandCompliant: false, tags: ['نصائح', 'دراسة', 'تعليم'] },
    { id: 'design1', name: 'تصميم إعلان لينكد إن', type: 'image', category: 'digital_ads', fileSize: 1.8, dimensions: { width: 1200, height: 627 }, createdBy: 'محمد المبدع', createdAt: '2024-08-05', status: 'approved', brandCompliant: true, tags: ['استشارات', 'مهني', 'خدمات'] },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: string }> = {
      'scheduled': { label: 'مجدول', variant: 'info' }, 'published': { label: 'منشور', variant: 'success' },
      'draft': { label: 'مسودة', variant: 'default' }, 'approved': { label: 'معتمد', variant: 'success' },
      'review': { label: 'قيد المراجعة', variant: 'warning' }, 'pending': { label: 'في الانتظار', variant: 'default' },
    };
    const info = statusMap[status] || statusMap.draft;
    return <UnifiedBadge variant={info.variant as any}>{info.label}</UnifiedBadge>;
  };

  const formatFileSize = (sizeInMB: number) => sizeInMB < 1 ? `${(sizeInMB * 1024).toFixed(0)} KB` : `${sizeInMB.toFixed(1)} MB`;

  const contentFields: FormField[] = [
    { name: 'title', label: 'عنوان المحتوى', type: 'text', required: true, placeholder: 'أدخل العنوان' },
    { name: 'content', label: 'المحتوى', type: 'textarea', required: true, placeholder: 'أدخل المحتوى...' },
    { name: 'type', label: 'النوع', type: 'select', required: true, options: [
      { value: 'post', label: 'منشور' }, { value: 'story', label: 'قصة' }, { value: 'ad', label: 'إعلان' },
    ]},
    { name: 'campaign', label: 'الحملة', type: 'text', placeholder: 'اسم الحملة' },
  ];

  const handleAddContent = (data: Record<string, string>) => {
    setContentCalendar(prev => [{ id: `c-${Date.now()}`, title: data.title, content: data.content, type: data.type, platform: [], scheduledDate: new Date().toISOString(), status: 'draft', campaign: data.campaign || '', approvalStatus: 'pending', assets: [] }, ...prev]);
  };

  const handleUploadAsset = () => toast.success('تم فتح نافذة رفع الأصول');

  const getContentViewFields = (item: any): DetailField[] => [
    { label: 'العنوان', value: item.title }, { label: 'المحتوى', value: item.content },
    { label: 'النوع', value: item.type }, { label: 'الحملة', value: item.campaign },
    { label: 'الحالة', value: item.status }, { label: 'المنصات', value: item.platform?.join(', ') || 'غير محدد' },
    { label: 'التاريخ', value: new Date(item.scheduledDate).toLocaleDateString('ar-SA') },
  ];

  const getAssetViewFields = (asset: any): DetailField[] => [
    { label: 'الاسم', value: asset.name }, { label: 'النوع', value: asset.type === 'image' ? 'صورة' : 'فيديو' },
    { label: 'الحجم', value: formatFileSize(asset.fileSize) }, { label: 'المنشئ', value: asset.createdBy },
    { label: 'الحالة', value: asset.status }, { label: 'متوافق مع العلامة', value: asset.brandCompliant ? 'نعم' : 'لا' },
    { label: 'الوسوم', value: asset.tags.join(', ') },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <UnifiedButton onClick={() => setActiveView('calendar')} variant={activeView === 'calendar' ? 'primary' : 'outline'}><Calendar className="w-4 h-4" /> تقويم المحتوى</UnifiedButton>
          <UnifiedButton onClick={() => setActiveView('assets')} variant={activeView === 'assets' ? 'primary' : 'outline'}><Image className="w-4 h-4" /> الأصول التسويقية</UnifiedButton>
          <UnifiedButton onClick={() => setActiveView('dam')} variant={activeView === 'dam' ? 'primary' : 'outline'}><FileText className="w-4 h-4" /> نظام DAM</UnifiedButton>
        </div>
        <div className="flex gap-2">
          <UnifiedButton variant="primary" onClick={() => setIsAddContentOpen(true)}><Plus className="w-4 h-4" /> إضافة محتوى</UnifiedButton>
          <UnifiedButton variant="outline" onClick={handleUploadAsset}><Upload className="w-4 h-4" /> رفع أصول</UnifiedButton>
        </div>
      </div>

      {activeView === 'calendar' && (
        <div className="space-y-4">
          <BaseBox variant="operations">
            <div className="mb-6"><h3 className="text-xl font-semibold text-black font-arabic mb-2">تقويم المحتوى التفاعلي</h3><p className="text-black font-arabic">إدارة وجدولة المحتوى عبر جميع المنصات</p></div>
            <div className="space-y-4">
              {contentCalendar.map((content) => (
                <div key={content.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 font-arabic mb-1">{content.title}</h4>
                      <p className="text-sm text-gray-600 font-arabic mb-2">{content.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500"><span className="font-arabic">📅 {new Date(content.scheduledDate).toLocaleDateString('ar-SA')}</span><span className="font-arabic">🎯 {content.campaign}</span></div>
                    </div>
                    <div className="flex gap-2 items-start">{getStatusBadge(content.status)}{getStatusBadge(content.approvalStatus)}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">{content.platform.map((p, i) => <UnifiedBadge key={i} variant="default" size="sm">{p}</UnifiedBadge>)}</div>
                    <div className="flex gap-2">
                      <UnifiedButton size="sm" variant="outline" onClick={() => setViewingItem(content)}><Eye className="w-4 h-4 ml-1" /> معاينة</UnifiedButton>
                      <UnifiedButton size="sm" variant="outline" onClick={() => toast.info(`تعديل: ${content.title}`)}><Settings className="w-4 h-4 ml-1" /> تعديل</UnifiedButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </BaseBox>
        </div>
      )}

      {activeView === 'assets' && (
        <div className="space-y-4">
          <BaseBox variant="operations">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 relative"><Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /><Input placeholder="البحث في الأصول..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pr-10 font-arabic" /></div>
              <UnifiedButton variant="outline" onClick={() => toast.info('تم تطبيق الفلتر')}><Filter className="w-4 h-4 ml-2" /> فلترة</UnifiedButton>
            </div>
          </BaseBox>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketingAssets.filter(a => !searchTerm || a.name.includes(searchTerm) || a.tags.some(t => t.includes(searchTerm))).map((asset) => (
              <BaseBox key={asset.id} variant="operations" className="transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">{asset.type === 'image' ? <Image className="w-12 h-12 text-blue-600" /> : <FileText className="w-12 h-12 text-purple-600" />}</div>
                  <div><h4 className="font-semibold text-gray-900 font-arabic mb-2">{asset.name}</h4><div className="space-y-2 text-sm text-gray-600"><div className="flex justify-between"><span className="font-arabic">النوع:</span><span>{asset.type === 'image' ? 'صورة' : 'فيديو'}</span></div><div className="flex justify-between"><span className="font-arabic">الحجم:</span><span>{formatFileSize(asset.fileSize)}</span></div><div className="flex justify-between"><span className="font-arabic">المنشئ:</span><span className="font-arabic">{asset.createdBy}</span></div></div></div>
                  <div className="flex flex-wrap gap-1">{asset.tags.map((tag, i) => <UnifiedBadge key={i} variant="default" size="sm">{tag}</UnifiedBadge>)}</div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex gap-2">{getStatusBadge(asset.status)}{asset.brandCompliant && <UnifiedBadge variant="success" size="sm">متوافق</UnifiedBadge>}</div>
                    <div className="flex gap-1">
                      <UnifiedButton size="sm" variant="outline" onClick={() => setViewingItem(asset)}><Eye className="w-3 h-3" /></UnifiedButton>
                      <UnifiedButton size="sm" variant="outline" onClick={() => toast.success(`تم تحميل: ${asset.name}`)}><Download className="w-3 h-3" /></UnifiedButton>
                      <UnifiedButton size="sm" variant="outline" onClick={() => toast.info(`إعدادات: ${asset.name}`)}><Settings className="w-3 h-3" /></UnifiedButton>
                    </div>
                  </div>
                </div>
              </BaseBox>
            ))}
          </div>
        </div>
      )}

      {activeView === 'dam' && (
        <BaseBox variant="operations">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 font-arabic mb-2">نظام إدارة الأصول الرقمية (DAM)</h3>
            <p className="text-gray-600 font-arabic mb-6">نظام متكامل لإدارة وتنظيم جميع الأصول الرقمية</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:shadow-md transition-shadow" onClick={handleUploadAsset}><div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3"><Upload className="w-6 h-6 text-blue-600" /></div><h4 className="font-semibold font-arabic mb-2">رفع الأصول</h4><p className="text-sm text-gray-600 font-arabic">رفع وتصنيف الأصول تلقائياً</p></div>
              <div className="text-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast.info('إعدادات الصلاحيات')}><div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3"><Settings className="w-6 h-6 text-green-600" /></div><h4 className="font-semibold font-arabic mb-2">إدارة الصلاحيات</h4><p className="text-sm text-gray-600 font-arabic">تحكم دقيق في صلاحيات الوصول</p></div>
              <div className="text-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast.info('مراجعة الجودة')}><div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3"><Eye className="w-6 h-6 text-purple-600" /></div><h4 className="font-semibold font-arabic mb-2">مراجعة الجودة</h4><p className="text-sm text-gray-600 font-arabic">مراجعة وضمان جودة المحتوى</p></div>
            </div>
          </div>
        </BaseBox>
      )}

      <GenericFormModal isOpen={isAddContentOpen} onClose={() => setIsAddContentOpen(false)} title="إضافة محتوى جديد" fields={contentFields} onSubmit={handleAddContent} submitLabel="إضافة" successMessage="تم إضافة المحتوى بنجاح" />
      {viewingItem && <GenericDetailModal isOpen={!!viewingItem} onClose={() => setViewingItem(null)} title={viewingItem.title || viewingItem.name} fields={viewingItem.scheduledDate ? getContentViewFields(viewingItem) : getAssetViewFields(viewingItem)} />}
    </div>
  );
};
