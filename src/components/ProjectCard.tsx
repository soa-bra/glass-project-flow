
import { Badge } from '@/components/ui/badge';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  daysLeft: number;
  tasksCount: number;
  status: 'success' | 'warning' | 'error' | 'info';
  date: string;
  owner: string;
  value: string;
  isOverBudget?: boolean;
  hasOverdueTasks?: boolean;
  onProjectSelect?: (projectId: string) => void;
}

const statusColors = {
  success: '#5DDC82',
  warning: '#ECFF8C',
  error: '#F23D3D',
  info: '#9DCBFF'
};

const ProjectCard = ({
  id,
  title,
  description,
  daysLeft,
  tasksCount,
  status,
  date,
  owner,
  value,
  isOverBudget = false,
  hasOverdueTasks = false,
  onProjectSelect
}: ProjectCardProps) => {
  const handleClick = () => {
    onProjectSelect?.(id);
  };

  return (
    <div 
      onClick={handleClick} 
      className="relative w-full h-[120px] bg-white/40 backdrop-blur-[20px] rounded-xl border border-white/25 shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-4 cursor-pointer transition-all duration-300 hover:bg-white/50 hover:shadow-[0_16px_48px_rgba(0,0,0,0.15)] active:ring-1 active:ring-soabra-primary-blue group project-card"
    >
      {/* العنوان الرئيسي */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-semibold text-soabra-text-primary font-arabic leading-tight">
          {title}
        </h3>
        
        {/* دائرة عدد المهام */}
        <div className="w-12 h-12 rounded-full bg-soabra-text-secondary/20 flex flex-col items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-soabra-text-primary leading-none">
            {tasksCount.toString().padStart(2, '0')}
          </span>
          <span className="text-xs font-medium text-soabra-text-primary leading-none">
            مهام
          </span>
        </div>
      </div>

      {/* الوصف */}
      <p className="text-base text-soabra-primary-blue font-arabic mb-4 leading-relaxed">
        {description}
      </p>

      {/* الصف السفلي */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        {/* دائرة العد التنازلي */}
        <div className="w-14 h-14 rounded-full border-2 border-soabra-text-secondary/40 flex flex-col items-center justify-center bg-white/20 flex-shrink-0">
          <span className="text-sm font-bold text-soabra-text-primary leading-none">
            {daysLeft}
          </span>
          <span className="text-xs font-medium text-soabra-text-primary leading-none">
            يوم
          </span>
        </div>

        {/* نقطة الحالة */}
        <div 
          className="w-8 h-8 rounded-full flex-shrink-0" 
          style={{backgroundColor: statusColors[status]}}
        ></div>

        {/* المعلومات */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge 
            variant="outline" 
            className="h-8 px-3 bg-white/30 backdrop-blur-sm border-white/40 text-xs text-soabra-text-secondary font-arabic"
          >
            {date}
          </Badge>
          <Badge 
            variant="outline" 
            className="h-8 px-3 bg-white/30 backdrop-blur-sm border-white/40 text-xs text-soabra-text-secondary font-arabic"
          >
            {owner}
          </Badge>
          <Badge 
            variant="outline" 
            className={`h-8 px-3 bg-white/30 backdrop-blur-sm border-white/40 text-xs font-arabic ${
              isOverBudget ? 'text-soabra-error' : 'text-soabra-text-secondary'
            }`}
          >
            {value}
          </Badge>
        </div>
      </div>

      {/* مثلث المهام المتأخرة */}
      {hasOverdueTasks && (
        <div className="absolute top-0 left-0 w-0 h-0 border-t-[12px] border-t-soabra-status-error border-r-[12px] border-r-transparent rounded-tl-xl"></div>
      )}
    </div>
  );
};

export default ProjectCard;
