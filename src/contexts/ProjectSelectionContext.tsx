
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface ProjectSelectionContextType {
  activeProject: ProjectCardProps | null;
  setActiveProject: (project: ProjectCardProps | null) => void;
  boardColor: string;
  isProjectBoardOpen: boolean;
}

const ProjectSelectionContext = createContext<ProjectSelectionContextType | undefined>(undefined);

export const useProjectSelection = () => {
  const context = useContext(ProjectSelectionContext);
  if (context === undefined) {
    throw new Error('useProjectSelection must be used within a ProjectSelectionProvider');
  }
  return context;
};

const getProjectThemeColor = (status: string): string => {
  const themeColors = {
    success: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  };
  return themeColors[status as keyof typeof themeColors] || themeColors.info;
};

interface ProjectSelectionProviderProps {
  children: ReactNode;
}

export const ProjectSelectionProvider: React.FC<ProjectSelectionProviderProps> = ({ children }) => {
  const [activeProject, setActiveProject] = useState<ProjectCardProps | null>(null);
  
  const boardColor = activeProject ? getProjectThemeColor(activeProject.status) : '';
  const isProjectBoardOpen = !!activeProject;

  const value: ProjectSelectionContextType = {
    activeProject,
    setActiveProject,
    boardColor,
    isProjectBoardOpen,
  };

  return (
    <ProjectSelectionContext.Provider value={value}>
      {children}
    </ProjectSelectionContext.Provider>
  );
};
