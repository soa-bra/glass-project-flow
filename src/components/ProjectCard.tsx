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
  isSelected?: boolean;
  isOtherSelected?: boolean;
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
  tasksCount,
  status,
  date,
  owner,
  value,
  onProjectSelect,
  isSelected = false,
  isOtherSelected = false
}: ProjectCardProps) => {
  const handleClick = () => {
    onProjectSelect?.(id);
  };
  return <div onClick={handleClick} className={`w-[90%] h-[80px] bg-[#F2F2F2] rounded-xl shadow-sm mx-auto my-2 px-3 py-2 flex flex-col justify-between cursor-pointer transition-all duration-300 ${isSelected ? 'ring-2 ring-[#0099FF]/70' : 'hover:bg-white/25'} ${isOtherSelected ? 'opacity-50' : 'opacity-100'}`}>
      {/* الصف العلوي */}
      <div className="flex items-start justify-between py-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-[18px] font-medium text-[#2A3437] font-arabic truncate">
            {title}
          </h3>
          <p className="text-[14px] text-[#007B8C] font-arabic leading-4 truncate">
            {description}
          </p>
        </div>

        {/* عدد المهام */}
        <div className="w-[64px] h-[64px] bg-[#C5D1D6] rounded-full flex flex-col items-center justify-center shrink-0">
          <span className="text-[14px] font-bold text-[#2A3437] leading-none">
            {tasksCount.toString().padStart(2, '0')}
          </span>
          <span className="text-[12px] text-[#2A3437] leading-none">
            مهام
          </span>
        </div>
      </div>

      {/* الصف السفلي */}
      <div className="flex items-center justify-between mt-1">
        {/* حالة المشروع */}
        <div className="w-[36px] h-[36px] rounded-full shrink-0" style={{
        backgroundColor: statusColors[status]
      }}></div>

        {/* التاريخ */}
        <span className="glass-badge">{date}</span>

        {/* المكلف */}
        <span className="glass-badge w-[110px] justify-center">{owner}</span>

        {/* القيمة */}
        <span className="glass-badge py-[20px]">{value}</span>
      </div>
    </div>;
};
export default ProjectCard;