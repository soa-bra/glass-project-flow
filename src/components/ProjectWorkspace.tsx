
import React, { useState } from 'react';
import ProjectsColumn from '@/components/ProjectsColumn';
import OperationsBoard from '@/components/OperationsBoard';
import ProjectPanel from '@/components/ProjectPanel';
import { ProjectManagementBoardBox } from '@/components/ProjectManagement';
import { mockProjects } from '@/data/mockProjects';
import { useProjectPanelAnimation } from '@/hooks/useProjectPanelAnimation';
import { ProjectTasksProvider } from '@/contexts/ProjectTasksContext';
import { Project } from '@/types/project';
import { ProjectData } from '@/types';
import { ProjectFilterOptions } from './custom/ProjectsFilterDialog';
import { ProjectSortOptions } from './custom/ProjectsSortDialog';

interface ProjectWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({ isSidebarCollapsed }) => {
  // إدارة حالة المشاريع على مستوى ProjectWorkspace
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [currentSort, setCurrentSort] = useState<ProjectSortOptions>({ sortBy: 'deadline', direction: 'asc' });

  const {
    panelStage,
    selectedProjectId,
    displayedProjectId,
    operationsBoardClass,
    projectsColumnClass,
    handleProjectSelect,
    closePanel,
  } = useProjectPanelAnimation();

  // دالة لإضافة مشروع جديد
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

  // دالة لتحديث مشروع موجود
  const handleProjectUpdated = (updatedProject: ProjectData) => {
    setProjects(prev => prev.map(project => 
      project.id === updatedProject.id.toString() 
        ? {
            ...project,
            title: updatedProject.name,
            description: updatedProject.description,
            owner: updatedProject.owner,
            value: updatedProject.budget.toString(),
            daysLeft: Math.ceil((new Date(updatedProject.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
            tasksCount: updatedProject.tasksCount,
            status: updatedProject.status,
            team: updatedProject.team.map(name => ({ name })),
          }
        : project
    ));
  };

  // دالة تطبيق الفلترة
  const handleApplyFilter = (filters: ProjectFilterOptions) => {
    // TODO: Implement filtering logic
    console.log('تطبيق الفلترة:', filters);
  };

  // دالة تطبيق الترتيب
  const handleApplySort = (sortOptions: ProjectSortOptions) => {
    setCurrentSort(sortOptions);
    
    setProjects(prev => [...prev].sort((a, b) => {
      let comparison = 0;
      
      switch (sortOptions.sortBy) {
        case 'name':
          comparison = a.title.localeCompare(b.title, 'ar');
          break;
        case 'status':
          const statusOrder = { success: 1, info: 2, warning: 3, error: 4 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        case 'manager':
          comparison = a.owner.localeCompare(b.owner, 'ar');
          break;
        case 'tasks':
          comparison = (a.tasksCount || 0) - (b.tasksCount || 0);
          break;
        case 'team':
          comparison = (a.team?.length || 0) - (b.team?.length || 0);
          break;
        case 'budget':
          // استخدام value كميزانية المشروع لأن budget غير موجود في نموذج Project
          comparison = parseFloat(a.value || '0') - parseFloat(b.value || '0');
          break;
        case 'deadline':
        default:
          comparison = a.daysLeft - b.daysLeft;
          break;
      }
      
      return sortOptions.direction === 'desc' ? -comparison : comparison;
    }));
  };

  // Dynamically set right offsets depending on collapsed state
  const projectsColumnRight = isSidebarCollapsed ? 'var(--projects-right-collapsed)' : 'var(--projects-right-expanded)';
  const projectsColumnWidth = 'var(--projects-width)';
  const operationsBoardRight = isSidebarCollapsed ? 'var(--operations-right-collapsed)' : 'var(--operations-right-expanded)';
  const operationsBoardWidth = isSidebarCollapsed ? 'var(--operations-width-collapsed)' : 'var(--operations-width-expanded)';
  const projectPanelRight = operationsBoardRight;
  const projectPanelWidth = operationsBoardWidth;

  // panel content switches: always mount ProjectPanel but swap inner content with fade
  const shownProject = displayedProjectId
    ? projects.find((p) => p.id === displayedProjectId)
    : null;

  return (
    <ProjectTasksProvider>
      {/* Projects Column: shifts left when panel slides in */}
      <div
        className={`fixed h-[calc(100vh-var(--sidebar-top-offset))] ${projectsColumnClass}`}
        style={{
          top: 'var(--sidebar-top-offset)',
          right: projectsColumnRight,
          width: projectsColumnWidth,
          transition: 'all var(--animation-duration-main) var(--animation-easing)',
          zIndex: 110,
        }}
      >
        <div
          style={{
            transition: 'all var(--animation-duration-main) var(--animation-easing)'
          }}
          className="w-full h-full p-2 py-0 mx-0 px-[5px]"
        >
          <ProjectsColumn
            projects={projects}
            selectedProjectId={selectedProjectId}
            onProjectSelect={handleProjectSelect}
            onProjectAdded={handleProjectAdded}
            onApplyFilter={handleApplyFilter}
            onApplySort={handleApplySort}
          />
        </div>
      </div>

      {/* Operations Board: slides out when panel slides in */}
      <div
        style={{
          right: operationsBoardRight,
          width: operationsBoardWidth,
          transition: 'all var(--animation-duration-main) var(--animation-easing)'
        }}
        className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] mx-0 ${operationsBoardClass}`}
      >
        <OperationsBoard isSidebarCollapsed={isSidebarCollapsed} />
      </div>

      {/* Project Management Board: slides in/out and crossfades content */}
      {shownProject && (
        <ProjectManagementBoardBox
          key={shownProject.id} // إضافة key لإعادة التحديث عند تغيير المشروع
          project={shownProject}
          isVisible={panelStage === "open" || panelStage === "changing-content"}
          onClose={closePanel}
          isSidebarCollapsed={isSidebarCollapsed}
          onProjectUpdated={handleProjectUpdated}
        />
      )}
    </ProjectTasksProvider>
  );
};

export default ProjectWorkspace;
