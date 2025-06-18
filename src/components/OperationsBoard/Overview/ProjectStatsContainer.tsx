
import React from 'react';
import { ProjectStatsSection } from './ProjectStatsSection';

interface ProjectStats {
  expectedRevenue: number;
  complaints: number;
  delayedProjects: number;
}

interface ProjectStatsContainerProps {
  stats: ProjectStats;
}

export const ProjectStatsContainer: React.FC<ProjectStatsContainerProps> = ({
  stats
}) => {
  return (
    <div className="w-full">
      <ProjectStatsSection stats={stats} />
    </div>
  );
};
