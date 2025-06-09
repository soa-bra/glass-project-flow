
import { Project } from '@/types/project';
import { Users, Calendar, CheckSquare, TrendingUp } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#10B981';
      case 'warning':
        return '#F59E0B';
      case 'error':
        return '#EF4444';
      case 'neutral':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getRandomDays = () => Math.floor(Math.random() * 30) + 1;
  const getRandomTasks = () => Math.floor(Math.random() * 20) + 1;
  const getRandomProgress = () => Math.floor(Math.random() * 100);

  const daysLeft = getRandomDays();
  const tasksCount = getRandomTasks();
  const progress = getRandomProgress();

  return (
    <div
      onClick={() => onClick(project)}
      className="group relative bg-white rounded-xl p-5 cursor-pointer shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Progress bar at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 rounded-t-xl overflow-hidden">
        <div 
          className="h-full transition-all duration-1000 ease-out"
          style={{ 
            width: `${progress}%`,
            backgroundColor: project.phaseColor 
          }}
        />
      </div>
      
      {/* Header with title and status */}
      <div className="flex items-start justify-between mb-4 pt-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>{project.assignee}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div 
            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: getStatusColor(project.status) }}
          />
          <span className="text-sm font-bold text-gray-800">
            {parseInt(project.value).toLocaleString()} ر.س
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Calendar className="w-3 h-3" />
          <span>{daysLeft} يوم</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <CheckSquare className="w-3 h-3" />
          <span>{tasksCount} مهمة</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <TrendingUp className="w-3 h-3" />
          <span>{progress}%</span>
        </div>
      </div>

      {/* Phase badge */}
      <div className="flex items-center justify-between">
        <span 
          className="text-xs px-3 py-1 rounded-full text-white font-medium shadow-sm"
          style={{ backgroundColor: project.phaseColor }}
        >
          {project.phase}
        </span>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="text-xs text-blue-600 font-medium">عرض التفاصيل ←</div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
