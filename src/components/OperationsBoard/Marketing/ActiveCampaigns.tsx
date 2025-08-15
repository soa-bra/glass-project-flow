import React from 'react';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
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
export const ActiveCampaigns: React.FC<ActiveCampaignsProps> = ({
  campaigns
}) => {
  const getStatusBadge = (status: string) => {
    const statusMap = {
      'active': {
        label: 'نشطة',
        variant: 'success'
      },
      'paused': {
        label: 'متوقفة',
        variant: 'warning'
      },
      'completed': {
        label: 'مكتملة',
        variant: 'info'
      }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || {
      label: status,
      variant: 'default'
    };
    return <BaseBadge variant={statusInfo.variant as any}>{statusInfo.label}</BaseBadge>;
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
  return <div className="rounded-[40px] bg-[#ffffff] border-[#DADCE0]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-black font-arabic">الحملات النشطة</h3>
        <BaseActionButton variant="primary">
          عرض الكل
        </BaseActionButton>
      </div>
      
      <div className="space-y-4">
        {campaigns.map(campaign => {
        const spentPercentage = campaign.spent / campaign.budget * 100;
        const ctr = campaign.impressions > 0 ? campaign.clicks / campaign.impressions * 100 : 0;
        const conversionRate = campaign.clicks > 0 ? campaign.conversions / campaign.clicks * 100 : 0;
        return <div key={campaign.id} className="bg-white/80 border border-black/5 p-4 space-y-3 rounded-3xl">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <h4 className="font-medium text-sm text-black font-arabic">{campaign.name}</h4>
                  <p className="text-xs text-black/60 font-arabic">{campaign.channel}</p>
                </div>
                {getStatusBadge(campaign.status)}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-xs text-black/60 font-arabic">الميزانية</p>
                  <p className="font-medium text-black font-arabic">{campaign.budget.toLocaleString()} ر.س</p>
                </div>
                <div>
                  <p className="text-xs text-black/60 font-arabic">المنصرف</p>
                  <p className="font-medium text-black font-arabic">{campaign.spent.toLocaleString()} ر.س</p>
                </div>
                <div>
                  <p className="text-xs text-black/60 font-arabic">النقرات</p>
                  <p className="font-medium text-black font-arabic">{campaign.clicks.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-black/60 font-arabic">التحويلات</p>
                  <p className="font-medium text-black font-arabic">{campaign.conversions}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-arabic">
                  <span className="text-black/60">الإنفاق: {spentPercentage.toFixed(1)}%</span>
                  <span className="text-black">{campaign.spent.toLocaleString()} / {campaign.budget.toLocaleString()} ر.س</span>
                </div>
                <Progress value={spentPercentage} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="text-center">
                  <p className="text-black/60 font-arabic">معدل النقر (CTR)</p>
                  <p className="font-medium text-black font-arabic">{ctr.toFixed(2)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-black/60 font-arabic">معدل التحويل</p>
                  <p className="font-medium text-black font-arabic">{conversionRate.toFixed(2)}%</p>
                </div>
              </div>
            </div>;
      })}
      </div>
    </div>;
};