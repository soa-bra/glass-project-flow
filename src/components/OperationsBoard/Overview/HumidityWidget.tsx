
import React from 'react';

interface HumidityWidgetProps {
  className?: string;
}

export const HumidityWidget: React.FC<HumidityWidgetProps> = ({
  className = ''
}) => {
  const humidity = 48.2;

  return (
    <div className={`
      ${className}
      rounded-3xl p-4
      bg-white/40 backdrop-blur-[20px] border border-white/30
      shadow-lg hover:shadow-xl transition-all duration-300
      flex flex-col justify-between
      font-arabic
    `}>
      
      <div className="text-right mb-2">
        <h3 className="text-sm font-bold text-gray-800">
          الرطوبة
        </h3>
      </div>

      <div className="text-center flex-1 flex flex-col justify-center">
        <div className="text-2xl font-bold text-blue-600 mb-1">
          {humidity}%
        </div>
        <div className="text-xs text-gray-600">
          نسبة الرطوبة
        </div>
      </div>

      {/* شريط مؤشر الرطوبة */}
      <div className="w-full bg-gray-200/50 rounded-full h-2 mt-3">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${humidity}%` }}
        />
      </div>
    </div>
  );
};
