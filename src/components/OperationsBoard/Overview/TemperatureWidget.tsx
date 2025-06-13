
import React from 'react';

interface TemperatureWidgetProps {
  className?: string;
}

export const TemperatureWidget: React.FC<TemperatureWidgetProps> = ({
  className = ''
}) => {
  const temperature = 68;

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
          درجة الحرارة
        </h3>
      </div>

      <div className="text-center flex-1 flex flex-col justify-center">
        <div className="text-2xl font-bold text-orange-600 mb-1">
          {temperature}°F
        </div>
        <div className="text-xs text-gray-600">
          الحرارة الخارجية
        </div>
      </div>

      {/* مؤشر درجة الحرارة */}
      <div className="flex justify-center mt-3">
        <div className="w-12 h-2 bg-gradient-to-r from-blue-400 via-green-400 to-red-400 rounded-full">
          <div 
            className="w-2 h-2 bg-white rounded-full shadow-md transform -translate-y-0"
            style={{ marginLeft: `${((temperature - 32) / 68) * 40}px` }}
          />
        </div>
      </div>
    </div>
  );
};
