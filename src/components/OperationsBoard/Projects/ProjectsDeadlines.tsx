
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';

// نموذج أولي Placeholder
export const ProjectsDeadlines: React.FC = () => (
  <GenericCard adminBoardStyle>
    <div className="flex flex-col items-end">
      <h4 className="text-lg font-bold mb-2 text-[#23272F]">المواعيد النهائية القادمة</h4>
      <div className="text-soabra-text-secondary text-sm mb-4">أقرب تسليم للمشاريع</div>
      <div className="bg-[#f9e2a9]/70 w-full h-10 rounded-2xl text-xs flex items-center justify-end pr-5 text-[#b28010]">
        18/7/2024: مشروع مركز التطوير
      </div>
    </div>
  </GenericCard>
);
