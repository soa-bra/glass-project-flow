
import React, { createContext, useContext } from 'react';

interface ProjectPanelContextType {
  project: {
    id: string;
    title: string;
    description: string;
    hex?: string;
    budget: number;
    status: 'success' | 'warning' | 'error' | 'info';
    progress: number;
  };
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  projectColor: string;
}

export const ProjectPanelContext = createContext<ProjectPanelContextType | null>(null);

export const useProjectPanel = () => {
  const context = useContext(ProjectPanelContext);
  if (!context) {
    throw new Error('useProjectPanel must be used within ProjectPanelContext');
  }
  return context;
};
