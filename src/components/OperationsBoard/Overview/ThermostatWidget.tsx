
import React, { useState } from 'react';
import { Thermometer, Plus, Minus } from 'lucide-react';

interface ThermostatWidgetProps {
  className?: string;
}

export const ThermostatWidget: React.FC<ThermostatWidgetProps> = ({
  className = ''
}) => {
  const [temperature, setTemperature] = useState(24);
  const [isActive, setIsActive] = useState(true);

  const adjustTemperature = (delta: number) => {
    setTemperature(prev => Math.max(16, Math.min(30, prev + delta)));
  };

  return (
    <div className={`
      ${className}
      rounded-3xl p-6
      bg-white/40 backdrop-blur-[20px] border border-white/30
      shadow-lg hover:shadow-xl transition-all duration-300
      flex flex-col items-center justify-between
      font-arabic
    `}>
      
      {/* رأس البطاقة */}
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          منظم الحرارة
        </h3>
        <button
          onClick={() => setIsActive(!isActive)}
          className={`w-12 h-6 rounded-full transition-all duration-300 ${
            isActive ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
            isActive ? 'translate-x-6' : 'translate-x-0.5'
          }`} />
        </button>
      </div>

      {/* دائرة منظم الحرارة */}
      <div className="relative w-32 h-32 mb-6">
        <div className="absolute inset-0 rounded-full border-8 border-gray-200/50">
          <div 
            className="absolute inset-0 rounded-full border-8 border-blue-500 border-t-transparent border-r-transparent transition-all duration-500"
            style={{
              transform: `rotate(${((temperature - 16) / 14) * 270 - 135}deg)`
            }}
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-gray-900">
            {temperature}°
          </div>
          <div className="text-sm text-gray-600">
            مئوية
          </div>
        </div>
      </div>

      {/* أزرار التحكم */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => adjustTemperature(-1)}
          className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/80 transition-all duration-200"
        >
          <Minus size={16} className="text-gray-700" />
        </button>
        
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
          <Thermometer size={16} className="text-blue-600" />
        </div>
        
        <button
          onClick={() => adjustTemperature(1)}
          className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/80 transition-all duration-200"
        >
          <Plus size={16} className="text-gray-700" />
        </button>
      </div>

      {/* معلومات إضافية */}
      <div className="text-xs text-gray-600 text-center mt-4">
        <div>الوضع: {isActive ? 'نشط' : 'متوقف'}</div>
      </div>
    </div>
  );
};
