
import React from 'react';
import { X, Clock, Users, DollarSign } from 'lucide-react';
import { Project } from '@/types/project';

interface ProjectHeaderProps {
  project: Project;
  onClose: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  onClose
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-soabra-status-success';
      case 'warning': return 'bg-soabra-status-warning';
      case 'error': return 'bg-soabra-status-error';
      default: return 'bg-soabra-status-neutral';
    }
  };

  return (
    <div className="p-6 border-b border-white/20 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 ml-4">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-800">
              {project.title}
            </h1>
            <div className={`
              w-3 h-3 rounded-full ${getStatusColor(project.status)}
              shadow-sm
            `} />
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {project.description}
          </p>

          {/* شريط تقدم المشروع */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">تقدم المشروع</span>
              <span className="text-sm font-bold text-gray-800">{project.progress}%</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2 backdrop-blur-sm">
              <div 
                className="bg-gradient-to-r from-soabra-primary-blue to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {/* معلومات سريعة */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{project.daysLeft} يوم متبقي</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span>{project.team.length} عضو</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>{project.value}</span>
            </div>
          </div>
        </div>

        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="
            w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm
            flex items-center justify-center
            hover:bg-white/30 transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-white/40
          "
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
};
