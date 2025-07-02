import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشطة';
      case 'paused':
        return 'متوقفة';
      case 'completed':
        return 'مكتملة';
      default:
        return status;
    }
  };

  return (
    <Card className="glass-enhanced rounded-[40px]">
      <CardHeader>
        <CardTitle className="text-right font-arabic">الحملات النشطة</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaigns.map((campaign) => {
            const spentPercentage = (campaign.spent / campaign.budget) * 100;
            const ctr = campaign.impressions > 0 ? (campaign.clicks / campaign.impressions) * 100 : 0;
            const conversionRate = campaign.clicks > 0 ? (campaign.conversions / campaign.clicks) * 100 : 0;

            return (
              <div key={campaign.id} className="bg-white/20 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <h4 className="font-medium text-sm">{campaign.name}</h4>
                    <p className="text-xs text-gray-600">{campaign.channel}</p>
                  </div>
                  <Badge className={getStatusColor(campaign.status)}>
                    {getStatusText(campaign.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-600">الميزانية</p>
                    <p className="font-medium">{campaign.budget.toLocaleString()} ر.س</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">المنصرف</p>
                    <p className="font-medium">{campaign.spent.toLocaleString()} ر.س</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">النقرات</p>
                    <p className="font-medium">{campaign.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">التحويلات</p>
                    <p className="font-medium">{campaign.conversions}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>الإنفاق: {spentPercentage.toFixed(1)}%</span>
                    <span>{campaign.spent.toLocaleString()} / {campaign.budget.toLocaleString()} ر.س</span>
                  </div>
                  <Progress value={spentPercentage} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="text-center">
                    <p className="text-gray-600">معدل النقر (CTR)</p>
                    <p className="font-medium">{ctr.toFixed(2)}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">معدل التحويل</p>
                    <p className="font-medium">{conversionRate.toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};