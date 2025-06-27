
import { formatDateToMonthDay } from '@/utils/dateFormatter';

interface ProjectCardStatusIndicatorsProps {
  status: 'success' | 'warning' | 'error' | 'info';
  date: string;
  owner: string;
  value: string;
}

const ProjectCardStatusIndicators = ({
  status,
  date,
  owner,
  value
}: ProjectCardStatusIndicatorsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#bdeed3'; // وفق الخطة
      case 'warning':
        return '#fbe2aa'; // متأخرة
      case 'error':
        return '#f1b5b9'; // متوقفة
      case 'info':
      default:
        return '#a4e2f6'; // قيد التحضير
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'وفق الخطة';
      case 'warning':
        return 'متأخرة';
      case 'error':
        return 'متوقفة';
      case 'info':
      default:
        return 'قيد التحضير';
    }
  };

  const formattedDate = formatDateToMonthDay(date);

  return (
    <div className="flex items-center justify-between text-xs px-6 pb-4">
      {/* Status indicator */}
      <div className="flex items-center gap-2">
        <div 
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: getStatusColor(status) }}
        />
        <span 
          className="font-arabic"
          style={{ color: 'var(--project-card-elements-secondary-text)' }}
        >
          {getStatusText(status)}
        </span>
      </div>

      {/* Date */}
      <span 
        className="font-arabic"
        style={{ color: 'var(--project-card-elements-secondary-text)' }}
      >
        {formattedDate}
      </span>

      {/* Owner */}
      <span 
        className="font-arabic"
        style={{ color: 'var(--project-card-elements-secondary-text)' }}
      >
        {owner}
      </span>

      {/* Value */}
      <span 
        className="font-bold font-arabic"
        style={{ color: 'var(--project-card-elements-title-text)' }}
      >
        {value}
      </span>
    </div>
  );
};

export default ProjectCardStatusIndicators;
