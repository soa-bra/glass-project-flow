import React, { useState } from 'react';
import { ArrowUpDown, Filter, Plus } from 'lucide-react';
import { ProjectsFilterDialog, ProjectFilterOptions } from './custom/ProjectsFilterDialog';
import { ProjectsSortDialog, ProjectSortOptions } from './custom/ProjectsSortDialog';
type ProjectsToolbarProps = {
  onAddProject?: () => void;
  onApplyFilter?: (filters: ProjectFilterOptions) => void;
  onApplySort?: (sortOptions: ProjectSortOptions) => void;
};
const ProjectsToolbar: React.FC<ProjectsToolbarProps> = ({
  onAddProject,
  onApplyFilter,
  onApplySort
}) => {
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isSortDialogOpen, setIsSortDialogOpen] = useState(false);
  
  const handleFilterClick = () => {
    setIsFilterDialogOpen(true);
  };
  
  const handleSortClick = () => {
    setIsSortDialogOpen(true);
  };
  
  const handleApplyFilter = (filters: ProjectFilterOptions) => {
    onApplyFilter?.(filters);
  };
  
  const handleApplySort = (sortOptions: ProjectSortOptions) => {
    onApplySort?.(sortOptions);
  };
  return <div className="flex items-center justify-between h-14 py-[24px] px-3 my-[24px]">
      {/* العنوان يميناً */}
      <h2 className="font-medium text-[#2A3437] font-arabic text-3xl">
        المشاريع
      </h2>

      {/* الأيقونات يساراً */}
      <div className="flex items-center gap-3">
        <button onClick={handleSortClick} className="w-[50px] h-[50px]  bg-transparent border border-black rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/20 group">
          <ArrowUpDown className="w-[15px] h-[15px] text-[#3e494c] group-hover:scale-110 transition-transform duration-300" />
        </button>
        <button onClick={handleFilterClick} className="w-[50px] h-[50px] w-[50px] h-[50px]  bg-transparent border border-black rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/20 group flex items-center justify-center transition-all duration-300 hover:bg-white/20 group">
          <Filter className="w-[15px] h-[15px] text-[#3e494c] group-hover:scale-110 transition-transform duration-300" />
        </button>
        <button onClick={onAddProject} title="إضافة مشروع جديد" className="w-[50px] h-[50px]  bg-transparent border border-black rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/20 group">
          <Plus className="w-[15px] h-[15px] text-[#3e494c] group-hover:scale-110 transition-transform duration-300" />
        </button>
      </div>

      <ProjectsFilterDialog isOpen={isFilterDialogOpen} onClose={() => setIsFilterDialogOpen(false)} onApplyFilter={handleApplyFilter} />
      <ProjectsSortDialog isOpen={isSortDialogOpen} onClose={() => setIsSortDialogOpen(false)} onApplySort={handleApplySort} />
    </div>;
};
export default ProjectsToolbar;