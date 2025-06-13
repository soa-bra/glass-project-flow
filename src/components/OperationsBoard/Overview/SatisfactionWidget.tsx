

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
    if (score >= 80) return { from: '#10B981', to: '#059669', bg: 'from-green-400/20' };
    if (score >= 60) return { from: '#F59E0B', to: '#D97706', bg: 'from-yellow-400/20' };
    return { from: '#EF4444', to: '#DC2626', bg: 'from-red-400/20' };
  };

  const getSatisfactionText = (score: number) => {
    if (score >= 80) return 'ممتاز';
    if (score >= 60) return 'جيد';
    return 'يحتاج تحسين';
  };

  const colors = getSatisfactionColor(satisfaction);

  return (
    <div className={`
      ${className}
      rounded-3xl p-6 relative overflow-hidden
      bg-white/40 backdrop-blur-[20px] border border-white/30
      shadow-lg hover:shadow-xl transition-all duration-300
    `}>
      
      {/* خلفية متدرجة */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} via-purple-300/10 to-pink-400/20 rounded-3xl`}></div>
      
      {/* المحتوى */}
      <div className="relative z-10">
        {/* رأس البطاقة */}
        <div className="flex items-center justify-between mb-6">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{background: `linear-gradient(to right, ${colors.from}, ${colors.to})`}}
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#2A3437] font-arabic">
            رضا العملاء
          </h3>
        </div>

        {/* الرقم الرئيسي مع دائري */}
        <div className="text-center mb-6">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <div className="absolute inset-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={colors.from}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2.51 * satisfaction} 251.2`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#2A3437]">{satisfaction}%</div>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 font-arabic">
            {getSatisfactionText(satisfaction)}
          </div>
        </div>

        {/* مؤشرات إضافية */}
        <div className="grid grid-cols-1 gap-3">
          <div className="p-3 rounded-2xl bg-white/30 backdrop-blur-sm">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 font-arabic">معدل الرضا</div>
              <div className="flex items-center gap-2">
                <div className="text-lg font-bold text-[#2A3437]">{satisfaction}%</div>
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: colors.from}}></div>
              </div>
            </div>
          </div>
          
          <div className="p-3 rounded-2xl bg-white/30 backdrop-blur-sm">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 font-arabic">الحالة</div>
              <div className="text-sm font-medium" style={{color: colors.from}}>
                {getSatisfactionText(satisfaction)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

