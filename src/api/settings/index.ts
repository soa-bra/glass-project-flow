import type {
  ExportParams,
  FilterParams,
  ListParams,
  OperationResult,
  SearchParams,
  TypedWorkspaceApi,
} from '@/api/shared/workspaceTypes';
import type {
  SettingsItem,
  SettingsUpdateInput,
  SettingsWorkspaceApi,
  SettingsWorkspaceTab,
} from './types';

const settingsStore = new Map<SettingsWorkspaceTab, SettingsItem[]>();

const emptyResult = <T>(data: T, total?: number): OperationResult<T> => ({ data, total });

const createTabApi = (tab: SettingsWorkspaceTab): TypedWorkspaceApi<SettingsItem, SettingsUpdateInput> => ({
  async list(_params?: ListParams) {
    const data = settingsStore.get(tab) ?? [];
    return emptyResult(data, data.length);
  },
  async read(id: string) {
    return (settingsStore.get(tab) ?? []).find((item) => item.id === id) ?? null;
  },
  async update(id: string, payload: SettingsUpdateInput) {
    const rows = settingsStore.get(tab) ?? [];
    const idx = rows.findIndex((item) => item.id === id);
    if (idx < 0) throw new Error(`Settings item not found: ${id}`);
    const next = { ...rows[idx], ...payload, updatedAt: new Date().toISOString() };
    rows[idx] = next;
    settingsStore.set(tab, rows);
    return next;
  },
  async export(_params: ExportParams) {
    return JSON.stringify(settingsStore.get(tab) ?? []);
  },
  async filter(params: FilterParams) {
    const data = (settingsStore.get(tab) ?? []).filter((item) =>
      Object.entries(params.filters).every(([k, v]) => item.metadata?.[k] === v),
    );
    return emptyResult(data, data.length);
  },
  async search(params: SearchParams) {
    const q = params.q.toLowerCase();
    const data = (settingsStore.get(tab) ?? []).filter((item) =>
      item.title.toLowerCase().includes(q) || (item.description ?? '').toLowerCase().includes(q),
    );
    return emptyResult(data, data.length);
  },
});

const tabs: SettingsWorkspaceTab[] = [
  'account',
  'security',
  'notifications',
  'integrations',
  'ai',
  'theme',
  'data-governance',
  'users-roles',
  'audit',
  'engine-jobs',
  'dependency-graph',
  'tools-marketplace',
  'admin-roles',
];

export const settingsWorkspaceApi: SettingsWorkspaceApi = tabs.reduce((acc, tab) => {
  acc[tab] = createTabApi(tab);
  return acc;
}, {} as SettingsWorkspaceApi);

export * from './types';
