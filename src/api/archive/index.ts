import type {
  ExportParams,
  FilterParams,
  ListParams,
  OperationResult,
  SearchParams,
  TypedWorkspaceApi,
} from '@/api/shared/workspaceTypes';
import { getProject, listProjects, updateProject } from '@/services/central/projects.service';
import type {
  ArchiveItem,
  ArchivePermissionScope,
  ArchiveProjectItem,
  ArchiveServiceContract,
  ArchiveUpdateInput,
  ArchiveWorkspaceApi,
  ArchiveWorkspaceCategory,
} from './types';

const store = new Map<Exclude<ArchiveWorkspaceCategory, 'projects'>, ArchiveItem[]>();
const PROJECTS_SOURCE = 'central-projects';
const UNIFIED_ARCHIVE_SOURCE = 'unified-archive';

const defaultPermissions: ArchivePermissionScope[] = ['archive:read', 'archive:export', 'archive:manage'];

export const archiveServiceContracts: Record<ArchiveWorkspaceCategory, ArchiveServiceContract> = {
  documents: { category: 'documents', recordSource: UNIFIED_ARCHIVE_SOURCE, permissions: defaultPermissions, capabilities: { headerActions: ['export'], search: true, recordsList: true } },
  projects: { category: 'projects', recordSource: PROJECTS_SOURCE, permissions: defaultPermissions, capabilities: { headerActions: ['export'], search: true, recordsList: true } },
  hr: { category: 'hr', recordSource: UNIFIED_ARCHIVE_SOURCE, permissions: defaultPermissions, capabilities: { headerActions: ['export'], search: true, recordsList: true } },
  financial: { category: 'financial', recordSource: UNIFIED_ARCHIVE_SOURCE, permissions: defaultPermissions, capabilities: { headerActions: ['export'], search: true, recordsList: true } },
  legal: { category: 'legal', recordSource: UNIFIED_ARCHIVE_SOURCE, permissions: defaultPermissions, capabilities: { headerActions: ['export'], search: true, recordsList: true } },
  organizational: { category: 'organizational', recordSource: UNIFIED_ARCHIVE_SOURCE, permissions: defaultPermissions, capabilities: { headerActions: ['export'], search: true, recordsList: true } },
  knowledge: { category: 'knowledge', recordSource: UNIFIED_ARCHIVE_SOURCE, permissions: defaultPermissions, capabilities: { headerActions: ['export'], search: true, recordsList: true } },
  templates: { category: 'templates', recordSource: UNIFIED_ARCHIVE_SOURCE, permissions: defaultPermissions, capabilities: { headerActions: ['export'], search: true, recordsList: true } },
  policies: { category: 'policies', recordSource: UNIFIED_ARCHIVE_SOURCE, permissions: defaultPermissions, capabilities: { headerActions: ['export'], search: true, recordsList: true } },
};

const result = <T>(data: T, total?: number): OperationResult<T> => ({ data, total });
const matchesFilter = (row: Record<string, unknown>, filters: Record<string, unknown>) =>
  Object.entries(filters).every(([k, v]) => row[k] === v);
const matchesSearch = (q: string, values: Array<string | null | undefined>) => {
  const normalized = q.toLowerCase();
  return values.some((value) => (value ?? '').toLowerCase().includes(normalized));
};
const exportAsJson = async <T>(loader: () => Promise<T[]>) => JSON.stringify(await loader());

const createGenericApi = (
  category: Exclude<ArchiveWorkspaceCategory, 'projects'>,
): TypedWorkspaceApi<ArchiveItem, ArchiveUpdateInput> => ({
  async list(_params?: ListParams) {
    const data = store.get(category) ?? [];
    return result(data, data.length);
  },
  async read(id: string) {
    return (store.get(category) ?? []).find((item) => item.id === id) ?? null;
  },
  async update(id: string, payload: ArchiveUpdateInput) {
    const rows = store.get(category) ?? [];
    const idx = rows.findIndex((item) => item.id === id);
    if (idx < 0) throw new Error(`Archive item not found: ${id}`);
    const next = { ...rows[idx], ...payload };
    rows[idx] = next;
    store.set(category, rows);
    return next;
  },
  async export(_params: ExportParams) {
    return exportAsJson(async () => store.get(category) ?? []);
  },
  async filter(params: FilterParams) {
    const data = (store.get(category) ?? []).filter((item) => matchesFilter(item.metadata ?? {}, params.filters));
    return result(data, data.length);
  },
  async search(params: SearchParams) {
    const data = (store.get(category) ?? []).filter((item) => matchesSearch(params.q, [item.title, item.description]));
    return result(data, data.length);
  },
});

const projectsApi: TypedWorkspaceApi<ArchiveProjectItem, ArchiveUpdateInput> = {
  async list(_params?: ListParams) {
    const rows = await listProjects();
    const data = rows
      .filter((project) => project.state === 'archived' || project.state === 'completed')
      .map((project) => ({ ...project, category: 'projects' as const }));
    return result(data, data.length);
  },
  async read(id: string) {
    const row = await getProject(id);
    return row ? { ...row, category: 'projects' } : null;
  },
  async update(id: string, payload: ArchiveUpdateInput) {
    const project = await updateProject(id, {
      name: payload.title,
      description: payload.description,
    });
    return { ...project, category: 'projects' };
  },
  async export(_params: ExportParams) {
    return exportAsJson(async () => (await this.list()).data);
  },
  async filter(params: FilterParams) {
    const rows = await this.list();
    const data = rows.data.filter((project) => matchesFilter(project as Record<string, unknown>, params.filters));
    return result(data, data.length);
  },
  async search(params: SearchParams) {
    const rows = await this.list();
    const data = rows.data.filter((project) => matchesSearch(params.q, [project.name, project.description]));
    return result(data, data.length);
  },
};

export const archiveWorkspaceApi: ArchiveWorkspaceApi = {
  documents: createGenericApi('documents'),
  projects: projectsApi,
  hr: createGenericApi('hr'),
  financial: createGenericApi('financial'),
  legal: createGenericApi('legal'),
  organizational: createGenericApi('organizational'),
  knowledge: createGenericApi('knowledge'),
  templates: createGenericApi('templates'),
  policies: createGenericApi('policies'),
};

export * from './types';
