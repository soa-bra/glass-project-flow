
import React from 'react';
import { GenericCard } from '@/components/ui/GenericCard';

export const ProjectsDeadlines: React.FC = () => (
  <GenericCard adminBoardStyle padding="md" className="min-h-[180px] flex flex-col justify-between">
    <div className="flex flex-col items-end w-full h-full justify-between px-0">
      <h4 className="text-lg font-bold mb-0 text-[#23272f] mt-1 w-full leading-tight text-right">المواعيد النهائية القادمة</h4>
      <div className="text-soabra-text-secondary text-sm mt-1 mb-4 text-[#23272f] w-full text-right">أقرب تسليم للمشاريع</div>
      <div className="w-full flex flex-col gap-3">
        <div className="bg-soabra-warning/30 w-full min-h-12 rounded-2xl flex items-center justify-end pr-5 text-[#23272f] text-xs shadow-sm border border-yellow-200/40" style={{fontFamily:'"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif'}}>
          18/7/2024: مشروع مركز التطوير
        </div>
        <div className="bg-soabra-warning/10 w-full min-h-12 rounded-2xl flex items-center justify-end pr-5 text-[#23272f] text-xs border border-yellow-200/25" style={{fontFamily:'"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif'}}>
          30/8/2024: منصة فحص المشروعات الذكية
        </div>
      </div>
    </div>
  </GenericCard>
);
