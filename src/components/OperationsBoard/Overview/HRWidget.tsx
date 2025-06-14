
import React from 'react';
import { Users, UserMinus, UserPlus } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';

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
    <BaseCard
      variant="glass"
      color={hasVacancies ? 'warning' : 'success'}
      adminBoardStyle
      size="md"
      className={`h-full w-full ${className}`}
      header={
        <h3 className="text-lg font-arabic font-bold text-gray-800 mb-1">
          الموارد البشرية
        </h3>
      }
    >
      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Users size={17} className="text-blue-400" />
            <span className="text-base text-gray-600">الموظفين</span>
          </div>
          <span className="text-xl font-bold text-blue-400">{hr.members}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserPlus size={17} className="text-yellow-500" />
            <span className="text-base text-gray-600">الشواغر</span>
          </div>
          <span className="text-xl font-bold text-yellow-500">{hr.vacancies}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserMinus size={17} className="text-gray-500" />
            <span className="text-base text-gray-600">في إجازة</span>
          </div>
          <span className="text-xl font-bold text-gray-500">{hr.onLeave}</span>
        </div>
      </div>
    </BaseCard>
  );
};
