
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface ProjectBoardContextType {
  selectedProject: ProjectCardProps | null;
  openBoard: (project: ProjectCardProps) => void;
  closeBoard: () => void;
  isBoardOpen: boolean;
  boardTheme: {
    main: string;
    gradient: string;
  };
}

const ProjectBoardContext = createContext<ProjectBoardContextType | undefined>(undefined);

export const useProjectBoard = () => {
  const context = useContext(ProjectBoardContext);
  if (context === undefined) {
    throw new Error('useProjectBoard must be used within a ProjectBoardProvider');
  }
  return context;
};

const getProjectTheme = (status: string) => {
  const themes = {
    success: {
      main: '#22c55e',
      gradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.4) 0%, rgba(22, 163, 74, 0.6) 100%)'
    },
    warning: {
      main: '#f59e0b',
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.4) 0%, rgba(217, 119, 6, 0.6) 100%)'
    },
    error: {
      main: '#ef4444',
      gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.4) 0%, rgba(220, 38, 38, 0.6) 100%)'
    },
    info: {
      main: '#3b82f6',
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(37, 99, 235, 0.6) 100%)'
    },
  };
  return themes[status as keyof typeof themes] || themes.info;
};

interface ProjectBoardProviderProps {
  children: ReactNode;
}

export const ProjectBoardProvider: React.FC<ProjectBoardProviderProps> = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectCardProps | null>(null);
  
  const openBoard = (project: ProjectCardProps) => {
    setSelectedProject(project);
  };

  const closeBoard = () => {
    setSelectedProject(null);
  };

  const isBoardOpen = !!selectedProject;
  const boardTheme = selectedProject ? getProjectTheme(selectedProject.status) : { main: '#3b82f6', gradient: '' };

  const value: ProjectBoardContextType = {
    selectedProject,
    openBoard,
    closeBoard,
    isBoardOpen,
    boardTheme,
  };

  return (
    <ProjectBoardContext.Provider value={value}>
      {children}
    </ProjectBoardContext.Provider>
  );
};
