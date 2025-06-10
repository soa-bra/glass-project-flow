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
  return <div onClick={handleClick} className={`w-full bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm mx-auto my-3 p-4 cursor-pointer transition-all duration-300 ${isSelected ? 'ring-2 ring-[#0099FF]/70' : 'hover:bg-white/75'} ${isOtherSelected ? 'opacity-50' : 'opacity-100'}`}>
      {/* الصف العلوي - عدد الأيام والعنوان وعدد المهام */}
      <div className="flex items-center justify-between mb-4">
        {/* عدد الأيام - دائرة على اليسار */}
        <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex flex-col items-center justify-center bg-white/80">
          <span className="text-sm font-bold text-gray-800 leading-none">
            {daysLeft.toString().padStart(2, '0')}
          </span>
          <span className="text-xs text-gray-600 leading-none">
            يوم
          </span>
        </div>

        {/* العنوان والوصف في المنتصف */}
        <div className="flex-1 text-center mx-[9px] px-[5px]">
          <h3 className="text-lg font-bold text-gray-900 mb-1 font-arabic text-right">
            {title}
          </h3>
          <p className="font-arabic text-right text-[soabra-status-success] text-cyan-800">
            {description}
          </p>
        </div>

        {/* عدد المهام - دائرة على اليمين */}
        <div className="w-16 h-16 rounded-full bg-gray-400 flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-white leading-none">
            {tasksCount.toString().padStart(2, '0')}
          </span>
          <span className="text-xs text-white leading-none">
            مهام
          </span>
        </div>
      </div>

      {/* الصف السفلي - حالة المشروع والتاريخ والمكلف والقيمة */}
      <div className="flex items-center justify-between">
        {/* حالة المشروع - دائرة ملونة */}
        <div className="w-12 h-12 rounded-full" style={{
        backgroundColor: statusColors[status]
      }}></div>

        {/* التاريخ */}
        <div className="px-4 py-2 bg-white/60 rounded-full">
          <span className="text-sm text-gray-700 font-arabic">{date}</span>
        </div>

        {/* المكلف */}
        <div className="px-4 py-2 bg-white/60 rounded-full">
          <span className="text-sm text-gray-700 font-arabic">{owner}</span>
        </div>

        {/* القيمة */}
        <div className="px-4 py-2 bg-white/60 rounded-full">
          <span className="text-sm text-gray-700 font-arabic">{value}</span>
        </div>
      </div>
    </div>;
};
export default ProjectCard;