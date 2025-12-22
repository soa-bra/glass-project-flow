
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

  const colorClasses = {
    success: 'border-green-200/50',
    warning: 'border-yellow-200/50', 
    error: 'border-red-200/50'
  }

  return (
    <div className={`
      ${className}
      rounded-3xl p-5
      bg-white/80 backdrop-blur-xl border ${colorClasses[getSatisfactionColor(satisfaction)]}
      shadow-lg hover:shadow-xl transition-all duration-300
      flex flex-col justify-between
    `}>
      
      <h3 className="text-lg font-arabic font-bold text-gray-800 mb-4">
        رضا العملاء
      </h3>

      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {satisfaction}%
        </div>
        
        <div className="text-sm text-gray-600 mb-5">
          {getSatisfactionText(satisfaction)}
        </div>

        <Progress 
          value={satisfaction} 
          className="w-full h-2.5 bg-gray-200/50 rounded-full"
          indicatorClassName={
            satisfaction >= 80 ? 'bg-green-500 rounded-full' : 
            satisfaction >= 60 ? 'bg-yellow-500 rounded-full' : 
            'bg-red-500 rounded-full'
          }
        />
      </div>
    </div>
  );
};
