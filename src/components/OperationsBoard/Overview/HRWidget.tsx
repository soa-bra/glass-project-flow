

import React from 'react';
import { Users, UserMinus, UserPlus } from 'lucide-react';

interface HRData {
  members: number;
  vacancies: number;
  onLeave: number;
}

interface HRWidgetProps {
  hr: HRData;
  className?: string;
}

export const HRWidget: React.FC<HRWidgetProps> = ({ 
  hr, 
  className = '' 
}) => {
  const total = hr.members + hr.vacancies;
  const activePercentage = Math.round((hr.members / total) * 100);

  return (
    <div className={`
      ${className}
      rounded-3xl p-6 relative overflow-hidden
      bg-white/40 backdrop-blur-[20px] border border-white/30
      shadow-lg hover:shadow-xl transition-all duration-300
    `}>
      
      {/* خلفية متدرجة */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-cyan-300/20 to-teal-400/20 rounded-3xl"></div>
      
      {/* المحتوى */}
      <div className="relative z-10">
        {/* رأس البطاقة */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
            <Users size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-[#2A3437] font-arabic">
            الموارد البشرية
          </h3>
        </div>

        {/* الرقم الرئيسي */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-[#2A3437] mb-2">
            {hr.members}
          </div>
          <div className="text-sm text-gray-600 font-arabic">
            موظف نشط
          </div>
        </div>

        {/* إحصائيات مرئية */}
        <div className="space-y-4 mb-6">
          {/* شريط النشاط */}
          <div className="relative h-3 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
              style={{width: `${activePercentage}%`}}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 font-arabic">
            <span>{activePercentage}% نشط</span>
            <span>معدل التوظيف</span>
          </div>
        </div>

        {/* التفاصيل */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-2xl bg-orange-100/50 backdrop-blur-sm">
            <div className="flex items-center justify-center mb-2">
              <UserPlus size={16} className="text-orange-500" />
            </div>
            <div className="text-lg font-bold text-orange-600">{hr.vacancies}</div>
            <div className="text-xs text-gray-600 font-arabic">شواغر</div>
          </div>
          <div className="text-center p-3 rounded-2xl bg-gray-100/50 backdrop-blur-sm">
            <div className="flex items-center justify-center mb-2">
              <UserMinus size={16} className="text-gray-500" />
            </div>
            <div className="text-lg font-bold text-gray-600">{hr.onLeave}</div>
            <div className="text-xs text-gray-600 font-arabic">في إجازة</div>
          </div>
        </div>
      </div>
    </div>
  );
};

