import type { TypedWorkspaceApi } from './workspaceTypes';

export type WorkspaceTab = 'finance' | 'team' | 'client' | 'files' | 'templates' | 'reports';

export type UnifiedOperationContract<TItem, TUpdate = Partial<TItem>> = {
  tab: WorkspaceTab;
  api: TypedWorkspaceApi<TItem, TUpdate>;
  sensitiveActions: Array<'update' | 'export'>;
};

export const createContract = <TItem, TUpdate = Partial<TItem>>(
  tab: WorkspaceTab,
  api: TypedWorkspaceApi<TItem, TUpdate>,
): UnifiedOperationContract<TItem, TUpdate> => ({
  tab,
  api,
  sensitiveActions: ['update', 'export'],
});
