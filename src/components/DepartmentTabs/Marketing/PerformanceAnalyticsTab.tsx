
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { TrendingUp, BarChart3, Users, Target, DollarSign, MousePointer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const PerformanceAnalyticsTab: React.FC = () => {
  const kpiData = [
    {
      title: 'معدل العائد على الاستثمار الإعلاني (ROAS)',
      value: '4.2x',
      change: '+15%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'تكلفة الاكتساب (CPA)',
      value: '245 ر.س',
      change: '-8%',
      trend: 'down',
      icon: DollarSign,
      color: 'text-blue-600'
    },
    {
      title: 'معدل النقر (CTR)',
      value: '3.8%',
      change: '+12%',
      trend: 'up',
      icon: MousePointer,
      color: 'text-purple-600'
    },
    {
      title: 'معدل التحويل',
      value: '2.4%',
      change: '+5%',
      trend: 'up',
      icon: Target,
      color: 'text-orange-600'
    }
  ];

  const campaignPerformance = [
    { name: 'حملة الصيف الرقمية', impressions: '125K', clicks: '4.2K', conversions: '156', roas: '5.2x' },
    { name: 'إعلانات وسائل التواصل', impressions: '89K', clicks: '3.1K', conversions: '98', roas: '3.8x' },
    { name: 'حملة البريد الإلكتروني', impressions: '45K', clicks: '1.8K', conversions: '67', roas: '4.1x' },
    { name: 'الإعلانات المطبوعة', impressions: '32K', clicks: '890', conversions: '34', roas: '2.9x' }
  ];

  const audienceInsights = [
    { segment: 'الفئة العمرية 25-34', percentage: 35, engagement: 'عالي' },
    { segment: 'الفئة العمرية 35-44', percentage: 28, engagement: 'متوسط' },
    { segment: 'الفئة العمرية 18-24', percentage: 22, engagement: 'عالي' },
    { segment: 'الفئة العمرية 45+', percentage: 15, engagement: 'منخفض' }
  ];

  return (
    <div className="space-y-6 p-6 bg-transparent">
      {/* مؤشرات الأداء الرئيسية */}
      <BaseCard variant="operations" className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800 font-arabic">مؤشرات الأداء الرئيسية</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                <Badge variant={kpi.trend === 'up' ? 'default' : 'secondary'} className="text-xs">
                  {kpi.change}
                </Badge>
              </div>
              <h4 className="text-2xl font-bold text-gray-800 mb-1">{kpi.value}</h4>
              <p className="text-sm text-gray-600 font-arabic">{kpi.title}</p>
            </div>
          ))}
        </div>
      </BaseCard>

      {/* أداء الحملات */}
      <BaseCard variant="operations" className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Target className="h-6 w-6 text-green-600" />
          <h3 className="text-xl font-bold text-gray-800 font-arabic">أداء الحملات</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-arabic">اسم الحملة</th>
                <th className="text-right py-3 px-4 font-arabic">الظهور</th>
                <th className="text-right py-3 px-4 font-arabic">النقرات</th>
                <th className="text-right py-3 px-4 font-arabic">التحويلات</th>
                <th className="text-right py-3 px-4 font-arabic">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {campaignPerformance.map((campaign, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-arabic">{campaign.name}</td>
                  <td className="py-3 px-4">{campaign.impressions}</td>
                  <td className="py-3 px-4">{campaign.clicks}</td>
                  <td className="py-3 px-4">{campaign.conversions}</td>
                  <td className="py-3 px-4 font-bold text-green-600">{campaign.roas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BaseCard>

      {/* رؤى الجمهور */}
      <BaseCard variant="operations" className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users className="h-6 w-6 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-800 font-arabic">رؤى الجمهور</h3>
        </div>
        
        <div className="space-y-4">
          {audienceInsights.map((segment, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-sm font-arabic">{segment.segment}</div>
                <Badge 
                  variant={
                    segment.engagement === 'عالي' ? 'default' :
                    segment.engagement === 'متوسط' ? 'secondary' : 'outline'
                  }
                  className="text-xs"
                >
                  {segment.engagement}
                </Badge>
              </div>
              <div className="text-lg font-bold text-gray-800">{segment.percentage}%</div>
            </div>
          ))}
        </div>
      </BaseCard>
    </div>
  );
};
