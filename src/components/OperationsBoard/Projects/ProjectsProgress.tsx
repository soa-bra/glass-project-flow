
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';

// نموذج أولي Placeholder
export const ProjectsProgress: React.FC = () => (
  <GenericCard adminBoardStyle>
    <div className="flex flex-col items-end">
      <h4 className="text-lg font-bold mb-2 text-[#23272F]">تقدم المشاريع</h4>
      <div className="text-soabra-text-secondary text-sm mb-4">مخططات تقدم المشاريع</div>
      <div className="h-6 bg-[#dfecf2] rounded-full w-full"></div>
      {/* سيتم إضافة Progress لاحقاً */}
    </div>
  </GenericCard>
);
