import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { TrendingUp, DollarSign, Users, BarChart3, Target, Zap } from 'lucide-react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';

export const OverviewTab: React.FC = () => {
  const kpiStats = [
    {
      title: 'العائد على الإنفاق',
      value: '4.2x',
      unit: 'ROAS',
      description: 'عائد الاستثمار الإعلاني'
    },
    {
      title: 'تكلفة اكتساب العميل',
      value: '245',
      unit: 'ريال',
      description: 'متوسط تكلفة العميل الجديد'
    },
    {
      title: 'معدل التحويل',
      value: '2.8%',
      unit: 'تحويل',
      description: 'نسبة تحويل الزوار'
    }
  ];

  const kpis = [
    {
      title: 'العائد على الإنفاق الإعلاني',
      value: '4.2x',
      change: '+12%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      description: 'ROAS'
    },
    {
      title: 'تكلفة اكتساب العميل',
      value: '245 ر.س',
      change: '-8%',
      changeType: 'positive' as const,
      icon: DollarSign,
      description: 'CPA'
    },
    {
      title: 'معدل النقر إلى الظهور',
      value: '3.4%',
      change: '+5%',
      changeType: 'positive' as const,
      icon: Target,
      description: 'CTR'
    },
    {
      title: 'الجمهور النشط',
      value: '45,678',
      change: '+22%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'Active Audience'
    },
    {
      title: 'معدل التحويل',
      value: '2.8%',
      change: '+15%',
      changeType: 'positive' as const,
      icon: BarChart3,
      description: 'Conversion Rate'
    },
    {
      title: 'الحملات النشطة',
      value: '12',
      change: '+3',
      changeType: 'positive' as const,
      icon: Zap,
      description: 'Active Campaigns'
    }
  ];

  const activeCampaigns = [
    {
      name: 'حملة العودة للمدارس 2024',
      type: 'إعلانات مدفوعة',
      budget: 50000,
      spent: 32500,
      performance: '+18% ROAS',
      status: 'نشطة',
      daysLeft: 12
    },
    {
      name: 'حملة التسويق بالبريد الإلكتروني - Q4',
      type: 'بريد إلكتروني',
      budget: 15000,
      spent: 8200,
      performance: '+25% Open Rate',
      status: 'نشطة',
      daysLeft: 45
    },
    {
      name: 'فعالية المؤتمر السنوي',
      type: 'فعاليات',
      budget: 120000,
      spent: 75000,
      performance: '850 مشارك',
      status: 'قيد التنفيذ',
      daysLeft: 5
    }
  ];

  const channelPerformance = [
    { channel: 'فيسبوك', impressions: 125000, clicks: 4250, conversions: 119, spend: 8500 },
    { channel: 'إنستقرام', impressions: 89000, clicks: 3100, conversions: 87, spend: 6200 },
    { channel: 'لينكد إن', impressions: 45000, clicks: 2200, conversions: 156, spend: 12500 },
    { channel: 'جوجل أدز', impressions: 67000, clicks: 2890, conversions: 98, spend: 9800 }
  ];

  return (
    <div className="space-y-6">
      {/* مؤشرات الأداء الأساسية */}
      <KPIStatsSection stats={kpiStats} />

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi, index) => (
          <GenericCard key={index} className="hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <kpi.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-arabic">{kpi.description}</p>
                    <h3 className="text-lg font-semibold text-gray-900 font-arabic">{kpi.title}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">{kpi.value}</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    kpi.changeType === 'positive' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {kpi.change}
                  </span>
                </div>
              </div>
            </div>
          </GenericCard>
        ))}
      </div>

      {/* Active Campaigns */}
      <GenericCard>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 font-arabic mb-2">الحملات النشطة</h3>
          <p className="text-gray-600 font-arabic">نظرة عامة على الحملات التسويقية الجارية</p>
        </div>
        
        <div className="space-y-4">
          {activeCampaigns.map((campaign, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 font-arabic">{campaign.name}</h4>
                  <p className="text-sm text-gray-600 font-arabic">{campaign.type}</p>
                </div>
                <div className="text-left">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    campaign.status === 'نشطة' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {campaign.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{campaign.daysLeft} يوم متبقي</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 font-arabic">الميزانية</p>
                  <p className="font-semibold">{campaign.budget.toLocaleString()} ر.س</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-arabic">المصروف</p>
                  <p className="font-semibold">{campaign.spent.toLocaleString()} ر.س</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-arabic">الأداء</p>
                  <p className="font-semibold text-green-600">{campaign.performance}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GenericCard>

      {/* Channel Performance */}
      <GenericCard>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 font-arabic mb-2">أداء القنوات</h3>
          <p className="text-gray-600 font-arabic">مقارنة أداء القنوات التسويقية المختلفة</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-sm font-semibold text-gray-900 font-arabic">القناة</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-900 font-arabic">الظهور</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-900 font-arabic">النقرات</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-900 font-arabic">التحويلات</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-900 font-arabic">الإنفاق</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-900 font-arabic">CTR</th>
              </tr>
            </thead>
            <tbody>
              {channelPerformance.map((channel, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-3 font-semibold text-gray-900 font-arabic">{channel.channel}</td>
                  <td className="px-4 py-3 text-gray-700">{channel.impressions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-700">{channel.clicks.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-700">{channel.conversions}</td>
                  <td className="px-4 py-3 text-gray-700">{channel.spend.toLocaleString()} ر.س</td>
                  <td className="px-4 py-3 text-gray-700">
                    {((channel.clicks / channel.impressions) * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GenericCard>
    </div>
  );
};
