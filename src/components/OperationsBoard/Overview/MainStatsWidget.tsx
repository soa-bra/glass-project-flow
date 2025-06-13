
import React from 'react';
import { Power } from 'lucide-react';

interface MainStatsWidgetProps {
  data: {
    budget: {
      total: number;
      spent: number;
    };
    contracts: {
      signed: number;
      expired: number;
    };
    hr: {
      members: number;
      vacancies: number;
      onLeave: number;
    };
    satisfaction: number;
  };
  className?: string;
}

export const MainStatsWidget: React.FC<MainStatsWidgetProps> = ({
  data,
  className = ''
}) => {
  return (
    <div className={`
      ${className}
      rounded-3xl p-6
      bg-white/40 backdrop-blur-[20px] border border-white/30
      shadow-lg hover:shadow-xl transition-all duration-300
      flex flex-col justify-between
      font-arabic
    `}>
      
      {/* رأس البطاقة */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">
            لوحة الإحصائيات
          </h3>
          <p className="text-sm text-gray-600">
            المؤشرات الرئيسية
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
          <Power size={24} className="text-blue-600" />
        </div>
      </div>

      {/* الإحصائيات الرئيسية */}
      <div className="space-y-6 flex-1">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {data.hr.members}
          </div>
          <div className="text-sm text-gray-600">
            الموظفين النشطين
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white/30 rounded-xl backdrop-blur-sm">
            <div className="text-lg font-bold text-green-600">
              {data.contracts.signed}
            </div>
            <div className="text-xs text-gray-600">
              عقود موقعة
            </div>
          </div>
          
          <div className="text-center p-3 bg-white/30 rounded-xl backdrop-blur-sm">
            <div className="text-lg font-bold text-blue-600">
              {data.satisfaction}%
            </div>
            <div className="text-xs text-gray-600">
              رضا العملاء
            </div>
          </div>
        </div>

        {/* شريط التقدم */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">التقدم الشهري</span>
            <span className="font-bold text-gray-800">78%</span>
          </div>
          <div className="w-full bg-gray-200/50 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
