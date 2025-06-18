
import React from 'react';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';
import { CircularIconButton } from '@/components/ui/CircularIconButton';

interface ProjectSummary {
  id: number;
  title: string;
  type: string;
  progress: number;
  status: 'active' | 'completed' | 'delayed';
  date: string;
}

interface ProjectSummaryPanelProps {
  projects: ProjectSummary[];
}

export const ProjectSummaryPanel: React.FC<ProjectSummaryPanelProps> = ({ projects }) => {
  return (
    <div 
      className="h-full p-6 rounded-3xl shadow-lg border border-white/40"
      style={{ background: '#a4e2f6' }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 font-arabic">ملخص المشاريع</h3>
        <div className="flex gap-2">
          <CircularIconButton icon={ChevronLeft} size="sm" />
          <CircularIconButton icon={MoreHorizontal} size="sm" />
        </div>
      </div>
      
      {/* الشريط البياني الأسبوعي */}
      <div className="mb-6">
        <div className="flex items-end justify-center gap-2 h-20 mb-3">
          {[
            { day: 'Mon', height: 45, isMain: false },
            { day: 'Tue', height: 35, isMain: false },
            { day: 'Wed', height: 55, isMain: false },
            { day: 'Thu', height: 80, isMain: true },
            { day: 'Fri', height: 40, isMain: false },
            { day: 'Sat', height: 60, isMain: false },
            { day: 'Sun', height: 25, isMain: false }
          ].map((bar, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className="rounded-sm transition-all duration-300"
                style={{
                  width: '16px',
                  height: `${bar.height}px`,
                  backgroundColor: bar.isMain ? '#000000' : '#f2ffff'
                }}
              />
              <span className="text-xs text-gray-600 mt-1">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* الإحصائيات */}
      <div className="space-y-3 text-right">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-gray-800 font-arabic">140</span>
          <span className="text-sm text-gray-700 font-arabic">هذا النص مثال</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-gray-800 font-arabic">50</span>
          <span className="text-sm text-gray-700 font-arabic">هذا النص مثال</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-gray-800 font-arabic">02</span>
          <span className="text-sm text-gray-700 font-arabic">النص مثال</span>
        </div>
      </div>
    </div>
  );
};
