
import React from 'react';

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
  return (
    <div className={`
      ${className}
      rounded-3xl p-5
      bg-white/80 backdrop-blur-xl border border-white/30
      shadow-lg hover:shadow-xl transition-all duration-300
      flex flex-col justify-between
    `}>
      
      <h3 className="text-lg font-arabic font-bold text-black mb-4">
        الموارد البشرية
      </h3>

      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm text-black">الموظفين</span>
          <span className="text-xl font-bold text-black">{hr.members}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-black">الشواغر</span>
          <span className="text-xl font-bold text-black">{hr.vacancies}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-black">في إجازة</span>
          <span className="text-xl font-bold text-black">{hr.onLeave}</span>
        </div>
      </div>
    </div>
  );
};
