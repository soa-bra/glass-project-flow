import React from 'react';

interface MarketingData {
  roas: number;
  activeCampaigns: number;
  conversion: number;
}

interface MarketingWidgetProps {
  marketing: MarketingData;
  className?: string;
}

export const MarketingWidget: React.FC<MarketingWidgetProps> = ({ 
  marketing, 
  className = '' 
}) => {
  return (
    <div className={`
      ${className}
      rounded-[40px] p-5
      bg-[#FFFFFF] ring-1 ring-[#DADCE0] shadow-sm
      hover:shadow-md transition-all duration-300
      flex flex-col justify-between
    `}>
      
      <h3 className="text-lg font-arabic font-bold text-black mb-4">
        التسويق
      </h3>

      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm text-black">عائد الاستثمار</span>
          <span className="text-xl font-bold text-black">{marketing.roas.toFixed(1)}x</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-black">الحملات النشطة</span>
          <span className="text-xl font-bold text-black">{marketing.activeCampaigns}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-black">معدل التحويل</span>
          <span className="text-xl font-bold text-black">{marketing.conversion}%</span>
        </div>
      </div>
    </div>
  );
};