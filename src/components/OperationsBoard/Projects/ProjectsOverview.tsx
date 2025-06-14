
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';

// نموذج أولي Placeholder - سيتم التطوير لاحقاً
export const ProjectsOverview: React.FC = () => (
  <GenericCard adminBoardStyle>
    <div className="flex flex-col items-end">
      <h4 className="text-lg font-bold text-[#23272F] mb-2">نظرة عامة المشاريع</h4>
      <div className="text-soabra-text-secondary text-sm mb-4">إحصائيات ملخصة ومرئية حول المشاريع</div>
      <div className="flex gap-5">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-[#29936c]">23</span>
          <span className="text-xs text-gray-500">مشروع نشط</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-[#eab308]">5</span>
          <span className="text-xs text-gray-500">متأخر</span>
        </div>
      </div>
    </div>
  </GenericCard>
);
