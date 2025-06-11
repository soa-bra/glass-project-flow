
import GenericCard from '@/components/ui/GenericCard';
import { SoaBraBadge } from '@/components/ui/SoaBraBadge';
import { StatusDot } from '@/components/ui/StatusDot';
import { ProgressChip } from '@/components/ui/ProgressChip';
import type { ProjectCardProps } from './types';

const statusColors = {
  success: '#5DDC82',
  warning: '#ECFF8C', 
  error: '#F23D3D',
  info: '#0099FF'
};

const ProjectCard = ({
  id,
  title,
  description,
  tasksCount,
  status,
  date,
  owner,
  value,
  daysLeft
}: ProjectCardProps) => {
  const progressValue = Math.max(0, Math.min(100, (30 - daysLeft) * 3.33)); // تقدير التقدم بناءً على الأيام المتبقية

  return (
    <GenericCard
      className="mx-0 my-1"
      header={
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-[75px] h-[75px] rounded-full border-2 border-gray-300 flex flex-col items-center justify-center bg-transparent">
              <span className="text-sm font-bold leading-none text-gray-800">
                {daysLeft.toString().padStart(2, '0')}
              </span>
              <span className="text-xs leading-none text-gray-600">
                يوم
              </span>
            </div>
          </div>
          
          <div className="flex-1 text-center py-0 px-0 mx-[14px] my-[17px]">
            <h3 className="text-lg font-bold mb-1 font-arabic text-right text-gray-900 mx-0 my-0 py-0">
              {title}
            </h3>
          </div>
          
          <div className="w-[75px] h-[75px] rounded-full flex flex-col items-center justify-center bg-[#CCD4D7] px-0 py-0 my-0">
            <span className="text-sm font-bold leading-none" style={{ color: '#2A3437' }}>
              {tasksCount.toString().padStart(2, '0')}
            </span>
            <span style={{ color: '#2A3437' }} className="text-xs leading-none my-[5px] py-0">
              مهام
            </span>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center gap-2 text-sm justify-between">
          <div className="flex items-center gap-2">
            <StatusDot color={statusColors[status]} />
            <SoaBraBadge>{date}</SoaBraBadge>
          </div>
          <div className="flex items-center gap-2">
            <SoaBraBadge className="w-[110px] justify-center">{owner}</SoaBraBadge>
            <SoaBraBadge>{value}</SoaBraBadge>
          </div>
        </div>
      }
    >
      <p className="font-arabic text-right text-cyan-800 px-0 py-0 mx-px my-0">
        {description}
      </p>
    </GenericCard>
  );
};

export default ProjectCard;
