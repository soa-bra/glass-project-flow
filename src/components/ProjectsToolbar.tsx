
import { RefreshCcw, Filter, Plus } from 'lucide-react';

const ProjectsToolbar = () => {
  return (
    <div className="flex items-center justify-between h-12 py-2 px-1 my-2">
      {/* العنوان يميناً */}
      <h2 className="font-extrabold text-[#23272f] font-arabic text-2xl"
          style={{ letterSpacing: '0.015em', fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif' }}>
        المشاريع
      </h2>
      {/* الأيقونات يساراً */}
      <div className="flex items-center gap-1">
        <button className="w-10 h-10 rounded-full border-2 border-[#3e494c]/40 bg-white/25 flex items-center justify-center transition-all hover:bg-white/35 group"
          style={{ boxShadow: '0 2px 11px rgba(115,129,165,0.10)' }}>
          <RefreshCcw className="w-5 h-5 text-[#3e494c] group-hover:scale-110 transition-transform" />
        </button>
        <button className="w-10 h-10 rounded-full border-2 border-[#3e494c]/40 bg-white/25 flex items-center justify-center transition-all hover:bg-white/35 group"
          style={{ boxShadow: '0 2px 11px rgba(115,129,165,0.10)' }}>
          <Filter className="w-5 h-5 text-[#3e494c] group-hover:scale-110 transition-transform" />
        </button>
        <button className="w-10 h-10 rounded-full border-2 border-[#3e494c]/40 bg-white/25 flex items-center justify-center transition-all hover:bg-white/35 group"
          style={{ boxShadow: '0 2px 11px rgba(115,129,165,0.10)' }}>
          <Plus className="w-5 h-5 text-[#3e494c] group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default ProjectsToolbar;
