
import React from 'react';
import { Plus, Calendar, Clock, FileText, Download } from 'lucide-react';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface ProjectBoardToolbarProps {
  project: ProjectCardProps;
}

export const ProjectBoardToolbar: React.FC<ProjectBoardToolbarProps> = ({ project }) => {
  const actions = [
    { id: 'add-task', label: 'إضافة مهمة', icon: Plus },
    { id: 'generate-days', label: 'توليد أيام', icon: Calendar },
    { id: 'time-tracker', label: 'تتبع الوقت', icon: Clock },
    { id: 'documents', label: 'المستندات', icon: FileText },
    { id: 'export', label: 'تصدير', icon: Download },
  ];

  return (
    <div className="flex items-center gap-2 px-6 py-4 border-b border-white/10">
      {actions.map(action => {
        const IconComponent = action.icon;
        return (
          <button
            key={action.id}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-arabic text-white transition-all duration-200 hover:scale-105"
          >
            <IconComponent size={16} strokeWidth={1.5} />
            {action.label}
          </button>
        );
      })}
    </div>
  );
};
