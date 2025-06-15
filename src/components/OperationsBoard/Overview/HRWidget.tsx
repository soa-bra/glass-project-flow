
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { Users } from 'lucide-react';

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
    <GenericCard
      adminBoardStyle
      hover={false}
      padding="md"
      className={`${className} flex flex-col`}
    >
      <header className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <Users size={20} className="text-purple-600" />
        </div>
        <h3 className="text-lg font-arabic font-bold text-[#23272f]">
          الموارد البشرية
        </h3>
      </header>
      
      <div className="flex-1 space-y-4">
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
          <span className="text-sm font-medium text-gray-700">إجمالي الموظفين</span>
          <span className="text-xl font-bold text-blue-600">{hr.members}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl">
          <span className="text-sm font-medium text-gray-700">الوظائف الشاغرة</span>
          <span className="text-xl font-bold text-orange-600">{hr.vacancies}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
          <span className="text-sm font-medium text-gray-700">في إجازة</span>
          <span className="text-xl font-bold text-green-600">{hr.onLeave}</span>
        </div>
      </div>
    </GenericCard>
  );
};
