
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
      rounded-2xl p-4 relative overflow-hidden
      bg-white/40 backdrop-blur-[20px] border border-white/30
      shadow-sm transition-all duration-300
    `}>
      
      {/* المحتوى */}
      <div className="relative z-10">
        {/* رأس البطاقة مع الأيقونة والعنوان */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Users size={16} className="text-blue-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-800 font-arabic">
            الموارد البشرية
          </h3>
        </div>

        {/* الرقم الرئيسي - أسلوب بسيط */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {hr.members}
          </div>
          <div className="text-xs text-gray-600 font-arabic">
            موظف نشط
          </div>
        </div>

        {/* شريط التقدم البسيط */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-600 font-arabic">{activePercentage}%</span>
            <span className="text-xs text-gray-500 font-arabic">معدل التوظيف</span>
          </div>
          <div className="h-2 bg-gray-200/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-1000"
              style={{width: `${activePercentage}%`}}
            ></div>
          </div>
        </div>

        {/* الإحصائيات السفلية */}
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-2 rounded-lg bg-white/30">
            <div className="text-sm font-medium text-orange-600">{hr.vacancies}</div>
            <div className="text-xs text-gray-600 font-arabic">شواغر</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/30">
            <div className="text-sm font-medium text-gray-600">{hr.onLeave}</div>
            <div className="text-xs text-gray-600 font-arabic">في إجازة</div>
          </div>
        </div>
      </div>
    </div>
  );
};
