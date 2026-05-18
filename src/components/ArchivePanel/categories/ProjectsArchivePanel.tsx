import React, { useMemo } from 'react';
import { useProjects } from '@/hooks/central';
import { GenericArchiveCategoryPanel } from './GenericArchiveCategoryPanel';
import type { ArchiveRecord } from './archiveData';

export const ProjectsArchivePanel: React.FC = () => {
  const { data: allProjects, isLoading, error } = useProjects();

  const records = useMemo<ArchiveRecord[]>(() => {
    return (allProjects ?? [])
      .filter((p) => p.state === 'archived' || p.state === 'completed')
      .map((p) => ({
        id: p.id,
        title: p.name,
        type: p.priority,
        owner: p.owner_id,
        status: p.state,
        date: p.due_date ?? p.created_at ?? new Date().toISOString(),
        description: p.description ?? undefined,
      }));
  }, [allProjects]);

  return <GenericArchiveCategoryPanel category="projects" records={records} isLoading={isLoading} isError={Boolean(error)} />;
};
