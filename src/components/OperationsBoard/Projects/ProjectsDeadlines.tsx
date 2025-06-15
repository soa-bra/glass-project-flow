
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';

export const ProjectsDeadlines: React.FC = () => (
  <GenericCard adminBoardStyle>
    <div className="flex flex-col items-end">
      <h4 className="text-lg font-bold mb-2 text-[#23272f]">المواعيد النهائية القادمة</h4>
      <div className="text-soabra-text-secondary text-sm mb-4 text-[#23272f]">أقرب تسليم للمشاريع</div>
      <div className="bg-soabra-warning/30 w-full h-10 rounded-2xl text-xs flex items-center justify-end pr-5 text-[#23272f]">
        18/7/2024: مشروع مركز التطوير
      </div>
    </div>
  </GenericCard>
);
