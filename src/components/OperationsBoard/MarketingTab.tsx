import React from 'react';
import { TrendingUp, Target, DollarSign, Users, BarChart, Eye } from 'lucide-react';

export interface MarketingData {
  roas: Array<{
    channel: string;
    spent: number;
    revenue: number;
    roas: number;
  }>;
  campaigns: Array<{
    id: string;
    name: string;
    status: 'active' | 'paused' | 'completed';
    budget: number;
    spent: number;
    impressions: number;
    clicks: number;
    conversions: number;
  }>;
}

interface MarketingTabProps {
  data: MarketingData;
  loading: boolean;
}

export const MarketingTab: React.FC<MarketingTabProps> = ({ data, loading }) => {
  const mockData: MarketingData = {
    roas: [
      { channel: 'Google Ads', spent: 15000, revenue: 45000, roas: 3.0 },
      { channel: 'Facebook Ads', spent: 12000, revenue: 30000, roas: 2.5 },
      { channel: 'LinkedIn Ads', spent: 8000, revenue: 20000, roas: 2.5 },
      { channel: 'Twitter Ads', spent: 5000, revenue: 10000, roas: 2.0 }
    ],
    campaigns: [
      {
        id: '1',
        name: 'حملة إطلاق المنتج الجديد',
        status: 'active',
        budget: 25000,
        spent: 18500,
        impressions: 150000,
        clicks: 3500,
        conversions: 145
      },
      {
        id: '2',
        name: 'حملة زيادة الوعي بالعلامة التجارية',
        status: 'active',
        budget: 15000,
        spent: 12300,
        impressions: 200000,
        clicks: 2800,
        conversions: 98
      },
      {
        id: '3',
        name: 'حملة الترويج الموسمي',
        status: 'paused',
        budget: 10000,
        spent: 8500,
        impressions: 80000,
        clicks: 1200,
        conversions: 67
      }
    ]
  };

  const currentData = data.roas?.length > 0 ? data : mockData;
  const totalSpent = currentData.roas.reduce((sum, item) => sum + item.spent, 0);
  const totalRevenue = currentData.roas.reduce((sum, item) => sum + item.revenue, 0);
  const overallROAS = totalRevenue / totalSpent;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-[#bdeed3] text-black';
      case 'paused': return 'bg-[#fbe2aa] text-black';
      case 'completed': return 'bg-[#a4e2f6] text-black';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشطة';
      case 'paused': return 'متوقفة';
      case 'completed': return 'مكتملة';
      default: return 'غير محدد';
    }
  };

  return (
    <div className="space-y-6 font-arabic">
      {/* مؤشرات ROAS الإجمالية */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10 text-center">
          <div className="flex items-center justify-center mb-3">
            <TrendingUp className="h-6 w-6 text-black" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-1">{overallROAS.toFixed(1)}x</h3>
          <p className="text-sm text-black">ROAS الإجمالي</p>
        </div>
        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10 text-center">
          <div className="flex items-center justify-center mb-3">
            <DollarSign className="h-6 w-6 text-black" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-1">{totalSpent.toLocaleString()}</h3>
          <p className="text-sm text-black">إجمالي الإنفاق</p>
        </div>
        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10 text-center">
          <div className="flex items-center justify-center mb-3">
            <Target className="h-6 w-6 text-black" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-1">{totalRevenue.toLocaleString()}</h3>
          <p className="text-sm text-black">إجمالي الإيرادات</p>
        </div>
        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10 text-center">
          <div className="flex items-center justify-center mb-3">
            <Users className="h-6 w-6 text-black" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-1">12</h3>
          <p className="text-sm text-black">حملات نشطة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* أداء القنوات التسويقية */}
        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
          <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            أداء القنوات التسويقية
          </h3>
          <div className="space-y-4">
            {currentData.roas.map((channel, index) => (
              <div key={index} className="p-4 bg-white rounded-2xl border border-black/5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-black text-sm">{channel.channel}</h4>
                  <div className="px-3 py-1 bg-[#bdeed3] text-black rounded-full text-xs">
                    ROAS: {channel.roas.toFixed(1)}x
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                  <div>
                    <span className="block text-gray-500">الإنفاق</span>
                    <span className="font-bold text-black">{channel.spent.toLocaleString()} ر.س</span>
                  </div>
                  <div>
                    <span className="block text-gray-500">الإيرادات</span>
                    <span className="font-bold text-black">{channel.revenue.toLocaleString()} ر.س</span>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-black h-2 rounded-full" 
                    style={{ width: `${Math.min((channel.roas / 4) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* الحملات النشطة */}
        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
          <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            الحملات النشطة
          </h3>
          <div className="space-y-4">
            {currentData.campaigns.map((campaign) => (
              <div key={campaign.id} className="p-4 bg-white rounded-2xl border border-black/5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-black text-sm mb-1">{campaign.name}</h4>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(campaign.status)}`}>
                      {getStatusText(campaign.status)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">الميزانية</div>
                    <div className="font-bold text-black text-sm">{campaign.budget.toLocaleString()} ر.س</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-2">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">المشاهدات</div>
                    <div className="font-bold text-black text-sm">{campaign.impressions.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">النقرات</div>
                    <div className="font-bold text-black text-sm">{campaign.clicks.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">التحويلات</div>
                    <div className="font-bold text-black text-sm">{campaign.conversions}</div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-black h-2 rounded-full" 
                    style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>أُنفِق: {campaign.spent.toLocaleString()} ر.س</span>
                  <span>{((campaign.spent / campaign.budget) * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};