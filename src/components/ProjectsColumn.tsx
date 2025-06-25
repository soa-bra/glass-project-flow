import ProjectsToolbar from './ProjectsToolbar';
import ProjectCard from './ProjectCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BulkActionsBar } from '@/components/ui/BulkActionsBar';
import React, { useState } from 'react';
import { Project } from '@/types/project';
import { ProjectData } from '@/types';
import { AddProjectModal } from './ProjectsColumn/AddProjectModal';
import { useMultiSelection } from '@/hooks/useMultiSelection';

type ProjectsColumnProps = {
  projects: Project[];
  selectedProjectId?: string | null;
  onProjectSelect?: (projectId: string) => void;
};

const ProjectsColumn: React.FC<ProjectsColumnProps> = ({
  projects: initialProjects,
  selectedProjectId,
  onProjectSelect,
}) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  
  const {
    selectedItems,
    isSelectionMode,
    activeColumn,
    toggleSelection,
    isSelected,
    bulkDelete,
    bulkArchive
  } = useMultiSelection();

  const handleProjectAdded = (newProject: ProjectData) => {
    const projectToAdd: Project = {
      id: newProject.id.toString(),
      title: newProject.name,
      description: newProject.description,
      owner: newProject.owner,
      value: newProject.budget.toString(),
      daysLeft: Math.ceil((new Date(newProject.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      tasksCount: newProject.tasksCount,
      status: newProject.status,
      date: new Date().toLocaleDateString('ar-SA'),
      isOverBudget: false,
      hasOverdueTasks: false,
      team: newProject.team.map(name => ({ name })),
      progress: 0,
    };
    setProjects(prev => [projectToAdd, ...prev]);
  };

  const handleProjectSelect = (projectId: string) => {
    toggleSelection(projectId, 'projects');
  };

  const handleEdit = (projectId: string) => {
    console.log('تعديل المشروع:', projectId);
  };

  const handleArchive = (projectId: string) => {
    console.log('أرشفة المشروع:', projectId);
  };

  const handleDelete = (projectId: string) => {
    console.log('حذف المشروع:', projectId);
  };

  const isDimmed = (projectId: string) => {
    return isSelectionMode && activeColumn !== 'projects';
  };

  return (
    <>
      <div 
        className="w-full h-full flex flex-col overflow-hidden rounded-t-3xl mx-0"
        style={{
          background: 'var(--backgrounds-project-column-bg)'
        }}
      >
        {/* شريط الأدوات ثابت في الأعلى */}
        <div className="flex-shrink-0 px-4 pt-4">
          <div className="mb-4">
            <ProjectsToolbar onAddProject={() => setShowAddProjectModal(true)} />
            <BulkActionsBar
              selectedCount={activeColumn === 'projects' ? selectedItems.length : 0}
              onDelete={bulkDelete}
              onArchive={bulkArchive}
            />
          </div>
        </div>
        
        {/* منطقة التمرير للمشاريع مع تأثير النافذة الدائرية */}
        <div className="flex-1 overflow-hidden rounded-t-3xl">
          <ScrollArea className="h-full w-full">
            <div className="space-y-2 pb-4 px-0 rounded-full mx-[10px]">
              {projects.map(project => (
                <ProjectCard
                  key={project.id}
                  id={Number(project.id)}
                  name={project.title}
                  description={project.description}
                  owner={project.owner}
                  deadline={project.date}
                  team={project.team?.map(t => t.name) || []}
                  status={project.status}
                  budget={Number(project.value)}
                  tasksCount={project.tasksCount}
                  daysLeft={project.daysLeft}
                  value={project.value}
                  isSelected={selectedProjectId === project.id || isSelected(project.id)}
                  isOtherSelected={selectedProjectId !== undefined && selectedProjectId !== null && selectedProjectId !== project.id}
                  isDimmed={isDimmed(project.id)}
                  onProjectSelect={onProjectSelect ? () => onProjectSelect(project.id) : undefined}
                  onSelect={() => handleProjectSelect(project.id)}
                  onEdit={() => handleEdit(project.id)}
                  onArchive={() => handleArchive(project.id)}
                  onDelete={() => handleDelete(project.id)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <AddProjectModal
        isOpen={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
        onProjectAdded={handleProjectAdded}
      />
    </>
  );
};

export default ProjectsColumn;
