
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';

// نموذج أولي Placeholder
export const TasksDistribution: React.FC = () => (
  <GenericCard adminBoardStyle>
    <div className="flex flex-col items-end">
      <h4 className="text-lg font-bold mb-2 text-[#23272F]">توزيع المهام</h4>
      <div className="text-soabra-text-secondary text-sm mb-4">توزيع المهام بين الفرق</div>
      <div className="w-full h-24 bg-gradient-to-l from-[#bdeed3] to-[#add8ea] rounded-2xl"></div>
    </div>
  </GenericCard>
);
