
import React from 'react';
import { Users, UserMinus, UserPlus } from 'lucide-react';
import GlassWidget from '@/components/ui/GlassWidget';

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
    <GlassWidget className={className}>
      <h3 className="text-sm font-arabic font-bold mb-3">
        الموارد البشرية
      </h3>

      <div className="space-y-3 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-blue-400" />
            <span className="text-xs text-white/70">الموظفين</span>
          </div>
          <span className="text-lg font-bold text-blue-400">{hr.members}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus size={14} className="text-orange-400" />
            <span className="text-xs text-white/70">الشواغر</span>
          </div>
          <span className="text-lg font-bold text-orange-400">{hr.vacancies}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserMinus size={14} className="text-gray-400" />
            <span className="text-xs text-white/70">في إجازة</span>
          </div>
          <span className="text-lg font-bold text-gray-400">{hr.onLeave}</span>
        </div>
      </div>
    </GlassWidget>
  );
};
