
import { RotateCcw, Plus, ArrowUpDown, Building } from 'lucide-react';

interface ProjectsHeaderProps {
  projectCount: number;
}

const ProjectsHeader = ({ projectCount }: ProjectsHeaderProps) => {
  return (
    <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
          المشاريع
        </h2>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors group">
            <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-all duration-300" />
          </button>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors group">
            <ArrowUpDown className="w-5 h-5 group-hover:scale-110 transition-all duration-300" />
          </button>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors group">
            <Plus className="w-5 h-5 group-hover:scale-110 transition-all duration-300" />
          </button>
        </div>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold">{projectCount}</div>
          <div className="text-xs opacity-80">مشروع نشط</div>
        </div>
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold">4</div>
          <div className="text-xs opacity-80">في الموعد</div>
        </div>
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold">2</div>
          <div className="text-xs opacity-80">متأخر</div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsHeader;
