
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

interface SatisfactionWidgetProps {
  satisfaction: number;
}

export const SatisfactionWidget: React.FC<SatisfactionWidgetProps> = ({ satisfaction }) => {
  const getRingColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return 'ممتاز';
    if (score >= 60) return 'جيد';
    return 'يحتاج تحسين';
  };

  return (
    <BaseCard 
      size="md"
      neonRing={getRingColor(satisfaction)}
      header={
        <h3 className="text-sm font-arabic font-bold text-gray-800">
          مؤشر رضا العملاء
        </h3>
      }
    >
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-16 h-16 mb-1">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={satisfaction >= 80 ? "#10b981" : satisfaction >= 60 ? "#f59e0b" : "#ef4444"}
              strokeWidth="3"
              strokeDasharray={`${satisfaction}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">{satisfaction}%</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 font-medium">{getScoreText(satisfaction)}</p>
        </div>
      </div>
    </BaseCard>
  );
};
