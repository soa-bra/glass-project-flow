
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🔄';
      case 'completed': return '✅';
      case 'delayed': return '⚠️';
      default: return '📋';
    }
  };

  return (
    <BaseCard variant="glass" className="p-6">
      <h3 className="text-lg font-bold text-gray-800 font-arabic mb-4">ملخص المشاريع</h3>
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center justify-between p-4 bg-white/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm">
                {getStatusIcon(project.status)}
              </div>
              <div>
                <h4 className="font-bold text-sm font-arabic">{project.title}</h4>
                <p className="text-xs text-gray-600 font-arabic">{project.type}</p>
              </div>
            </div>
            <div className="text-left">
              <div className={`px-2 py-1 rounded-full text-xs font-arabic ${getStatusColor(project.status)}`}>
                {project.progress}%
              </div>
              <p className="text-xs text-gray-500 mt-1 font-arabic">{project.date}</p>
            </div>
          </div>
        ))}
      </div>
    </BaseCard>
  );
};
