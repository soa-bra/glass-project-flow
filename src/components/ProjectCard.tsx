
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

const statusGlow = {
  success: 'rgba(93, 220, 130, 0.4)',
  warning: 'rgba(236, 255, 140, 0.4)',
  error: 'rgba(242, 61, 61, 0.4)',
  info: 'rgba(157, 203, 255, 0.4)'
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
      className={`
        relative w-full bg-white/60 backdrop-blur-[20px] rounded-2xl shadow-sm mx-auto my-1 p-3 
        cursor-pointer transition-all duration-700 ease-out transform overflow-hidden
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent 
        before:opacity-0 before:transition-opacity before:duration-500 before:pointer-events-none
        hover:before:opacity-100
        ${isSelected 
          ? 'ring-2 ring-[#0099FF]/60 scale-[1.02] shadow-lg shadow-blue-200/40 bg-white/70' 
          : 'hover:bg-white/75 hover:scale-[1.01] hover:shadow-md hover:shadow-blue-100/20'
        } 
        ${isOtherSelected ? 'opacity-60 scale-[0.98]' : 'opacity-100'}
      `}
      style={{
        transformOrigin: 'center',
        boxShadow: isSelected 
          ? `0 8px 32px rgba(0, 153, 255, 0.15), 0 4px 16px rgba(0, 153, 255, 0.1)` 
          : undefined
      }}
    >
      {/* طبقة توهج خفيفة للكارت المحدد */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-blue-100/30 rounded-2xl pointer-events-none" />
      )}

      {/* الصف العلوي - عدد الأيام والعنوان وعدد المهام */}
      <div className="flex items-center justify-between mb-3 px-0 relative z-10">
        {/* عدد الأيام - دائرة على اليسار */}
        <div className={`
          w-16 h-16 rounded-full border-2 border-gray-300 flex flex-col items-center justify-center 
          bg-white/80 backdrop-blur-sm px-0 mx-0 transition-all duration-500 ease-out relative
          before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/40 before:to-transparent 
          before:opacity-0 before:transition-opacity before:duration-300
          hover:before:opacity-100
          ${isSelected 
            ? 'border-[#0099FF]/60 bg-blue-50/90 shadow-md shadow-blue-200/30 animate-pulse' 
            : 'hover:shadow-lg hover:scale-105'
          }
        `}>
          <span className={`
            text-sm font-bold leading-none transition-all duration-500 relative z-10
            ${isSelected ? 'text-[#0099FF] animate-bounce' : 'text-gray-800'}
          `}>
            {daysLeft.toString().padStart(2, '0')}
          </span>
          <span className={`
            text-xs leading-none transition-colors duration-500 relative z-10
            ${isSelected ? 'text-[#0099FF]/80' : 'text-gray-600'}
          `}>
            يوم
          </span>
        </div>

        {/* العنوان والوصف في المنتصف */}
        <div className="flex-1 text-center mx-[9px] px-[15px] relative">
          <h3 className={`
            text-lg font-bold mb-1 font-arabic text-right transition-all duration-500
            ${isSelected 
              ? 'text-[#0099FF] animate-shimmer bg-gradient-to-r from-[#0099FF] via-blue-400 to-[#0099FF] bg-clip-text text-transparent bg-200% animate-[shimmer_2s_ease-in-out_infinite]' 
              : 'text-gray-900'
            }
          `}>
            {title}
          </h3>
          <p className={`
            font-arabic text-right transition-all duration-500
            ${isSelected ? 'text-[#0099FF]/70' : 'text-cyan-800'}
          `}>
            {description}
          </p>
        </div>

        {/* عدد المهام - دائرة على اليمين */}
        <div className={`
          w-16 h-16 rounded-full flex flex-col items-center justify-center 
          transition-all duration-500 ease-out relative overflow-hidden
          before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/20 before:to-transparent 
          before:opacity-0 before:transition-opacity before:duration-300
          ${isSelected 
            ? 'bg-[#0099FF] shadow-lg shadow-blue-300/40 animate-glow scale-110' 
            : 'bg-gray-400 hover:bg-gray-500 hover:scale-105 hover:before:opacity-100'
          }
        `}>
          <span className="text-sm font-bold text-white leading-none relative z-10">
            {tasksCount.toString().padStart(2, '0')}
          </span>
          <span className="text-xs text-white leading-none relative z-10">
            مهام
          </span>
          {isSelected && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 opacity-30 animate-pulse" />
          )}
        </div>
      </div>

      {/* الصف السفلي - حالة المشروع والتاريخ والمكلف والقيمة */}
      <div className="flex items-center justify-between my-0 py-0 px-0 mx-0 relative z-10">
        {/* حالة المشروع - دائرة ملونة */}
        <div 
          style={{ 
            backgroundColor: statusColors[status],
            boxShadow: isSelected 
              ? `0 0 20px ${statusGlow[status]}, 0 0 40px ${statusGlow[status]}` 
              : `0 4px 8px ${statusColors[status]}30`
          }}
          className={`
            w-12 h-12 rounded-full px-0 mx-[13px] transition-all duration-500 ease-out relative
            before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/30 before:to-transparent 
            before:opacity-0 before:transition-opacity before:duration-300
            hover:before:opacity-100
            ${isSelected 
              ? 'shadow-lg transform scale-110 animate-pulse' 
              : 'hover:scale-105 hover:shadow-lg'
            }
          `}
        >
          {isSelected && (
            <div 
              className="absolute inset-0 rounded-full animate-ping"
              style={{ backgroundColor: `${statusColors[status]}40` }}
            />
          )}
        </div>

        {/* التاريخ */}
        <div className={`
          bg-white/60 backdrop-blur-sm rounded-full py-0 mx-[26px] px-[10px] 
          transition-all duration-500 ease-out relative
          before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/40 before:to-transparent 
          before:opacity-0 before:transition-opacity before:duration-300
          hover:before:opacity-100
          ${isSelected 
            ? 'bg-blue-50/90 shadow-sm scale-105' 
            : 'hover:bg-white/80 hover:scale-105'
          }
        `}>
          <span className={`
            text-sm font-arabic transition-colors duration-500 relative z-10
            ${isSelected ? 'text-[#0099FF] font-semibold' : 'text-gray-700'}
          `}>
            {date}
          </span>
        </div>

        {/* المكلف */}
        <div className={`
          bg-white/60 backdrop-blur-sm rounded-full py-0 px-[11px] mx-px 
          transition-all duration-500 ease-out relative
          before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/40 before:to-transparent 
          before:opacity-0 before:transition-opacity before:duration-300
          hover:before:opacity-100
          ${isSelected 
            ? 'bg-blue-50/90 shadow-sm scale-105' 
            : 'hover:bg-white/80 hover:scale-105'
          }
        `}>
          <span className={`
            text-sm font-arabic mx-[20px] px-px transition-colors duration-500 relative z-10
            ${isSelected ? 'text-[#0099FF] font-semibold' : 'text-gray-700'}
          `}>
            {owner}
          </span>
        </div>

        {/* القيمة */}
        <div className={`
          bg-white/60 backdrop-blur-sm rounded-full my-0 py-0 mx-0 px-[20px] 
          transition-all duration-500 ease-out relative
          before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/40 before:to-transparent 
          before:opacity-0 before:transition-opacity before:duration-300
          hover:before:opacity-100
          ${isSelected 
            ? 'bg-blue-50/90 shadow-sm scale-105' 
            : 'hover:bg-white/80 hover:scale-105'
          }
        `}>
          <span className={`
            text-sm font-arabic transition-colors duration-500 relative z-10
            ${isSelected ? 'text-[#0099FF] font-semibold' : 'text-gray-700'}
          `}>
            {value}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
