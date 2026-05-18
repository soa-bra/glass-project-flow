export type WorkspaceOperation = 'list' | 'read' | 'update' | 'export' | 'filter' | 'search';

export interface Paging {
  page?: number;
  pageSize?: number;
}

export interface ListParams extends Paging {
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface FilterParams {
  filters: Record<string, unknown>;
  paging?: Paging;
}

export interface SearchParams extends Paging {
  q: string;
  fields?: string[];
}

export interface ExportParams {
  format: 'csv' | 'xlsx' | 'pdf' | 'json';
  filters?: Record<string, unknown>;
}

export interface OperationResult<T> {
  data: T;
  total?: number;
}

export interface TypedWorkspaceApi<TItem, TUpdate = Partial<TItem>> {
  list(params?: ListParams): Promise<OperationResult<TItem[]>>;
  read(id: string): Promise<TItem | null>;
  update(id: string, payload: TUpdate): Promise<TItem>;
  export(params: ExportParams): Promise<Blob | string>;
  filter(params: FilterParams): Promise<OperationResult<TItem[]>>;
  search(params: SearchParams): Promise<OperationResult<TItem[]>>;
}
