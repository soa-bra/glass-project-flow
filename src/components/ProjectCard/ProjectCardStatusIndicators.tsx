
const statusColors = {
  success: 'var(--status-colors-on-plan)',
  warning: 'var(--status-colors-delayed)',
  error: 'var(--status-colors-stopped)',
  info: 'var(--status-colors-in-preparation)'
};

interface ProjectCardStatusIndicatorsProps {
  status: 'success' | 'warning' | 'error' | 'info';
  date: string;
  owner: string;
  value: string;
  teamMembersCount?: number;
}

const ProjectCardStatusIndicators = ({
  status,
  date,
  owner,
  value,
  teamMembersCount = 3
}: ProjectCardStatusIndicatorsProps) => {
  return (
    <div className="flex items-center justify-between py-0 mx-0 px-[28px] my-[24px]">
      {/* دائرة حالة المشروع - على الجانب الأيسر */}
      <div 
        style={{
          backgroundColor: statusColors[status],
          boxShadow: `0 2px 6px ${statusColors[status]}20, 0 0 12px ${statusColors[status]}15`
        }} 
        className="w-[20px] h-[20px] rounded-full my-0 py-0 px-0 mx-0" 
      />

      {/* التاريخ + المالك + القيمة - محاذاة إلى اليمين مع عنوان المشروع */}
      <div className="flex items-center gap-[3px] flex-1 justify-end mx-0 px-0">
        {/* التاريخ */}
        <div 
          className="bg-white border border-[#DADCE0] rounded-full py-[2px] flex items-center px-[15px]"
        >
          <span 
            className="text-sm font-arabic"
            style={{
              color: 'var(--project-card-elements-secondary-text)'
            }}
          >
            {date}
          </span>
        </div>

        {/* عدد أعضاء الفريق */}
        <div 
          className="bg-white border border-[#DADCE0] rounded-full py-[2px] flex items-center px-[15px]"
        >
          <span 
            className="text-sm font-arabic"
            style={{
              color: 'var(--project-card-elements-secondary-text)'
            }}
          >
            {teamMembersCount} أعضاء
          </span>
        </div>

        {/* المالك */}
        <div 
          className="bg-white border border-[#DADCE0] rounded-full justify-between flex items-center py-[2px] px-[8px] mx-[5px]"
        >
          <span 
            className="text-sm font-arabic px-[3px]"
            style={{
              color: 'var(--project-card-elements-secondary-text)'
            }}
          >
            {owner}
          </span>
        </div>

        {/* القيمة - محاذاة مع حد عنوان المشروع */}
        <div 
          className="bg-white border border-[#DADCE0] rounded-full py-[2px] px-[21px] flex items-center mr-[14px]"
        >
          <span 
            className="text-sm font-arabic"
            style={{
              color: 'var(--project-card-elements-secondary-text)'
            }}
          >
            {value}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCardStatusIndicators;
