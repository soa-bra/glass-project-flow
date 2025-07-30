import React from 'react';
import { MarketingROAS } from './Marketing/MarketingROAS';
import { ActiveCampaigns } from './Marketing/ActiveCampaigns';
import { AttributionChart } from './Marketing/AttributionChart';
import { MarketingKPIs } from './Marketing/MarketingKPIs';
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
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center text-gray-600 font-arabic">جارٍ التحميل...</div>;
  }
  return <div className="space-y-4 h-full overflow-auto bg-transparent">
      {/* العنوان و KPI في نفس السطر */}
      <div className="flex justify-between items-start pt-6 px-[35px]">
        <div className="text-right">
          <h2 className="text-lg font-semibold text-black font-arabic mb-1">التسويق</h2>
          <p className="text-xs font-normal text-gray-400 font-arabic">ربط الاستثمار التسويقي بأداء المشاريع</p>
        </div>
        <div className="flex-1 max-w-2xl px-px mx-px">
          <MarketingKPIs kpis={data.kpis} totalROAS={data.totalROAS} />
        </div>
      </div>
      
      {/* الرسوم البيانية الأساسية */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 px-6">
        <MarketingROAS roasData={data.roasData} />
        <AttributionChart attribution={data.attribution} />
      </div>
      
      {/* الحملات النشطة */}
      <div className="px-6">
        <ActiveCampaigns campaigns={data.campaigns} />
      </div>
    </div>;
};