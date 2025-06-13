
import React from 'react';

interface WeatherWidgetProps {
  className?: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  className = ''
}) => {
  return (
    <div className={`
      ${className}
      rounded-3xl p-4
      bg-gradient-to-br from-blue-400/80 to-purple-500/80 backdrop-blur-[20px] border border-white/30
      shadow-lg hover:shadow-xl transition-all duration-300
      flex flex-col justify-between text-white
      font-arabic
    `}>
      
      <div className="text-right mb-2">
        <h3 className="text-sm font-bold">
          الطقس
        </h3>
      </div>

      <div className="text-center flex-1 flex flex-col justify-center">
        <div className="text-xl font-bold mb-1">
          ☀️
        </div>
        <div className="text-lg font-bold mb-1">
          25°
        </div>
        <div className="text-xs opacity-90">
          مشمس
        </div>
      </div>
    </div>
  );
};
