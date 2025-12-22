import React from 'react';
import { BaseBox } from '@/components/ui/BaseBox';

export interface MarketingData {
  roas: number;
  activeCampaigns: number;
  conversion: number;
}

export interface MarketingBoxProps {
  marketing: MarketingData;
  className?: string;
}

export const MarketingBox: React.FC<MarketingBoxProps> = ({ 
  marketing, 
  className = '' 
}) => {
  return (
    <BaseBox 
      title="التسويق"
      variant="unified"
      size="sm"
      rounded="xl"
      className={`h-full min-h-0 flex flex-col justify-between ${className}`}
    >
      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[hsl(var(--ink))]">عائد الاستثمار</span>
          <span className="text-xl font-bold text-[hsl(var(--ink))]">{marketing.roas.toFixed(1)}x</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[hsl(var(--ink))]">الحملات النشطة</span>
          <span className="text-xl font-bold text-[hsl(var(--ink))]">{marketing.activeCampaigns}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[hsl(var(--ink))]">معدل التحويل</span>
          <span className="text-xl font-bold text-[hsl(var(--ink))]">{marketing.conversion}%</span>
        </div>
      </div>
    </BaseBox>
  );
};
