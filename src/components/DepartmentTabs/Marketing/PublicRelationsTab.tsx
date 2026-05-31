
import React, { useState } from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { Megaphone, Users, FileText, Award, TrendingUp } from 'lucide-react';
import { BaseBadge as UnifiedBadge } from '@/components/ui/BaseBadge';
import { BaseActionButton as UnifiedButton } from '@/components/shared/BaseActionButton';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { GenericDetailModal, DetailField } from '../shared/GenericDetailModal';


export const PublicRelationsTab: React.FC = () => {
  const [prCampaigns, setPrCampaigns] = useState([
    { title: 'حملة الاستدامة البيئية', status: 'active', startDate: '2024-01-15', endDate: '2024-03-15', reach: '250K', engagement: 'عالي', mediaOutlets: 12 },
    { title: 'مؤتمر الابتكار التقني', status: 'planning', startDate: '2024-02-01', endDate: '2024-02-03', reach: '180K', engagement: 'متوسط', mediaOutlets: 8 },
    { title: 'برنامج المسؤولية المجتمعية', status: 'completed', startDate: '2023-11-01', endDate: '2023-12-31', reach: '320K', engagement: 'عالي', mediaOutlets: 15 },
  ]);

  const [mediaContacts, setMediaContacts] = useState([
    { name: 'أحمد السالم', outlet: 'صحيفة الوطن', type: 'صحافة مطبوعة', relationship: 'قوي', lastContact: '2024-01-10' },
    { name: 'فاطمة العلي', outlet: 'قناة الأخبار', type: 'تلفزيون', relationship: 'متوسط', lastContact: '2024-01-05' },
    { name: 'محمد الحربي', outlet: 'راديو الرياض', type: 'راديو', relationship: 'جديد', lastContact: '2023-12-28' },
  ]);

  const [pressReleases, setPressReleases] = useState([
    { title: 'إطلاق منتج جديد لعام 2024', date: '2024-01-12', status: 'published', distribution: 25, views: '12.5K' },
    { title: 'شراكة استراتيجية مع شركة التقنية', date: '2024-01-08', status: 'draft', distribution: 0, views: '0' },
    { title: 'نتائج الربع الأخير من 2023', date: '2023-12-30', status: 'published', distribution: 32, views: '18.7K' },
  ]);

  const [isAddCampaignOpen, setIsAddCampaignOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isAddReleaseOpen, setIsAddReleaseOpen] = useState(false);
  const [viewingRelease, setViewingRelease] = useState<any>(null);

  const campaignFields: FormField[] = [
    { name: 'title', label: 'اسم الحملة', type: 'text', required: true, placeholder: 'أدخل اسم الحملة' },
    { name: 'startDate', label: 'تاريخ البداية', type: 'date', required: true },
    { name: 'endDate', label: 'تاريخ النهاية', type: 'date', required: true },
  ];
  const contactFields: FormField[] = [
    { name: 'name', label: 'الاسم', type: 'text', required: true, placeholder: 'اسم جهة الاتصال' },
    { name: 'outlet', label: 'المنفذ الإعلامي', type: 'text', required: true, placeholder: 'اسم المنفذ' },
    { name: 'type', label: 'النوع', type: 'select', required: true, options: [{ value: 'صحافة مطبوعة', label: 'صحافة مطبوعة' }, { value: 'تلفزيون', label: 'تلفزيون' }, { value: 'راديو', label: 'راديو' }, { value: 'رقمي', label: 'رقمي' }] },
  ];
  const releaseFields: FormField[] = [
    { name: 'title', label: 'عنوان البيان', type: 'text', required: true, placeholder: 'أدخل عنوان البيان الصحفي' },
  ];

  const handleAddCampaign = (data: Record<string, string>) => {
    setPrCampaigns(prev => [{ title: data.title, status: 'planning', startDate: data.startDate, endDate: data.endDate, reach: '0', engagement: 'جديد', mediaOutlets: 0 }, ...prev]);
  };
  const handleAddContact = (data: Record<string, string>) => {
    setMediaContacts(prev => [{ name: data.name, outlet: data.outlet, type: data.type, relationship: 'جديد', lastContact: new Date().toISOString().split('T')[0] }, ...prev]);
  };
  const handleAddRelease = (data: Record<string, string>) => {
    setPressReleases(prev => [{ title: data.title, date: new Date().toISOString().split('T')[0], status: 'draft', distribution: 0, views: '0' }, ...prev]);
  };

  const getReleaseViewFields = (release: any): DetailField[] => [
    { label: 'العنوان', value: release.title },
    { label: 'التاريخ', value: release.date },
    { label: 'الحالة', value: release.status === 'published' ? 'منشور' : 'مسودة' },
    { label: 'التوزيع', value: `${release.distribution} منفذ` },
    { label: 'المشاهدات', value: release.views },
  ];

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: string }> = {
      active: { label: 'نشط', variant: 'success' }, planning: { label: 'تخطيط', variant: 'warning' }, completed: { label: 'مكتمل', variant: 'default' }, published: { label: 'منشور', variant: 'success' }, draft: { label: 'مسودة', variant: 'default' },
    };
    const info = map[status] || map.draft;
    return <UnifiedBadge variant={info.variant as any} size="sm">{info.label}</UnifiedBadge>;
  };

  return (
    <div className="space-y-6 p-6 bg-transparent">
      <BaseBox variant="operations" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2"><Megaphone className="h-6 w-6 text-black" /><h3 className="text-xl font-bold text-black font-arabic">حملات العلاقات العامة</h3></div>
          <UnifiedButton variant="outline" size="sm" onClick={() => setIsAddCampaignOpen(true)}>إضافة حملة جديدة</UnifiedButton>
        </div>
        <div className="space-y-4">
          {prCampaigns.map((campaign, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3"><h4 className="font-medium font-arabic">{campaign.title}</h4>{getStatusBadge(campaign.status)}</div>
                <div className="text-sm text-gray-600">{campaign.startDate} - {campaign.endDate}</div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><span className="text-gray-600 font-arabic">الوصول: </span><span className="font-bold">{campaign.reach}</span></div>
                <div><span className="text-gray-600 font-arabic">التفاعل: </span><span className={`font-bold ${campaign.engagement === 'عالي' ? 'text-green-600' : campaign.engagement === 'متوسط' ? 'text-yellow-600' : 'text-red-600'}`}>{campaign.engagement}</span></div>
                <div><span className="text-gray-600 font-arabic">المنافذ الإعلامية: </span><span className="font-bold">{campaign.mediaOutlets}</span></div>
              </div>
            </div>
          ))}
        </div>
      </BaseBox>

      <BaseBox variant="operations" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2"><Users className="h-6 w-6 text-black" /><h3 className="text-xl font-bold text-black font-arabic">جهات الاتصال الإعلامية</h3></div>
          <UnifiedButton variant="outline" size="sm" onClick={() => setIsAddContactOpen(true)}>إضافة جهة اتصال</UnifiedButton>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-gray-200">
              <th className="text-right py-3 px-4 font-arabic">الاسم</th><th className="text-right py-3 px-4 font-arabic">المنفذ الإعلامي</th><th className="text-right py-3 px-4 font-arabic">النوع</th><th className="text-right py-3 px-4 font-arabic">العلاقة</th><th className="text-right py-3 px-4 font-arabic">آخر اتصال</th>
            </tr></thead>
            <tbody>
              {mediaContacts.map((contact, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-arabic">{contact.name}</td><td className="py-3 px-4 font-arabic">{contact.outlet}</td><td className="py-3 px-4 font-arabic">{contact.type}</td>
                  <td className="py-3 px-4"><UnifiedBadge variant={contact.relationship === 'قوي' ? 'success' : contact.relationship === 'متوسط' ? 'warning' : 'default'} size="sm">{contact.relationship}</UnifiedBadge></td>
                  <td className="py-3 px-4">{contact.lastContact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BaseBox>

      <BaseBox variant="operations" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2"><FileText className="h-6 w-6 text-black" /><h3 className="text-xl font-bold text-black font-arabic">البيانات الصحفية</h3></div>
          <UnifiedButton variant="outline" size="sm" onClick={() => setIsAddReleaseOpen(true)}>إنشاء بيان صحفي</UnifiedButton>
        </div>
        <div className="space-y-3">
          {pressReleases.map((release, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-gray-600" />
                <div>
                  <h4 className="font-medium font-arabic text-sm">{release.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1"><span>{release.date}</span><span>{release.distribution} توزيع</span><span>{release.views} مشاهدة</span></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(release.status)}
                <UnifiedButton size="sm" variant="outline" onClick={() => setViewingRelease(release)}>عرض</UnifiedButton>
              </div>
            </div>
          ))}
        </div>
      </BaseBox>

      <AppDashboardGrid columns={12}>
        {[
          { icon: Award, value: prCampaigns.filter(c => c.status === 'active').length, label: 'حملة نشطة' },
          { icon: Users, value: mediaContacts.length, label: 'جهة اتصال إعلامية' },
          { icon: FileText, value: pressReleases.length, label: 'بيان صحفي' },
          { icon: TrendingUp, value: '85%', label: 'معدل التفاعل' },
        ].map((stat, i) => (
          <AppGridItem key={i} colSpan={3}>
            <BaseBox variant="operations" size="sm" className="text-center">
              <stat.icon className="h-8 w-8 text-black mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-black mb-1 font-arabic">{stat.value}</h3>
              <p className="text-sm text-black font-arabic">{stat.label}</p>
            </BaseBox>
          </AppGridItem>
        ))}
      </AppDashboardGrid>

      <GenericFormModal isOpen={isAddCampaignOpen} onClose={() => setIsAddCampaignOpen(false)} title="إضافة حملة علاقات عامة" fields={campaignFields} onSubmit={handleAddCampaign} submitLabel="إضافة" successMessage="تمت إضافة الحملة بنجاح" />
      <GenericFormModal isOpen={isAddContactOpen} onClose={() => setIsAddContactOpen(false)} title="إضافة جهة اتصال إعلامية" fields={contactFields} onSubmit={handleAddContact} submitLabel="إضافة" successMessage="تمت إضافة جهة الاتصال بنجاح" />
      <GenericFormModal isOpen={isAddReleaseOpen} onClose={() => setIsAddReleaseOpen(false)} title="إنشاء بيان صحفي" fields={releaseFields} onSubmit={handleAddRelease} submitLabel="إنشاء" successMessage="تم إنشاء البيان الصحفي بنجاح" />
      {viewingRelease && <GenericDetailModal isOpen={!!viewingRelease} onClose={() => setViewingRelease(null)} title={viewingRelease.title} fields={getReleaseViewFields(viewingRelease)} />}
    </div>
  );
};
