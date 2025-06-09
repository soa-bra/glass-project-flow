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
  return <div onClick={handleClick} style={{
    backgroundImage: `
          radial-gradient(circle at 2px 2px, rgba(0,0,0,0.015) 1px, transparent 0),
          linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%)
        `,
    backgroundSize: '24px 24px, 12px 12px'
  }} className="relative w-[90%] h-20 bg-soabra-card-bg rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] p-3 flex items-center gap-3 cursor-pointer transition-all duration-300 hover:bg-white/25 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] active:ring-1 active:ring-soabra-primary-blue group project-card py-0 my-0 px-[10px]">
      {/* مثلث المهام المتأخرة */}
      {hasOverdueTasks && <div className="absolute top-0 left-0 w-0 h-0 border-t-[10px] border-t-[#F23D3D] border-r-[10px] border-r-transparent rounded-tl-xl"></div>}

      {/* دائرة العد التنازلي */}
      <div className="w-14 h-14 rounded-full border-2 border-[#7d8a8c] flex flex-col items-center justify-center bg-white/10 flex-shrink-0">
        <span className="text-xs font-medium text-soabra-text-primary leading-none">{daysLeft}</span>
        <span className="text-xs font-medium text-soabra-text-primary leading-none">يوم</span>
      </div>

      {/* محتوى النص */}
      <div className="flex-1 flex flex-col justify-center gap-1 min-w-0 mx-3">
        <h3 className="text-lg font-medium text-[#2A3437] truncate font-arabic">
          {title}
        </h3>
        <p className="text-sm text-[#007b8c] truncate font-arabic">
          {description}
        </p>
      </div>

      {/* دائرة عدد المهام */}
      <div className="w-16 h-16 rounded-full bg-[#c5d1d6] flex flex-col items-center justify-center flex-shrink-0">
        <span className="text-sm font-bold text-black leading-none">{tasksCount.toString().padStart(2, '0')}</span>
        <span className="text-xs font-bold text-black leading-none">مهام</span>
      </div>

      {/* سطر القيم السفلية */}
      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* نقطة حالة المشروع */}
          <div className="w-6 h-6 rounded-full" style={{
          backgroundColor: statusColors[status]
        }}></div>

          {/* شارات المعلومات */}
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="h-[34px] min-w-[70px] px-2 bg-white/30 backdrop-blur-sm border-white/40 text-xs text-soabra-text-secondary font-arabic">
              {date}
            </Badge>
            <Badge variant="outline" className="h-[34px] min-w-[110px] px-2 bg-white/30 backdrop-blur-sm border-white/40 text-xs text-soabra-text-secondary font-arabic">
              {owner}
            </Badge>
            <Badge variant="outline" className={`h-[34px] min-w-[70px] px-2 bg-white/30 backdrop-blur-sm border-white/40 text-xs font-arabic ${isOverBudget ? 'text-[#EF4444]' : 'text-soabra-text-secondary'}`}>
              {value}
            </Badge>
          </div>
        </div>
      </div>
    </div>;
};
export default ProjectCard;