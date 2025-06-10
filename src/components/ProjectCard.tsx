
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

  return (
    <div 
      onClick={handleClick} 
      className={`w-full bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm mx-auto my-1 p-3 cursor-pointer transition-all duration-500 ease-in-out transform ${
        isSelected 
          ? 'ring-2 ring-[#0099FF]/70 scale-105 animate-pulse hover:scale-110' 
          : 'hover:bg-white/75 hover:scale-[1.02]'
      } ${isOtherSelected ? 'opacity-50 scale-95' : 'opacity-100'}`}
      style={{
        transformOrigin: 'center',
        animationDuration: isSelected ? '2s' : undefined
      }}
    >
      {/* الصف العلوي - عدد الأيام والعنوان وعدد المهام */}
      <div className="flex items-center justify-between mb-3 px-0">
        {/* عدد الأيام - دائرة على اليسار */}
        <div className={`w-16 h-16 rounded-full border-2 border-gray-300 flex flex-col items-center justify-center bg-white/80 px-0 mx-0 transition-all duration-300 ${
          isSelected ? 'animate-bounce border-[#0099FF]/70 bg-blue-50/80' : ''
        }`}>
          <span className="text-sm font-bold text-gray-800 leading-none">
            {daysLeft.toString().padStart(2, '0')}
          </span>
          <span className="text-xs text-gray-600 leading-none">
            يوم
          </span>
        </div>

        {/* العنوان والوصف في المنتصف */}
        <div className="flex-1 text-center mx-[9px] px-[15px]">
          <h3 className={`text-lg font-bold text-gray-900 mb-1 font-arabic text-right transition-all duration-300 ${
            isSelected ? 'text-[#0099FF] animate-pulse' : ''
          }`}>
            {title}
          </h3>
          <p className="font-arabic text-right text-[soabra-status-success] text-cyan-800">
            {description}
          </p>
        </div>

        {/* عدد المهام - دائرة على اليمين */}
        <div className={`w-16 h-16 rounded-full bg-gray-400 flex flex-col items-center justify-center transition-all duration-300 ${
          isSelected ? 'animate-bounce bg-[#0099FF] shadow-lg shadow-blue-300/50' : ''
        }`}>
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
        <div 
          style={{ backgroundColor: statusColors[status] }} 
          className={`w-12 h-12 rounded-full px-0 mx-[13px] transition-all duration-300 ${
            isSelected ? 'animate-pulse shadow-lg' : ''
          }`}
        ></div>

        {/* التاريخ */}
        <div className={`bg-white/60 rounded-full py-0 mx-[26px] px-[10px] transition-all duration-300 ${
          isSelected ? 'bg-blue-50/80 shadow-md' : ''
        }`}>
          <span className="text-sm text-gray-700 font-arabic">{date}</span>
        </div>

        {/* المكلف */}
        <div className={`bg-white/60 rounded-full py-0 px-[11px] mx-px transition-all duration-300 ${
          isSelected ? 'bg-blue-50/80 shadow-md' : ''
        }`}>
          <span className="text-sm text-gray-700 font-arabic mx-[20px] px-px">{owner}</span>
        </div>

        {/* القيمة */}
        <div className={`bg-white/60 rounded-full my-0 py-0 mx-0 px-[20px] transition-all duration-300 ${
          isSelected ? 'bg-blue-50/80 shadow-md' : ''
        }`}>
          <span className="text-sm text-gray-700 font-arabic">{value}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
