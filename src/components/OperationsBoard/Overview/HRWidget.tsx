
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
  return (
    <GenericCard>
      <h3 className="text-lg font-arabic font-medium mb-4 text-right">الموارد البشرية</h3>
      
      <div className="flex justify-between mt-4">
        <div className="text-center">
          <span className="text-2xl font-bold block text-blue-600">{hr.members}</span>
          <span className="text-xs text-gray-600">أعضاء الفريق</span>
        </div>

        <div className="text-center">
          <span className="text-2xl font-bold block text-amber-500">{hr.onLeave}</span>
          <span className="text-xs text-gray-600">في إجازة</span>
        </div>

        <div className="text-center">
          <span className="text-2xl font-bold block text-purple-600">{hr.vacancies}</span>
          <span className="text-xs text-gray-600">شواغر</span>
        </div>
      </div>

      <div className="mt-4">
        <Progress value={hr.members / (hr.members + hr.vacancies) * 100} className="h-2 bg-gray-200" indicatorClassName="bg-blue-500" />
      </div>
    </GenericCard>
  );
};
