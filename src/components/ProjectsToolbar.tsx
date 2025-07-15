
import { RefreshCcw, Filter, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { ProjectFilterModal } from './ProjectFilterModal';

type ProjectsToolbarProps = {
  onAddProject?: () => void;
};

const ProjectsToolbar: React.FC<ProjectsToolbarProps> = ({ onAddProject }) => {
  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleRefreshProjects = () => {
    console.log('تم تحديث قائمة المشاريع');
    // تحديث البيانات دون إعادة تحميل الصفحة
    window.dispatchEvent(new CustomEvent('refreshProjects'));
  };

  const handleApplyFilters = (filters: any) => {
    console.log('تم تطبيق فلاتر المشاريع:', filters);
    // يمكن إضافة منطق تطبيق الفلاتر هنا
  };

  return (
    <div className="flex items-center justify-between h-14 py-[24px] px-3 my-[24px]">
      {/* العنوان يميناً */}
      <h2 className="font-medium text-[#2A3437] font-arabic text-3xl">
        المشاريع
      </h2>

      {/* الأيقونات يساراً */}
      <div className="flex items-center gap-3">
        <button 
          className="w-[50px] h-[50px] rounded-full border-2 border-[#3e494c]/50 bg-transparent flex items-center justify-center transition-all duration-300 hover:bg-white/20 group"
          onClick={handleRefreshProjects}
          title="تحديث المشاريع"
        >
          <RefreshCcw className="w-[19px] h-[19px] text-[#3e494c] group-hover:scale-110 transition-transform duration-300" />
        </button>
        <button 
          className="w-[50px] h-[50px] rounded-full border-2 border-[#3e494c]/50 bg-transparent flex items-center justify-center transition-all duration-300 hover:bg-white/20 group"
          onClick={() => setShowFilterModal(true)}
          title="فلترة المشاريع"
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
      
      <ProjectFilterModal 
        isOpen={showFilterModal} 
        onClose={() => setShowFilterModal(false)} 
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default ProjectsToolbar;
