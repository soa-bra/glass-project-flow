
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface SatisfactionWidgetProps {
  satisfaction: number;
  className?: string;
}

export const SatisfactionWidget: React.FC<SatisfactionWidgetProps> = ({ 
  satisfaction, 
  className = '' 
}) => {
  const getSatisfactionColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getSatisfactionText = (score: number) => {
    if (score >= 80) return 'ممتاز';
    if (score >= 60) return 'جيد';
    return 'يحتاج تحسين';
  };

  return (
    <div className={`
      ${className}
      glass-enhanced rounded-[20px] p-4
      neon-ring-${getSatisfactionColor(satisfaction)}
      flex flex-col justify-between
    `}>
      
      <h3 className="text-sm font-arabic font-bold text-gray-800 mb-3">
        رضا العملاء
      </h3>

      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <div className="text-2xl font-bold text-gray-900 mb-2">
          {satisfaction}%
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          {getSatisfactionText(satisfaction)}
        </div>

        <Progress 
          value={satisfaction} 
          className="w-full h-2 bg-gray-200"
          indicatorClassName={
            satisfaction >= 80 ? 'bg-green-500' : 
            satisfaction >= 60 ? 'bg-yellow-500' : 
            'bg-red-500'
          }
        />
      </div>
    </div>
  );
};
