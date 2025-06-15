
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

interface Phase {
  name: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

interface ProjectPhaseProgressProps {
  phases: Phase[];
}

export const ProjectPhaseProgress: React.FC<ProjectPhaseProgressProps> = ({ phases }) => {
  return (
    <BaseCard variant="glass" className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 font-arabic">مراحل تقدم المشروع</h3>
        <div className="flex gap-2">
          <button className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs font-arabic">
            وفق الخطة
          </button>
          <button className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-xs font-arabic">
            1 أسابيع
          </button>
        </div>
      </div>
      
      <div className="relative">
        {/* شريط التقدم الملون */}
        <div className="h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-red-400 via-blue-400 via-cyan-400 to-green-400 rounded-full w-3/4"></div>
        </div>
        
        {/* المراحل */}
        <div className="flex justify-between">
          {phases.map((phase, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-4 h-4 rounded-full mb-2 ${
                phase.isCompleted ? 'bg-green-500' : 
                phase.isCurrent ? 'bg-blue-500' : 'bg-gray-300'
              }`}></div>
              <span className="text-xs text-gray-600 font-arabic text-center max-w-16">
                {phase.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </BaseCard>
  );
};
