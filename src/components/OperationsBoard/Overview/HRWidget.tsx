
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { BaseCard } from '@/components/ui/BaseCard';

interface HRData {
  members: number;
  vacancies: number;
  onLeave: number;
}

interface HRWidgetProps {
  hr: HRData;
}

export const HRWidget: React.FC<HRWidgetProps> = ({ hr }) => {
  const total = hr.members + hr.vacancies;
  const fillPercentage = (hr.members / total) * 100;
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
      className="h-[120px]"
    >
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex justify-center items-center mb-4">
          <div className="text-center ml-3">
            <div className="text-lg font-bold text-blue-500 mb-1">{hr.members}</div>
            <div className="text-xs text-gray-600">أعضاء الفريق</div>
          </div>
          <div className="text-center ml-3">
            <div className="text-lg font-bold text-orange-500 mb-1">{hr.onLeave}</div>
            <div className="text-xs text-gray-600">في إجازة</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-500 mb-1">{hr.vacancies}</div>
            <div className="text-xs text-gray-600">شواغر</div>
          </div>
        </div>

        <Progress 
          value={fillPercentage} 
          className="h-1 bg-blue-200" 
          indicatorClassName="bg-blue-500" 
        />
      </div>
    </BaseCard>
  );
};
