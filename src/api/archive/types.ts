import type { Project } from '@/types/central';
import type { TypedWorkspaceApi } from '@/api/shared/workspaceTypes';

export type ArchiveWorkspaceCategory =
  | 'documents'
  | 'projects'
  | 'hr'
  | 'financial'
  | 'legal'
  | 'organizational'
  | 'knowledge'
  | 'templates'
  | 'policies';

export interface ArchiveItem {
  id: string;
  category: Exclude<ArchiveWorkspaceCategory, 'projects'>;
  title: string;
  description?: string;
  archivedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface ArchiveUpdateInput {
  title?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface ArchiveProjectItem extends Project {
  category: 'projects';
}

export type ArchiveWorkspaceApi = Omit<
  Record<ArchiveWorkspaceCategory, TypedWorkspaceApi<ArchiveItem | ArchiveProjectItem, ArchiveUpdateInput>>,
  never
>;
