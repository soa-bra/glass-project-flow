import React from 'react';

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

interface ActiveCampaignsProps {
  campaigns: Campaign[];
}

export const ActiveCampaigns: React.FC<ActiveCampaignsProps> = ({ campaigns }) => {
  return <div className="text-center text-gray-500 font-arabic">قيد التطوير</div>;
};

interface Attribution {
  touchpoint: string;
  conversions: number;
  revenue: number;
  percentage: number;
}

interface AttributionChartProps {
  attribution: Attribution[];
}

export const AttributionChart: React.FC<AttributionChartProps> = ({ attribution }) => {
  return <div className="text-center text-gray-500 font-arabic">قيد التطوير</div>;
};