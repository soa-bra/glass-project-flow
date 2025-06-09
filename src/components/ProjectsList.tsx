
import { Project } from '@/pages/Index';
import { ScrollArea } from '@/components/ui/scroll-area';
import { projectsData } from '@/data/projectsData';
import ProjectsListHeader from '@/components/ProjectsListHeader';
import ProjectCard from '@/components/ProjectCard';

interface ProjectsListProps {
  onProjectSelect: (project: Project) => void;
  isCompressed: boolean;
  selectedProjectId?: string;
}

const ProjectsList = ({
  onProjectSelect,
  isCompressed,
  selectedProjectId
}: ProjectsListProps) => {
  return (
    <div 
      className="h-full rounded-3xl shadow-2xl border border-white/30 overflow-hidden backdrop-blur-xl"
      style={{
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <ProjectsListHeader projectCount={projectsData.length} />

        {/* Projects List with Scroll */}
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {projectsData.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                isSelected={selectedProjectId === project.id}
                isCompressed={isCompressed}
                onSelect={onProjectSelect}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ProjectsList;
