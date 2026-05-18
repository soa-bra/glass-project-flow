import { useMemo } from "react";
import { useProjects } from "@/hooks/central";
import {
  ARCHIVE_MOCK_DATA,
  type ArchiveCategoryKey,
  type ArchiveRecord,
} from "./archiveData";

interface ArchiveCategoryRecordsResult {
  records: ArchiveRecord[];
  isLoading: boolean;
  isError: boolean;
}

export function useArchiveCategoryRecords(
  category: ArchiveCategoryKey,
): ArchiveCategoryRecordsResult {
  const projectsQuery = useProjects();

  const projectRecords = useMemo<ArchiveRecord[]>(() => {
    return (projectsQuery.data ?? [])
      .filter((p) => p.state === "archived" || p.state === "completed")
      .map((p) => ({
        id: p.id,
        title: p.name,
        type: p.priority,
        owner: p.owner_id,
        status: p.state,
        date: p.due_date ?? p.created_at ?? new Date().toISOString(),
        description: p.description ?? undefined,
      }));
  }, [projectsQuery.data]);

  if (category === "projects") {
    return {
      records: projectRecords,
      isLoading: projectsQuery.isLoading,
      isError: Boolean(projectsQuery.error),
    };
  }

  return {
    records: ARCHIVE_MOCK_DATA[category],
    isLoading: false,
    isError: false,
  };
}

