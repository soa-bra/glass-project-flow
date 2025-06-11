
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { GenericCard } from '@/components/ui/GenericCard';

interface HRData {
  members: number;
  vacancies: number;
  onLeave: number;
}

interface HRWidgetProps {
  hr: HRData;
}

export const HRWidget: React.FC<HRWidgetProps> = ({
  hr
}) => {
  const total = hr.members + hr.vacancies;
  const fillPercentage = (hr.members / total) * 100;

  return (
    <GenericCard className="h-full">
      <h3 className="text-xl font-arabic font-bold mb-6 text-right text-gray-800">الموارد البشرية</h3>
      
      <div className="flex justify-center items-center mb-6">
        <div className="text-center ml-6">
          <div className="text-4xl font-bold text-blue-500 mb-1">{hr.members}</div>
          <div className="text-sm text-gray-600">أعضاء الفريق</div>
        </div>
        <div className="text-center ml-6">
          <div className="text-4xl font-bold text-orange-500 mb-1">{hr.onLeave}</div>
          <div className="text-sm text-gray-600">في إجازة</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-purple-500 mb-1">{hr.vacancies}</div>
          <div className="text-sm text-gray-600">شواغر</div>
        </div>
      </div>

      <Progress 
        value={fillPercentage} 
        className="h-3 bg-blue-200" 
        indicatorClassName="bg-blue-500" 
      />
    </GenericCard>
  );
};
