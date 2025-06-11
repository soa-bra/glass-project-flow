
import { RefreshCcw, Filter, Plus } from 'lucide-react';

const ProjectsToolbar = () => {
  return (
    <div className="flex items-center justify-between h-14 py-2 px-3 my-4">
      {/* الأيقونات يميناً */}
      <div className="flex items-center gap-3">
        <button className="w-[50px] h-[50px] rounded-full border-2 border-[#3e494c]/50 bg-transparent flex items-center justify-center transition-all duration-300 hover:bg-white/20 group">
          <RefreshCcw className="w-[19px] h-[19px] text-[#3e494c] group-hover:scale-110 transition-transform duration-300" />
        </button>
        <button className="w-[50px] h-[50px] rounded-full border-2 border-[#3e494c]/50 bg-transparent flex items-center justify-center transition-all duration-300 hover:bg-white/20 group">
          <Filter className="w-[19px] h-[19px] text-[#3e494c] group-hover:scale-110 transition-transform duration-300" />
        </button>
        <button className="w-[50px] h-[50px] rounded-full border-2 border-[#3e494c]/50 bg-transparent flex items-center justify-center transition-all duration-300 hover:bg-white/20 group">
          <Plus className="w-[19px] h-[19px] text-[#3e494c] group-hover:scale-110 transition-transform duration-300" />
        </button>
      </div>

      {/* العنوان يساراً */}
      <h2 className="font-medium text-[#2A3437] font-arabic text-3xl">
        المشاريع
      </h2>
    </div>
  );
};

export default ProjectsToolbar;
