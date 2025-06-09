
import { Project } from '@/pages/Index';
import { getStatusColor } from '@/utils/projectUtils';

interface ProjectCardProps {
  project: Project;
  index: number;
  isSelected: boolean;
  isCompressed: boolean;
  onSelect: (project: Project) => void;
}

const ProjectCard = ({ 
  project, 
  index, 
  isSelected, 
  isCompressed, 
  onSelect 
}: ProjectCardProps) => {
  return (
    <div
      onClick={() => onSelect(project)}
      className={`relative cursor-pointer hover:scale-[1.02] transition-all duration-300 ${
        isSelected && isCompressed ? 'opacity-100 scale-[1.02]' : 
        isCompressed ? 'opacity-60' : 'opacity-100'
      }`}
      style={{
        animationDelay: `${index * 0.1}s`,
        animation: 'fadeInUp 0.6s ease-out both'
      }}
    >
      <div 
        className="rounded-3xl p-6 border border-white/30 backdrop-blur-sm hover:shadow-2xl transition-all duration-500"
        style={{
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          minHeight: '160px',
        }}
      >
        {/* Top Row - Days Left and Tasks */}
        <div className="flex items-start justify-between mb-4">
          {/* Days Left Circle */}
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-white shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${project.phaseColor}, ${project.phaseColor}dd)`,
              boxShadow: `0 4px 15px ${project.phaseColor}40`
            }}
          >
            <div className="text-center">
              <div className="text-xl">{project.daysLeft}</div>
              <div className="text-xs opacity-80">يوم</div>
            </div>
          </div>

          {/* Tasks Count */}
          <div className="bg-white/60 rounded-2xl px-4 py-2 border border-white/40 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">{project.tasksCount}</div>
              <div className="text-xs text-gray-600">مهمة</div>
            </div>
          </div>
        </div>

        {/* Project Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight">
          {project.title}
        </h3>

        {/* Project Description */}
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Bottom Row - Manager, Budget, Status */}
        <div className="flex items-center justify-between">
          {/* Project Manager */}
          <div className="bg-white/60 rounded-2xl px-4 py-2 border border-white/40 backdrop-blur-sm">
            <span className="text-sm font-medium text-gray-700">
              {project.assignee}
            </span>
          </div>

          {/* Budget */}
          <div className="bg-white/60 rounded-2xl px-4 py-2 border border-white/40 backdrop-blur-sm">
            <span className="text-sm font-bold text-gray-800">
              {parseInt(project.value).toLocaleString()} ر.س
            </span>
          </div>

          {/* Status Indicator */}
          <div 
            className="w-12 h-12 rounded-full shadow-lg border-4 border-white"
            style={{ 
              backgroundColor: getStatusColor(project.status),
              boxShadow: `0 0 20px ${getStatusColor(project.status)}40`
            }}
          />
        </div>

        {/* Phase Badge */}
        <div className="absolute top-4 left-4">
          <div 
            className="px-3 py-1 rounded-full text-white text-xs font-medium shadow-lg"
            style={{ 
              backgroundColor: project.phaseColor,
              boxShadow: `0 2px 10px ${project.phaseColor}40`
            }}
          >
            {project.phase}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
