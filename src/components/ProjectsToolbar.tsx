
import { Search, Calendar, RefreshCcw, Filter, Plus } from 'lucide-react';

const ProjectsToolbar = () => {
  return (
    <div className="w-full h-14 bg-transparent flex items-center justify-between px-4">
      {/* العنوان يميناً */}
      <h2 className="text-2xl font-medium text-[#2A3437] font-arabic">
        المشاريع
      </h2>

      {/* الأيقونات يساراً */}
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-full border-2 border-[#3e494c50] bg-transparent flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20">
          <RefreshCcw className="w-4 h-4 text-[#3e494c]" />
        </button>
        <button className="w-9 h-9 rounded-full border-2 border-[#3e494c50] bg-transparent flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20">
          <Filter className="w-4 h-4 text-[#3e494c]" />
        </button>
        <button className="w-9 h-9 rounded-full border-2 border-[#3e494c50] bg-transparent flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20">
          <Plus className="w-4 h-4 text-[#3e494c]" />
        </button>
      </div>
    </div>
  );
};

export default ProjectsToolbar;
