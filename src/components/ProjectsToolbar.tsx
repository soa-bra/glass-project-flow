import { RefreshCcw, Filter, Plus } from 'lucide-react';
type ProjectsToolbarProps = {
  onAddProject?: () => void;
};
const ProjectsToolbar: React.FC<ProjectsToolbarProps> = ({
  onAddProject
}) => {
  return <div className="flex items-center justify-between h-14 py-[24px] px-3 my-[24px]">
      {/* العنوان يميناً */}
      <h2 className="font-medium text-[#2A3437] font-arabic text-3xl">
        المشاريع
      </h2>

      {/* الأيقونات يساراً */}
      
    </div>;
};
export default ProjectsToolbar;