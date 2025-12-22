
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Megaphone, Users, Calendar, FileText, Award, TrendingUp } from 'lucide-react';
import { BaseBadge as UnifiedBadge } from '@/components/ui/BaseBadge';
import { BaseActionButton as UnifiedButton } from '@/components/shared/BaseActionButton';

export const PublicRelationsTab: React.FC = () => {
  const prCampaigns = [
    {
      title: 'حملة الاستدامة البيئية',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      reach: '250K',
      engagement: 'عالي',
      mediaOutlets: 12
    },
    {
      title: 'مؤتمر الابتكار التقني',
      status: 'planning',
      startDate: '2024-02-01',
      endDate: '2024-02-03',
      reach: '180K',
      engagement: 'متوسط',
      mediaOutlets: 8
    },
    {
      title: 'برنامج المسؤولية المجتمعية',
      status: 'completed',
      startDate: '2023-11-01',
      endDate: '2023-12-31',
      reach: '320K',
      engagement: 'عالي',
      mediaOutlets: 15
    }
  ];

  const mediaContacts = [
    {
      name: 'أحمد السالم',
      outlet: 'صحيفة الوطن',
      type: 'صحافة مطبوعة',
      relationship: 'قوي',
      lastContact: '2024-01-10'
    },
    {
      name: 'فاطمة العلي',
      outlet: 'قناة الأخبار',
      type: 'تلفزيون',
      relationship: 'متوسط',
      lastContact: '2024-01-05'
    },
    {
      name: 'محمد الحربي',
      outlet: 'راديو الرياض',
      type: 'راديو',
      relationship: 'جديد',
      lastContact: '2023-12-28'
    }
  ];

  const pressReleases = [
    {
      title: 'إطلاق منتج جديد لعام 2024',
      date: '2024-01-12',
      status: 'published',
      distribution: 25,
      views: '12.5K'
    },
    {
      title: 'شراكة استراتيجية مع شركة التقنية',
      date: '2024-01-08',
      status: 'draft',
      distribution: 0,
      views: '0'
    },
    {
      title: 'نتائج الربع الأخير من 2023',
      date: '2023-12-30',
      status: 'published',
      distribution: 32,
      views: '18.7K'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <UnifiedBadge variant="success" size="sm">نشط</UnifiedBadge>;
      case 'planning':
        return <UnifiedBadge variant="warning" size="sm">تخطيط</UnifiedBadge>;
      case 'completed':
        return <UnifiedBadge variant="default" size="sm">مكتمل</UnifiedBadge>;
      case 'published':
        return <UnifiedBadge variant="success" size="sm">منشور</UnifiedBadge>;
      case 'draft':
        return <UnifiedBadge variant="default" size="sm">مسودة</UnifiedBadge>;
      default:
        return <UnifiedBadge variant="default" size="sm">غير معروف</UnifiedBadge>;
    }
  };

  return (
    <div className="space-y-6 p-6 bg-transparent">
      {/* حملات العلاقات العامة */}
      <BaseCard variant="operations" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-black" />
            <h3 className="text-xl font-bold text-black font-arabic">حملات العلاقات العامة</h3>
          </div>
          <UnifiedButton variant="outline" size="sm">
            إضافة حملة جديدة
          </UnifiedButton>
        </div>
        
        <div className="space-y-4">
          {prCampaigns.map((campaign, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium font-arabic">{campaign.title}</h4>
                  {getStatusBadge(campaign.status)}
                </div>
                <div className="text-sm text-gray-600">
                  {campaign.startDate} - {campaign.endDate}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 font-arabic">الوصول: </span>
                  <span className="font-bold">{campaign.reach}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-arabic">التفاعل: </span>
                  <span className={`font-bold ${
                    campaign.engagement === 'عالي' ? 'text-green-600' :
                    campaign.engagement === 'متوسط' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {campaign.engagement}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 font-arabic">المنافذ الإعلامية: </span>
                  <span className="font-bold">{campaign.mediaOutlets}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </BaseCard>

      {/* جهات الاتصال الإعلامية */}
      <BaseCard variant="operations" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-black" />
            <h3 className="text-xl font-bold text-black font-arabic">جهات الاتصال الإعلامية</h3>
          </div>
          <UnifiedButton variant="outline" size="sm">
            إضافة جهة اتصال
          </UnifiedButton>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-arabic">الاسم</th>
                <th className="text-right py-3 px-4 font-arabic">المنفذ الإعلامي</th>
                <th className="text-right py-3 px-4 font-arabic">النوع</th>
                <th className="text-right py-3 px-4 font-arabic">العلاقة</th>
                <th className="text-right py-3 px-4 font-arabic">آخر اتصال</th>
              </tr>
            </thead>
            <tbody>
              {mediaContacts.map((contact, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-arabic">{contact.name}</td>
                  <td className="py-3 px-4 font-arabic">{contact.outlet}</td>
                  <td className="py-3 px-4 font-arabic">{contact.type}</td>
                  <td className="py-3 px-4">
                    <UnifiedBadge 
                      variant={
                        contact.relationship === 'قوي' ? 'success' :
                        contact.relationship === 'متوسط' ? 'warning' : 'default'
                      }
                      size="sm"
                    >
                      {contact.relationship}
                    </UnifiedBadge>
                  </td>
                  <td className="py-3 px-4">{contact.lastContact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BaseCard>

      {/* البيانات الصحفية */}
      <BaseCard variant="operations" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-black" />
            <h3 className="text-xl font-bold text-black font-arabic">البيانات الصحفية</h3>
          </div>
          <UnifiedButton variant="outline" size="sm">
            إنشاء بيان صحفي
          </UnifiedButton>
        </div>
        
        <div className="space-y-3">
          {pressReleases.map((release, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-gray-600" />
                <div>
                  <h4 className="font-medium font-arabic text-sm">{release.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    <span>{release.date}</span>
                    <span>{release.distribution} توزيع</span>
                    <span>{release.views} مشاهدة</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {getStatusBadge(release.status)}
                <UnifiedButton size="sm" variant="outline">
                  عرض
                </UnifiedButton>
              </div>
            </div>
          ))}
        </div>
      </BaseCard>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <BaseCard variant="operations" size="sm" className="text-center">
          <Award className="h-8 w-8 text-black mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-black mb-1 font-arabic">12</h3>
          <p className="text-sm text-black font-arabic">حملة نشطة</p>
        </BaseCard>

        <BaseCard variant="operations" size="sm" className="text-center">
          <Users className="h-8 w-8 text-black mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-black mb-1 font-arabic">48</h3>
          <p className="text-sm text-black font-arabic">جهة اتصال إعلامية</p>
        </BaseCard>

        <BaseCard variant="operations" size="sm" className="text-center">
          <FileText className="h-8 w-8 text-black mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-black mb-1 font-arabic">24</h3>
          <p className="text-sm text-black font-arabic">بيان صحفي</p>
        </BaseCard>

        <BaseCard variant="operations" size="sm" className="text-center">
          <TrendingUp className="h-8 w-8 text-black mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-black mb-1 font-arabic">85%</h3>
          <p className="text-sm text-black font-arabic">معدل التفاعل</p>
        </BaseCard>
      </div>
    </div>
  );
};
