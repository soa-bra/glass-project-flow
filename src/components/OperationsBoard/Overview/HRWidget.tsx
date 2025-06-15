
import React from 'react';
import { Users, UserMinus, UserPlus } from 'lucide-react';
import { GenericCard } from '@/components/ui/GenericCard';

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
    <GenericCard
      adminBoardStyle
      padding="md"
      color={hasVacancies ? 'warning' : 'success'}
      className={`h-full w-full ${className} min-h-[180px] flex flex-col justify-between`}
    >
      <div className="w-full flex flex-col h-full justify-between items-end text-right">
        <h3 className="text-lg font-arabic font-bold text-gray-800 mb-1 w-full leading-tight mt-1">
          الموارد البشرية
        </h3>
        <div className="space-y-4 flex-1 w-full mt-1">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <Users size={17} className="text-blue-400" />
              <span className="text-base text-gray-600">الموظفين</span>
            </div>
            <span className="text-xl font-bold text-blue-400">{hr.members}</span>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <UserPlus size={17} className="text-yellow-500" />
              <span className="text-base text-gray-600">الشواغر</span>
            </div>
            <span className="text-xl font-bold text-yellow-500">{hr.vacancies}</span>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <UserMinus size={17} className="text-gray-500" />
              <span className="text-base text-gray-600">في إجازة</span>
            </div>
            <span className="text-xl font-bold text-gray-500">{hr.onLeave}</span>
          </div>
        </div>
      </div>
    </GenericCard>
  );
};
