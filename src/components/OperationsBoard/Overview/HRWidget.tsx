
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
  const hasVacancies = hr.vacancies > 0;

  return (
    <div className={`
      ${className}
      rounded-3xl p-5
      bg-[#f3ffff] border border-gray-200/50 shadow-sm
      hover:shadow-md transition-all duration-300
      ${hasVacancies ? 'border-orange-200' : 'border-green-200'}
      flex flex-col justify-between
    `}>
      
      <h3 className="text-lg font-arabic font-bold text-gray-800 mb-4">
        الموارد البشرية
      </h3>

      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Users size={16} className="text-blue-500" />
            <span className="text-sm text-gray-600">الموظفين</span>
          </div>
          <span className="text-xl font-bold text-blue-500">{hr.members}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserPlus size={16} className="text-orange-500" />
            <span className="text-sm text-gray-600">الشواغر</span>
          </div>
          <span className="text-xl font-bold text-orange-500">{hr.vacancies}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserMinus size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">في إجازة</span>
          </div>
          <span className="text-xl font-bold text-gray-500">{hr.onLeave}</span>
        </div>
      </div>
    </div>
  );
};
