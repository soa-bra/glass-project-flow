
import React from 'react';
import { X, ChevronRight } from 'lucide-react';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface ProjectBoardHeaderProps {
  project: ProjectCardProps;
  onClose: () => void;
}

const stages = ['التخطيط', 'التطوير', 'المراجعة', 'التسليم'];

export const ProjectBoardHeader: React.FC<ProjectBoardHeaderProps> = ({ project, onClose }) => {
  const getStatusColor = (status: string) => {
    const colors = {
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    };
    return colors[status as keyof typeof colors] || colors.info;
  };

  const currentStage = 1; // This should come from project data

  return (
    <div className="flex items-center justify-between p-6 border-b border-white/20">
      <div className="flex-1">
        {/* Project Title */}
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-2xl font-bold font-arabic text-white">
            {project.title}
          </h1>
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getStatusColor(project.status) }}
          />
        </div>

        {/* Stage Stepper */}
        <div className="flex items-center gap-2 mb-3">
          {stages.map((stage, index) => (
            <React.Fragment key={stage}>
              <div className={`
                px-3 py-1 rounded-full text-sm font-arabic transition-all duration-300
                ${index <= currentStage 
                  ? 'bg-white/40 text-white border border-white/60' 
                  : 'bg-white/10 text-white/60 border border-white/20'
                }
              `}>
                {stage}
              </div>
              {index < stages.length - 1 && (
                <ChevronRight 
                  size={16} 
                  className={index < currentStage ? 'text-white' : 'text-white/40'} 
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Meta Badges */}
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-white/30 rounded-full text-sm text-white font-arabic">
            {project.daysLeft} يوم متبقي
          </span>
          <span className="px-3 py-1 bg-white/30 rounded-full text-sm text-white font-arabic">
            {project.tasksCount} مهام
          </span>
          <span className="px-3 py-1 bg-white/30 rounded-full text-sm text-white font-arabic">
            {project.value}
          </span>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 text-white"
      >
        <X size={20} strokeWidth={1.5} />
      </button>
    </div>
  );
};
