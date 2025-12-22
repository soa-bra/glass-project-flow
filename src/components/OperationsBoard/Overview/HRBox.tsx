import React from 'react';
import { BaseBox } from '@/components/ui/BaseBox';

export interface HRData {
  members: number;
  vacancies: number;
  onLeave: number;
}

export interface HRBoxProps {
  hr: HRData;
  className?: string;
}

export const HRBox: React.FC<HRBoxProps> = ({ 
  hr, 
  className = '' 
}) => {
  return (
    <BaseBox 
      title="الموارد البشرية"
      variant="unified"
      size="sm"
      rounded="xl"
      className={`h-full min-h-0 flex flex-col justify-between ${className}`}
    >
      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[hsl(var(--ink))] font-arabic">الموظفين</span>
          <span className="text-xl font-bold text-[hsl(var(--ink))]">{hr.members}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[hsl(var(--ink))] font-arabic">الشواغر</span>
          <span className="text-xl font-bold text-[hsl(var(--ink))]">{hr.vacancies}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[hsl(var(--ink))] font-arabic">في إجازة</span>
          <span className="text-xl font-bold text-[hsl(var(--ink))]">{hr.onLeave}</span>
        </div>
      </div>
    </BaseBox>
  );
};
