import React from 'react';
import { TrendingUp, Target, BarChart3 } from 'lucide-react';

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
  const hasHighROAS = marketing.roas >= 3;

  return (
    <div className={`
      ${className}
      rounded-3xl p-5
      bg-white/80 backdrop-blur-xl border border-white/30
      shadow-lg hover:shadow-xl transition-all duration-300
      ${hasHighROAS ? 'border-green-200/50' : 'border-orange-200/50'}
      flex flex-col justify-between
    `}>
      
      <h3 className="text-lg font-arabic font-bold text-gray-800 mb-4">
        التسويق
      </h3>

      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-sm text-gray-600">عائد الاستثمار</span>
          </div>
          <span className="text-xl font-bold text-green-500">{marketing.roas.toFixed(1)}x</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Target size={16} className="text-blue-500" />
            <span className="text-sm text-gray-600">الحملات النشطة</span>
          </div>
          <span className="text-xl font-bold text-blue-500">{marketing.activeCampaigns}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BarChart3 size={16} className="text-purple-500" />
            <span className="text-sm text-gray-600">معدل التحويل</span>
          </div>
          <span className="text-xl font-bold text-purple-500">{marketing.conversion}%</span>
        </div>
      </div>
    </div>
  );
};