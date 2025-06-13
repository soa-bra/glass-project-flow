
import React from 'react';
import { Progress } from '@/components/ui/progress';
import GlassWidget from '@/components/ui/GlassWidget';

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
    <GlassWidget className={className}>
      <h3 className="text-sm font-arabic font-bold mb-3">
        رضا العملاء
      </h3>

      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <div className="text-2xl font-bold mb-2">
          {satisfaction}%
        </div>
        
        <div className="text-sm text-white/70 mb-4">
          {getSatisfactionText(satisfaction)}
        </div>

        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            style={{ width: `${satisfaction}%` }}
            className={`h-full transition-[width] duration-500 ${
              satisfaction >= 80 ? 'bg-green-500' : 
              satisfaction >= 60 ? 'bg-yellow-500' : 
              'bg-red-500'
            }`}
          />
        </div>
      </div>
    </GlassWidget>
  );
};
