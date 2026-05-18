import type { TypedWorkspaceApi } from '@/api/shared/workspaceTypes';

export type SettingsWorkspaceTab =
  | 'account'
  | 'security'
  | 'notifications'
  | 'integrations'
  | 'ai'
  | 'theme'
  | 'data-governance'
  | 'users-roles'
  | 'audit'
  | 'engine-jobs'
  | 'dependency-graph'
  | 'tools-marketplace'
  | 'admin-roles';

export interface SettingsItem {
  id: string;
  tab: SettingsWorkspaceTab;
  title: string;
  description?: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface SettingsUpdateInput {
  title?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export type SettingsWorkspaceApi = Record<
  SettingsWorkspaceTab,
  TypedWorkspaceApi<SettingsItem, SettingsUpdateInput>
>;
