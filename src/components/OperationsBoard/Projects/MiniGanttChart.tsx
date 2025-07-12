
import React from 'react';

interface CriticalProject {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'delayed';
  priority: 'high' | 'medium' | 'low';
}

interface MiniGanttChartProps {
  criticalProjects: CriticalProject[];
}

export const MiniGanttChart: React.FC<MiniGanttChartProps> = ({ criticalProjects }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return '#bdeed3';
      case 'at-risk':
        return '#fbe2aa';
      case 'delayed':
        return '#f1b5b9';
      default:
        return '#d0e0e2';
    }
  };

  return (
    <div className="p-6 rounded-3xl border border-black/10" style={{ backgroundColor: '#d0e0e2' }}>
      <div className="mb-6">
        <h3 className="text-large font-semibold text-black font-arabic">المشاريع الحرجة</h3>
      </div>
      <div className="space-y-4">
        {criticalProjects.map((project) => (
          <div key={project.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-black font-arabic">{project.name}</span>
              <span 
                className="px-3 py-1 rounded-full text-xs font-normal text-black"
                style={{ backgroundColor: getStatusColor(project.status) }}
              >
                {project.status === 'on-track' ? 'في المسار' : 
                 project.status === 'at-risk' ? 'معرض للخطر' : 'متأخر'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300" 
                style={{ 
                  width: `${project.progress}%`,
                  backgroundColor: getStatusColor(project.status)
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs font-normal text-gray-400 font-arabic">
              <span>{project.startDate}</span>
              <span>{project.progress}%</span>
              <span>{project.endDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
