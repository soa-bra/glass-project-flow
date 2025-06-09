
import { RefreshCcw, Filter, Plus } from 'lucide-react';

const ProjectsToolbar = () => {
  return (
    <div className="flex items-center justify-between h-14 px-4">
      {/* العنوان يميناً */}
      <h2 className="text-[24px] font-medium text-[#2A3437] font-arabic">
        المشاريع
      </h2>

      {/* الأيقونات يساراً */}
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-full border-2 border-[#3e494c]/50 bg-transparent flex items-center justify-center transition-all duration-300 hover:bg-white/20 group">
          <RefreshCcw className="w-4 h-4 text-[#3e494c] group-hover:scale-110 transition-transform duration-300" />
        </button>
        <button className="w-9 h-9 rounded-full border-2 border-[#3e494c]/50 bg-transparent flex items-center justify-center transition-all duration-300 hover:bg-white/20 group">
          <Filter className="w-4 h-4 text-[#3e494c] group-hover:scale-110 transition-transform duration-300" />
        </button>
        <button className="w-9 h-9 rounded-full border-2 border-[#3e494c]/50 bg-transparent flex items-center justify-center transition-all duration-300 hover:bg-white/20 group">
          <Plus className="w-4 h-4 text-[#3e494c] group-hover:scale-110 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

export default ProjectsToolbar;
