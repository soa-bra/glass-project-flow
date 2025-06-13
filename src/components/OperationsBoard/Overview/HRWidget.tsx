
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
      glass-enhanced rounded-[20px] p-4
      ${hasVacancies ? 'neon-ring-warning' : 'neon-ring-success'}
      flex flex-col justify-between
    `}>
      
      <h3 className="text-sm font-arabic font-bold text-gray-800 mb-3">
        الموارد البشرية
      </h3>

      <div className="space-y-3 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-blue-500" />
            <span className="text-xs text-gray-600">الموظفين</span>
          </div>
          <span className="text-lg font-bold text-blue-500">{hr.members}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus size={14} className="text-orange-500" />
            <span className="text-xs text-gray-600">الشواغر</span>
          </div>
          <span className="text-lg font-bold text-orange-500">{hr.vacancies}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserMinus size={14} className="text-gray-500" />
            <span className="text-xs text-gray-600">في إجازة</span>
          </div>
          <span className="text-lg font-bold text-gray-500">{hr.onLeave}</span>
        </div>
      </div>
    </div>
  );
};
