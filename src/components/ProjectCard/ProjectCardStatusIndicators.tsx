
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
        return '#10B981';
      case 'warning':
        return '#F59E0B';
      case 'error':
        return '#EF4444';
      case 'info':
      default:
        return '#3B82F6';
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
          {formattedDate}
        </span>
      </div>

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
