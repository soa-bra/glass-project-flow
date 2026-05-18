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
  ArchiveProjectItem,
  ArchiveUpdateInput,
  ArchiveWorkspaceApi,
  ArchiveWorkspaceCategory,
} from './types';

const store = new Map<Exclude<ArchiveWorkspaceCategory, 'projects'>, ArchiveItem[]>();

const result = <T>(data: T, total?: number): OperationResult<T> => ({ data, total });

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
    return JSON.stringify(store.get(category) ?? []);
  },
  async filter(params: FilterParams) {
    const data = (store.get(category) ?? []).filter((item) =>
      Object.entries(params.filters).every(([k, v]) => item.metadata?.[k] === v),
    );
    return result(data, data.length);
  },
  async search(params: SearchParams) {
    const q = params.q.toLowerCase();
    const data = (store.get(category) ?? []).filter((item) =>
      item.title.toLowerCase().includes(q) || (item.description ?? '').toLowerCase().includes(q),
    );
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
    const data = await this.list();
    return JSON.stringify(data.data);
  },
  async filter(params: FilterParams) {
    const rows = await this.list();
    const data = rows.data.filter((project) =>
      Object.entries(params.filters).every(([k, v]) => (project as Record<string, unknown>)[k] === v),
    );
    return result(data, data.length);
  },
  async search(params: SearchParams) {
    const rows = await this.list();
    const q = params.q.toLowerCase();
    const data = rows.data.filter(
      (project) =>
        project.name.toLowerCase().includes(q) || (project.description ?? '').toLowerCase().includes(q),
    );
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
