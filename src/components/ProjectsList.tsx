
import { Project } from '@/types/project';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProjectsHeader from './projects/ProjectsHeader';
import ProjectCard from './projects/ProjectCard';
import { mockProjects } from '@/data/projectsData';

interface ProjectsListProps {
  onProjectSelect: (project: Project) => void;
  isCompressed: boolean;
}

const ProjectsList = ({
  onProjectSelect,
  isCompressed
}: ProjectsListProps) => {
  return (
    <div className={`
      h-full bg-gradient-to-b from-gray-50 to-white rounded-2xl overflow-hidden transition-all duration-300
      ${isCompressed ? 'opacity-80 scale-98' : 'opacity-100 scale-100'}
    `}>
      <div className="h-full flex flex-col">
        <ProjectsHeader projectCount={mockProjects.length} />

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {mockProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={onProjectSelect}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ProjectsList;
