
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
      <h3 className="text-base font-arabic font-semibold mb-4 text-white/90">
        الموارد البشرية
      </h3>

      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Users size={16} className="text-blue-400" />
            </div>
            <span className="text-sm text-white/80">الموظفين</span>
          </div>
          <span className="text-xl font-bold text-blue-400">{hr.members}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
              <UserPlus size={16} className="text-orange-400" />
            </div>
            <span className="text-sm text-white/80">الشواغر</span>
          </div>
          <span className="text-xl font-bold text-orange-400">{hr.vacancies}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center">
              <UserMinus size={16} className="text-gray-400" />
            </div>
            <span className="text-sm text-white/80">في إجازة</span>
          </div>
          <span className="text-xl font-bold text-gray-400">{hr.onLeave}</span>
        </div>
      </div>
    </GlassWidget>
  );
};
