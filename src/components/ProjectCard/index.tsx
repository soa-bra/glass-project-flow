
import ProjectCardDaysCircle from './ProjectCardDaysCircle';
import ProjectCardTitle from './ProjectCardTitle';
import ProjectCardTasksCircle from './ProjectCardTasksCircle';
import ProjectCardStatusIndicators from './ProjectCardStatusIndicators';

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
        cursor-pointer transition-all duration-500 ease-out
        ${isSelected ? 'shadow-lg shadow-blue-200/30' : ''} 
        ${isOtherSelected ? 'opacity-50' : 'opacity-100'}
      `} 
      style={{
        boxShadow: isSelected ? `0 0 20px rgba(0, 153, 255, 0.3), 0 4px 16px rgba(0, 153, 255, 0.1)` : undefined
      }}
    >
      {/* الصف العلوي - عدد الأيام والعنوان وعدد المهام */}
      <div className="flex items-center justify-between mb-3 px-0 mx-0 my-0 py-[11px]">
        <ProjectCardDaysCircle daysLeft={daysLeft} />
        <ProjectCardTitle title={title} description={description} />
        <ProjectCardTasksCircle tasksCount={tasksCount} />
      </div>

      {/* الصف السفلي - حالة المشروع والتاريخ والمكلف والقيمة */}
      <ProjectCardStatusIndicators 
        status={status}
        date={date}
        owner={owner}
        value={value}
      />
    </div>
  );
};

export default ProjectCard;
