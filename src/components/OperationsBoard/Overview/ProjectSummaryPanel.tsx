
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
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">ملخص المشاريع</h3>
        <CircularIconButton icon={MoreHorizontal} size="sm" />
      </div>
      <div className="flex-1 space-y-3">
        {projects.map((project) => (
          <div key={project.id} className="p-3 rounded-lg bg-white/50 border border-white/40">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{project.title}</h4>
              <span className={`px-2 py-1 rounded text-xs ${
                project.status === 'active' ? 'bg-green-100 text-green-800' :
                project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {project.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{project.type}</p>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{project.progress}%</span>
                <span>{project.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
