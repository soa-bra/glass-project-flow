import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { TrendingUp, DollarSign, Users, BarChart3, Target, Zap } from 'lucide-react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { UnifiedButton } from '@/components/ui/UnifiedButton';
import { UnifiedBadge } from '@/components/ui/UnifiedBadge';
export const OverviewTab: React.FC = () => {
  const kpiStats = [{
    title: 'العائد على الإنفاق',
    value: '4.2x',
    unit: 'ROAS',
    description: 'عائد الاستثمار الإعلاني'
  }, {
    title: 'تكلفة اكتساب العميل',
    value: '245',
    unit: 'ريال',
    description: 'متوسط تكلفة العميل الجديد'
  }, {
    title: 'معدل التحويل',
    value: '2.8%',
    unit: 'تحويل',
    description: 'نسبة تحويل الزوار'
  }];
  const kpis = [{
    title: 'العائد على الإنفاق الإعلاني',
    value: '4.2x',
    change: '+12%',
    changeType: 'positive' as const,
    icon: TrendingUp,
    description: 'ROAS'
  }, {
    title: 'تكلفة اكتساب العميل',
    value: '245 ر.س',
    change: '-8%',
    changeType: 'positive' as const,
    icon: DollarSign,
    description: 'CPA'
  }, {
    title: 'معدل النقر إلى الظهور',
    value: '3.4%',
    change: '+5%',
    changeType: 'positive' as const,
    icon: Target,
    description: 'CTR'
  }, {
    title: 'الجمهور النشط',
    value: '45,678',
    change: '+22%',
    changeType: 'positive' as const,
    icon: Users,
    description: 'Active Audience'
  }, {
    title: 'معدل التحويل',
    value: '2.8%',
    change: '+15%',
    changeType: 'positive' as const,
    icon: BarChart3,
    description: 'Conversion Rate'
  }, {
    title: 'الحملات النشطة',
    value: '12',
    change: '+3',
    changeType: 'positive' as const,
    icon: Zap,
    description: 'Active Campaigns'
  }];
  const activeCampaigns = [{
    name: 'حملة العودة للمدارس 2024',
    type: 'إعلانات مدفوعة',
    budget: 50000,
    spent: 32500,
    performance: '+18% ROAS',
    status: 'نشطة',
    daysLeft: 12
  }, {
    name: 'حملة التسويق بالبريد الإلكتروني - Q4',
    type: 'بريد إلكتروني',
    budget: 15000,
    spent: 8200,
    performance: '+25% Open Rate',
    status: 'نشطة',
    daysLeft: 45
  }, {
    name: 'فعالية المؤتمر السنوي',
    type: 'فعاليات',
    budget: 120000,
    spent: 75000,
    performance: '850 مشارك',
    status: 'قيد التنفيذ',
    daysLeft: 5
  }];
  const channelPerformance = [{
    channel: 'فيسبوك',
    impressions: 125000,
    clicks: 4250,
    conversions: 119,
    spend: 8500
  }, {
    channel: 'إنستقرام',
    impressions: 89000,
    clicks: 3100,
    conversions: 87,
    spend: 6200
  }, {
    channel: 'لينكد إن',
    impressions: 45000,
    clicks: 2200,
    conversions: 156,
    spend: 12500
  }, {
    channel: 'جوجل أدز',
    impressions: 67000,
    clicks: 2890,
    conversions: 98,
    spend: 9800
  }];
  return <div className="mb-6 my-[25px]">
      {/* مؤشرات الأداء الأساسية */}
      <div className="mb-6 py-0 px-0 my-0">
        <KPIStatsSection stats={kpiStats} />
      </div>

      {/* KPIs Grid */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpis.map((kpi, index) => <BaseCard key={index} variant="operations" className="transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-[#bdeed3]">
                      <kpi.icon className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="text-sm text-black font-arabic">{kpi.description}</p>
                      <h3 className="text-lg font-semibold text-black font-arabic">{kpi.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-black">{kpi.value}</span>
                    <UnifiedBadge variant={kpi.changeType === 'positive' ? 'success' : 'error'}>
                      {kpi.change}
                    </UnifiedBadge>
                  </div>
                </div>
              </div>
            </BaseCard>)}
        </div>
      </div>

      {/* Active Campaigns */}
      <div className="mb-6">
        <BaseCard variant="operations">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-black font-arabic mb-2">الحملات النشطة</h3>
            <p className="text-black font-arabic">نظرة عامة على الحملات التسويقية الجارية</p>
          </div>
          
          <div className="space-y-4">
            {activeCampaigns.map((campaign, index) => <div key={index} className="bg-transparent border border-gray-200/50 p-4 rounded-3xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-black font-arabic">{campaign.name}</h4>
                    <p className="text-sm text-black font-arabic">{campaign.type}</p>
                  </div>
                  <div className="text-left">
                    <UnifiedBadge variant={campaign.status === 'نشطة' ? 'success' : 'info'}>
                      {campaign.status}
                    </UnifiedBadge>
                    <p className="text-xs text-black/70 mt-1">{campaign.daysLeft} يوم متبقي</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-5">
                  <div className="mx-0 px-0">
                    <p className="text-sm text-black font-arabic">الميزانية</p>
                    <p className="font-semibold text-black">{campaign.budget.toLocaleString()} ر.س</p>
                  </div>
                  <div className="mx-[50px] px-[3px]">
                    <p className="text-sm text-black font-arabic">المصروف</p>
                    <p className="font-semibold text-black">{campaign.spent.toLocaleString()} ر.س</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-black h-2 rounded-full" style={{
                    width: `${campaign.spent / campaign.budget * 100}%`
                  }}></div>
                    </div>
                  </div>
                  <div className="mx-[50px]">
                    <p className="text-sm text-black font-arabic">الأداء</p>
                    <p className="font-semibold text-black">{campaign.performance}</p>
                  </div>
                </div>
              </div>)}
          </div>
        </BaseCard>
      </div>

      {/* Channel Performance */}
      <div className="mb-6">
        <BaseCard variant="operations">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-black font-arabic mb-2">أداء القنوات</h3>
            <p className="text-black font-arabic">مقارنة أداء القنوات التسويقية المختلفة</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="px-4 py-3 text-sm font-semibold text-white font-arabic bg-black rounded-r-full">
                <tr className="px-4 py-3 text-sm font-semibold text-white font-arabic bg-black">
                  <th className="px-4 py-3 text-sm font-semibold text-white font-arabic bg-black rounded-r-3xl">القناة</th>
                  <th className="px-4 py-3 text-sm font-semibold text-white font-arabic bg-black">الظهور</th>
                  <th className="px-4 py-3 text-sm font-semibold text-white font-arabic bg-black">النقرات</th>
                  <th className="px-4 py-3 text-sm font-semibold text-white font-arabic bg-black rounded-none">التحويلات</th>
                  <th className="px-4 py-3 text-sm font-semibold text-white font-arabic">الإنفاق</th>
                  <th className="px-4 py-3 text-sm font-semibold text-white font-arabic rounded-l-3xl">CTR</th>
                </tr>
              </thead>
              <tbody>
                {channelPerformance.map((channel, index) => <tr key={index} className="border-t border-gray-200">
                    <td className="px-4 py-3 font-semibold text-black font-arabic">{channel.channel}</td>
                    <td className="px-4 py-3 text-black">{channel.impressions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-black">{channel.clicks.toLocaleString()}</td>
                    <td className="px-4 py-3 text-black">{channel.conversions}</td>
                    <td className="px-4 py-3 text-black">{channel.spend.toLocaleString()} ر.س</td>
                    <td className="px-4 py-3 text-black">
                      {(channel.clicks / channel.impressions * 100).toFixed(2)}%
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </BaseCard>
      </div>

      {/* أدوات التصدير */}
      <div className="flex justify-center mt-6">
        <UnifiedButton variant="primary" size="lg">
          <div className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          تصدير تقرير تسويقي
        </UnifiedButton>
      </div>
    </div>;
};