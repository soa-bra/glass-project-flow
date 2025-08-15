import React from 'react';
import { MarketingROAS } from './Marketing/MarketingROAS';
import { ActiveCampaigns } from './Marketing/ActiveCampaigns';
import { AttributionChart } from './Marketing/AttributionChart';
import { MarketingKPIs } from './Marketing/MarketingKPIs';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { BaseOperationsTabLayout } from './BaseOperationsTabLayout';
import { Download } from 'lucide-react';
interface ROASData {
  channel: string;
  investment: number;
  revenue: number;
  roas: number;
  trend: 'up' | 'down' | 'stable';
}
interface Campaign {
  id: string;
  name: string;
  channel: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  status: 'active' | 'paused' | 'completed';
  startDate: string;
  endDate: string;
}
interface Attribution {
  touchpoint: string;
  conversions: number;
  revenue: number;
  percentage: number;
}
interface MarketingKPI {
  id: string;
  title: string;
  value: number;
  target: number;
  format: 'currency' | 'percentage' | 'number';
  trend: 'up' | 'down' | 'stable';
}
export interface MarketingData {
  roasData: ROASData[];
  campaigns: Campaign[];
  attribution: Attribution[];
  kpis: MarketingKPI[];
  totalROAS: number;
  totalSpent: number;
  totalRevenue: number;
}
interface MarketingTabProps {
  data?: MarketingData;
  loading: boolean;
}
export const MarketingTab: React.FC<MarketingTabProps> = ({
  data,
  loading
}) => {
  // تحويل البيانات إلى تنسيق KPI
  const kpiStats = data ? [{
    title: 'عائد الاستثمار الإجمالي',
    value: data.totalROAS.toFixed(1),
    unit: 'x',
    description: 'نسبة العائد على الاستثمار'
  }, {
    title: 'إجمالي الإنفاق',
    value: (data.totalSpent / 1000).toFixed(0),
    unit: 'ألف ر.س',
    description: 'الاستثمار التسويقي الكلي'
  }, {
    title: 'إجمالي الإيرادات',
    value: (data.totalRevenue / 1000).toFixed(0),
    unit: 'ألف ر.س',
    description: 'العائد من الحملات التسويقية'
  }, {
    title: 'الحملات النشطة',
    value: String(data.campaigns.filter(c => c.status === 'active').length),
    unit: 'حملة',
    description: 'حملات قيد التشغيل'
  }] : [];

  return (
    <BaseOperationsTabLayout
      value="marketing"
      kpiStats={kpiStats}
      loading={loading}
      error={!data && !loading ? "لا توجد بيانات تسويقية متاحة" : undefined}
    >
      {data && (
        <div className="space-y-6">
          {/* الرسوم البيانية الأساسية */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <MarketingROAS roasData={data.roasData} />
            <AttributionChart attribution={data.attribution} />
          </div>
          
          {/* الحملات النشطة */}
          <ActiveCampaigns campaigns={data.campaigns} />
          
          {/* أدوات التصدير والتحليل */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="text-sm font-normal text-gray-600">
              تم تحديث البيانات منذ {new Date().toLocaleTimeString('ar-SA')}
            </div>
            <BaseActionButton
              variant="primary"
              icon={<Download className="w-4 h-4" />}
            >
              تصدير التقرير
            </BaseActionButton>
          </div>
        </div>
      )}
    </BaseOperationsTabLayout>
  );
};