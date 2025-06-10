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
  daysLeft,
  onProjectSelect,
  isSelected = false,
  isOtherSelected = false
}: ProjectCardProps) => {
  const handleClick = () => {
    onProjectSelect?.(id);
  };
  return <div onClick={handleClick} className={`
        relative w-full bg-white/60 backdrop-blur-[20px] rounded-2xl shadow-sm mx-auto my-1 p-3 
        cursor-pointer transition-all duration-500 ease-out
        ${isSelected ? 'shadow-lg shadow-blue-200/30' : ''} 
        ${isOtherSelected ? 'opacity-50' : 'opacity-100'}
      `} style={{
    boxShadow: isSelected ? `0 0 20px rgba(0, 153, 255, 0.3), 0 4px 16px rgba(0, 153, 255, 0.1)` : undefined
  }}>
      {/* الصف العلوي - عدد الأيام والعنوان وعدد المهام */}
      <div className="flex items-center justify-between mb-3 px-0 mx-0 my-0 py-[11px]">
        {/* عدد الأيام - دائرة على اليسار */}
        <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm mx-[2px] px-[8px]">
          <span className="text-sm font-bold leading-none text-gray-800">
            {daysLeft.toString().padStart(2, '0')}
          </span>
          <span className="text-xs leading-none text-gray-600">
            يوم
          </span>
        </div>

        {/* العنوان والوصف في المنتصف */}
        <div className="flex-1 text-center mx-[9px] px-[15px]">
          <h3 className="text-lg font-bold mb-1 font-arabic text-right text-gray-900">
            {title}
          </h3>
          <p className="font-arabic text-right text-cyan-800">
            {description}
          </p>
        </div>

        {/* عدد المهام - دائرة على اليمين */}
        <div className="w-16 h-16 rounded-full flex flex-col items-center justify-center bg-soabra-secondary bg-[soabra-solid-bg] py-0 px-[22px]">
          <span className="text-sm font-bold text-white leading-none">
            {tasksCount.toString().padStart(2, '0')}
          </span>
          <span className="text-xs text-white leading-none">
            مهام
          </span>
        </div>
      </div>

      {/* الصف السفلي - حالة المشروع والتاريخ والمكلف والقيمة */}
      <div className="flex items-center justify-between my-0 py-0 px-0 mx-0">
        {/* حالة المشروع - دائرة ملونة */}
        <div style={{
        backgroundColor: statusColors[status],
        boxShadow: `0 4px 8px ${statusColors[status]}30`
      }} className="w-12 h-12 rounded-full px-0 mx-[13px]" />

        {/* التاريخ */}
        <div className="bg-white/60 backdrop-blur-sm rounded-full py-0 mx-[26px] px-[10px]">
          <span className="text-sm font-arabic text-gray-700">
            {date}
          </span>
        </div>

        {/* المكلف */}
        <div className="bg-white/60 backdrop-blur-sm rounded-full py-0 px-[11px] mx-px">
          <span className="text-sm font-arabic mx-[20px] px-px text-gray-700">
            {owner}
          </span>
        </div>

        {/* القيمة */}
        <div className="bg-white/60 backdrop-blur-sm rounded-full my-0 py-0 mx-0 px-[20px]">
          <span className="text-sm font-arabic text-gray-700">
            {value}
          </span>
        </div>
      </div>
    </div>;
};
export default ProjectCard;