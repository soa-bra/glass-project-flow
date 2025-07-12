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

export const MarketingTab: React.FC<MarketingTabProps> = ({ data, loading }) => {
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center text-gray-600 font-arabic">جارٍ التحميل...</div>;
  }

  return (
    <div className="font-arabic px-[15px] py-0">
      {/* مؤشرات الأداء التسويقية */}
      <div className="mb-6 py-0 px-0 my-0">
        <MarketingKPIs kpis={data.kpis} totalROAS={data.totalROAS} />
      </div>
      
      {/* الرسوم البيانية الأساسية */}
      <div className="mb-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <MarketingROAS roasData={data.roasData} />
          <AttributionChart attribution={data.attribution} />
        </div>
      </div>
      
      {/* الحملات النشطة */}
      <div className="py-0">
        <ActiveCampaigns campaigns={data.campaigns} />
      </div>
    </div>
  );
};