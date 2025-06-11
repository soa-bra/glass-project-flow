
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';

interface SatisfactionWidgetProps {
  satisfaction: number;
}

export const SatisfactionWidget: React.FC<SatisfactionWidgetProps> = ({ satisfaction }) => {
  return (
    <GenericCard>
      <h3 className="text-lg font-arabic font-medium mb-4 text-right">مؤشر رضا العملاء</h3>
      
      <div className="flex flex-col items-center justify-center mt-2">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#eee"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={satisfaction > 80 ? "#4ADE80" : satisfaction > 60 ? "#FACC15" : "#F87171"}
              strokeWidth="3"
              strokeDasharray={`${satisfaction}, 100`}
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className="text-3xl font-bold">{satisfaction}%</span>
          </div>
        </div>
        <div className="text-center mt-2">
          <p className="text-sm text-gray-600">
            {satisfaction > 80 
              ? "ممتاز"
              : satisfaction > 60 
              ? "جيد"
              : "بحاجة لتحسين"
            }
          </p>
        </div>
      </div>
    </GenericCard>
  );
};
