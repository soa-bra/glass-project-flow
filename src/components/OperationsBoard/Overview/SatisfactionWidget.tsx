
import React from 'react';

interface SatisfactionWidgetProps {
  satisfaction: number;
  className?: string;
}

export const SatisfactionWidget: React.FC<SatisfactionWidgetProps> = ({ 
  satisfaction, 
  className = '' 
}) => {
  const getSatisfactionColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getSatisfactionText = (score: number) => {
    if (score >= 80) return 'ممتاز';
    if (score >= 60) return 'جيد';
    return 'يحتاج تحسين';
  };

  const color = getSatisfactionColor(satisfaction);

  return (
    <div className={`
      ${className}
      rounded-2xl p-4 relative overflow-hidden
      bg-white/40 backdrop-blur-[20px] border border-white/30
      shadow-sm transition-all duration-300
    `}>
      
      {/* المحتوى */}
      <div className="relative z-10">
        {/* رأس البطاقة */}
        <div className="flex items-center justify-between mb-4">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{backgroundColor: `${color}20`}}
          >
            <svg className="w-4 h-4" style={{color}} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-gray-800 font-arabic">
            رضا العملاء
          </h3>
        </div>

        {/* دائرة التقدم الكبيرة */}
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-20 h-20">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgba(0, 0, 0, 0.1)"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={color}
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={`${2.51 * satisfaction} 251.2`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{satisfaction}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* النص التوضيحي */}
        <div className="text-center">
          <div className="text-xs text-gray-600 font-arabic mb-2">
            {getSatisfactionText(satisfaction)}
          </div>
          <div className="p-2 rounded-lg bg-white/30">
            <div className="text-xs text-gray-700 font-arabic">معدل الرضا العام</div>
          </div>
        </div>
      </div>
    </div>
  );
};
