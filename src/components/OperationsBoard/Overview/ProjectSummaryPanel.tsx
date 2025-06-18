
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

export const ProjectSummaryPanel: React.FC<ProjectSummaryPanelProps> = ({
  projects
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#bdeed3';
      case 'active':
        return '#a4e2f6';
      case 'delayed':
        return '#f1b5b9';
      default:
        return '#d9d2fd';
    }
  };

  return (
    <div className="h-full flex flex-col p-4 rounded-lg bg-white/40 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold font-arabic">المشاريع</h3>
        <CircularIconButton icon={MoreHorizontal} size="sm" />
      </div>
      
      <div className="flex-1 space-y-3">
        {projects.map(project => (
          <div key={project.id} className="p-3 rounded-lg bg-white/60 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-sm font-arabic mb-1">{project.title}</h4>
                <p className="text-xs text-gray-600 font-arabic">{project.type}</p>
              </div>
              <span className="text-xs text-gray-500 font-arabic">{project.date}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${project.progress}%`,
                    backgroundColor: getStatusColor(project.status)
                  }}
                />
              </div>
              <span className="text-xs font-medium font-arabic">{project.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
