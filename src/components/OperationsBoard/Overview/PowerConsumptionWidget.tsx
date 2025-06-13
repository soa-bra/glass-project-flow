
import React from 'react';
import { BarChart3 } from 'lucide-react';

interface PowerConsumptionWidgetProps {
  className?: string;
}

export const PowerConsumptionWidget: React.FC<PowerConsumptionWidgetProps> = ({
  className = ''
}) => {
  const chartData = [
    { month: 'يناير', value: 120 },
    { month: 'فبراير', value: 98 },
    { month: 'مارس', value: 145 },
    { month: 'أبريل', value: 167 },
    { month: 'مايو', value: 189 },
    { month: 'يونيو', value: 156 }
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className={`
      ${className}
      rounded-3xl p-6
      bg-white/40 backdrop-blur-[20px] border border-white/30
      shadow-lg hover:shadow-xl transition-all duration-300
      flex flex-col
      font-arabic
    `}>
      
      {/* رأس البطاقة */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            استهلاك الطاقة (كيلوواط)
          </h3>
          <p className="text-sm text-gray-600">
            التوزيع الشهري
          </p>
        </div>
        <BarChart3 size={20} className="text-gray-600" />
      </div>

      {/* الرسم البياني */}
      <div className="flex-1 flex items-end justify-between gap-2 mb-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className="w-full bg-blue-500 rounded-t-lg transition-all duration-500 hover:bg-blue-600"
              style={{ 
                height: `${(item.value / maxValue) * 120}px`,
                minHeight: '20px'
              }}
              title={`${item.month}: ${item.value} كيلوواط`}
            />
            <span className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-center">
              {item.month.slice(0, 3)}
            </span>
          </div>
        ))}
      </div>

      {/* المعلومات الإضافية */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200/50">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">189</div>
          <div className="text-xs text-gray-600">الحد الأقصى</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">142</div>
          <div className="text-xs text-gray-600">المتوسط</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">98</div>
          <div className="text-xs text-gray-600">الحد الأدنى</div>
        </div>
      </div>
    </div>
  );
};
