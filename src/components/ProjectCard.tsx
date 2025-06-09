
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
      {/* الصف العلوي - العنوان والوصف مع دائرة المهام */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-soabra-text-primary font-arabic leading-tight mb-1">
            {title}
          </h3>
          <p className="text-sm text-soabra-primary-blue font-arabic leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* دائرة عدد المهام */}
        <div className="w-10 h-10 rounded-full bg-soabra-text-secondary/20 flex flex-col items-center justify-center flex-shrink-0 ml-3">
          <span className="text-xs font-bold text-soabra-text-primary leading-none">
            {tasksCount.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] font-medium text-soabra-text-primary leading-none">
            مهام
          </span>
        </div>
      </div>

      {/* الصف السفلي - العد التنازلي ونقطة الحالة والمعلومات */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
        {/* دائرة العد التنازلي */}
        <div className="w-12 h-12 rounded-full border-2 border-soabra-text-secondary/40 flex flex-col items-center justify-center bg-white/20 flex-shrink-0">
          <span className="text-sm font-bold text-soabra-text-primary leading-none">
            {daysLeft}
          </span>
          <span className="text-[10px] font-medium text-soabra-text-primary leading-none">
            يوم
          </span>
        </div>

        {/* المنطقة المتوسطة - نقطة الحالة */}
        <div className="flex-1 flex justify-center">
          <div 
            className="w-6 h-6 rounded-full flex-shrink-0" 
            style={{backgroundColor: statusColors[status]}}
          ></div>
        </div>

        {/* المعلومات على اليمين */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Badge 
            variant="outline" 
            className="h-6 px-2 bg-white/30 backdrop-blur-sm border-white/40 text-[10px] text-soabra-text-secondary font-arabic"
          >
            {date}
          </Badge>
          <Badge 
            variant="outline" 
            className="h-6 px-2 bg-white/30 backdrop-blur-sm border-white/40 text-[10px] text-soabra-text-secondary font-arabic"
          >
            {owner}
          </Badge>
          <Badge 
            variant="outline" 
            className={`h-6 px-2 bg-white/30 backdrop-blur-sm border-white/40 text-[10px] font-arabic ${
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
