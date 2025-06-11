
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';

interface SatisfactionWidgetProps {
  satisfaction: number;
}

export const SatisfactionWidget: React.FC<SatisfactionWidgetProps> = ({ satisfaction }) => {
  return (
    <GenericCard className="h-full">
      <h3 className="text-xl font-arabic font-bold mb-6 text-right text-gray-800">مؤشر رضا العملاء</h3>
      
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-32 h-32 mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            {/* Background circle */}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="3"
            />
            {/* Progress circle */}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeDasharray={`${satisfaction}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{satisfaction}%</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 font-medium">ممتاز</p>
        </div>
      </div>
    </GenericCard>
  );
};
