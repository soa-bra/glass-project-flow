
import { RefreshCcw, Plus, ArrowUpDown } from 'lucide-react';

interface ProjectsListHeaderProps {
  projectCount: number;
}

const ProjectsListHeader = ({ projectCount }: ProjectsListHeaderProps) => {
  return (
    <div className="p-6 border-b border-white/20 bg-white/20 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-gray-800">المشاريع</h2>
        <div className="flex items-center gap-3">
          <button className="p-3 hover:bg-white/30 rounded-2xl transition-all duration-300 group border border-white/20">
            <RefreshCcw className="w-5 h-5 text-gray-700 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          <button className="p-3 hover:bg-white/30 rounded-2xl transition-all duration-300 group border border-white/20">
            <ArrowUpDown className="w-5 h-5 text-gray-700 group-hover:scale-110 transition-transform duration-300" />
          </button>
          <button className="p-3 hover:bg-white/30 rounded-2xl transition-all duration-300 group border border-white/20">
            <Plus className="w-5 h-5 text-gray-700 group-hover:scale-110 transition-transform duration-300" />
          </button>
        </div>
      </div>
      <div className="text-lg font-medium text-gray-700">
        {projectCount} مشروع نشط
      </div>
    </div>
  );
};

export default ProjectsListHeader;
