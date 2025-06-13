
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Users, UserMinus, UserPlus } from 'lucide-react';

interface HRData {
  members: number;
  vacancies: number;
  onLeave: number;
}

interface HRWidgetProps {
  hr: HRData;
}

export const HRWidget: React.FC<HRWidgetProps> = ({ hr }) => {
  const hasVacancies = hr.vacancies > 0;

  return (
    <BaseCard 
      size="md"
      variant="glass"
      neonRing={hasVacancies ? 'warning' : 'success'}
      header={
        <h3 className="text-sm font-arabic font-bold text-gray-800">
          الموارد البشرية
        </h3>
      }
      className="h-[180px]"
    >
      <div className="flex-1 flex flex-col justify-center space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-blue-500" />
            <span className="text-sm text-gray-600">الموظفين</span>
          </div>
          <span className="text-lg font-bold text-blue-500">{hr.members}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus size={16} className="text-orange-500" />
            <span className="text-sm text-gray-600">الشواغر</span>
          </div>
          <span className="text-lg font-bold text-orange-500">{hr.vacancies}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserMinus size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">في إجازة</span>
          </div>
          <span className="text-lg font-bold text-gray-500">{hr.onLeave}</span>
        </div>
      </div>
    </BaseCard>
  );
};
