
import React, { useState } from 'react';
import { RefreshCcw, Filter, Plus } from 'lucide-react';
import { ProjectsFilterDialog, ProjectFilterOptions } from './custom/ProjectsFilterDialog';

type ProjectsToolbarProps = {
  onAddProject?: () => void;
  onApplyFilter?: (filters: ProjectFilterOptions) => void;
};

const ProjectsToolbar: React.FC<ProjectsToolbarProps> = ({ onAddProject, onApplyFilter }) => {
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const handleFilterClick = () => {
    setIsFilterDialogOpen(true);
  };

  const handleApplyFilter = (filters: ProjectFilterOptions) => {
    onApplyFilter?.(filters);
  };
  return (
    <div className="flex items-center justify-between h-14 py-[24px] px-3 my-[24px]">
      {/* العنوان يميناً */}
      <h2 className="font-medium text-[#2A3437] font-arabic text-3xl">
        المشاريع
      </h2>

      {/* الأيقونات يساراً */}
      <div className="flex items-center gap-3">
        <button className="w-[50px] h-[50px] rounded-full border-2 border-[#3e494c]/50 bg-transparent flex items-center justify-center transition-all duration-300 hover:bg-white/20 group">
          <RefreshCcw className="w-[19px] h-[19px] text-[#3e494c] group-hover:scale-110 transition-transform duration-300" />
        </button>
        <button 
          onClick={handleFilterClick}
          className="w-[50px] h-[50px] rounded-full border-2 border-[#3e494c]/50 bg-transparent flex items-center justify-center transition-all duration-300 hover:bg-white/20 group"
        >
          <Filter className="w-[19px] h-[19px] text-[#3e494c] group-hover:scale-110 transition-transform duration-300" />
        </button>
        <button 
          onClick={onAddProject}
          className="w-[50px] h-[50px] rounded-full border-2 border-[#3e494c]/50 bg-transparent flex items-center justify-center transition-all duration-300 hover:bg-white/20 group"
          title="إضافة مشروع جديد"
        >
          <Plus className="w-[19px] h-[19px] text-[#3e494c] group-hover:scale-110 transition-transform duration-300" />
        </button>
      </div>

      <ProjectsFilterDialog
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        onApplyFilter={handleApplyFilter}
      />
    </div>
  );
};

export default ProjectsToolbar;
