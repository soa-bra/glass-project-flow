import type { AIContextLink, AIContextPermissions, AIContextRole } from './contextBuilder';
import { getDepartmentDefinition, getDepartmentTabDefinition } from './departmentRegistry';

export type AIContextSourceKind =
  | 'navigation'
  | 'project'
  | 'department'
  | 'financial'
  | 'tasks'
  | 'documents'
  | 'planning'
  | 'events'
  | 'risks'
  | 'links';

export interface AIPermissionScope extends AIContextPermissions {
  sourceId?: string;
  sourceKind?: AIContextSourceKind;
  allowed?: boolean;
  reason?: string | null;
  allowedFields?: string[];
}

export interface AIContextSourceSnapshot {
  id: string;
  kind: AIContextSourceKind;
  data: Record<string, unknown>;
  permission_scope?: AIPermissionScope | null;
}

export interface ProjectAIContextInput {
  boardId?: string | null;
  selectedElements?: unknown[];
  activeSection?: string | null;
  activeTab?: string | null;
  activeDepartment?: string | null;
  permissions?: AIContextPermissions | null;
  availableLinks?: AIContextLink[] | null;
  extraContext?: Record<string, unknown> | null;
}

export interface ProjectAIContext {
  project_summary: Record<string, unknown> | null;
  active_department: Record<string, unknown> | null;
  active_tab: Record<string, unknown> | null;
  visible_boxes: unknown[];
  linked_entities: unknown[];
  recent_events: unknown[];
  risks: unknown[];
  financial_snapshot: Record<string, unknown> | null;
  tasks_snapshot: Record<string, unknown> | null;
  documents_snapshot: Record<string, unknown> | null;
  permissions_scope: AIPermissionScope;
}

const registeredSources = new Map<string, AIContextSourceSnapshot>();

const roleRank: Record<AIContextRole, number> = {
  guest: 0,
  viewer: 1,
  editor: 2,
  host: 3,
};

const normalizeRole = (role: unknown): AIContextRole => {
  if (role === 'host' || role === 'editor' || role === 'viewer' || role === 'guest') return role;
  return 'guest';
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const toArray = <T>(value: T[] | null | undefined): T[] => (Array.isArray(value) ? value : []);

const normalizeString = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const mergePermissions = (...permissions: Array<AIContextPermissions | null | undefined>): AIPermissionScope =>
  permissions.reduce<AIPermissionScope>((acc, permission) => ({ ...acc, ...(permission ?? {}) }), {});

export const registerAIContextSource = (source: AIContextSourceSnapshot): (() => void) => {
  registeredSources.set(source.id, source);
  return () => {
    const current = registeredSources.get(source.id);
    if (current === source) registeredSources.delete(source.id);
  };
};

export const getRegisteredAIContextSources = (): AIContextSourceSnapshot[] => Array.from(registeredSources.values());

export const clearAIContextSources = (): void => registeredSources.clear();

export const applyPermissionScope = <TData extends Record<string, unknown>>(
  data: TData,
  permissionScope: AIPermissionScope | null | undefined,
): TData | null => {
  const scope = permissionScope ?? {};
  if (scope.allowed === false) return null;

  const role = normalizeRole(scope.role);
  const canViewFinancial = scope.canViewFinancial === true || role === 'host';
  const canViewLegal = scope.canViewLegal === true || role === 'host';
  const canViewSensitive = scope.canViewSensitive === true || role === 'host';

  if (scope.sourceKind === 'financial' && !canViewFinancial) return null;
  if (scope.sourceKind === 'department' && data.category === 'financial' && !canViewFinancial) return null;
  if (scope.sourceKind === 'department' && data.category === 'legal' && !canViewLegal) return null;
  if (data.sensitive === true && !canViewSensitive) return null;

  if (scope.allowedFields?.length) {
    const allowed = new Set(scope.allowedFields);
    return Object.fromEntries(Object.entries(data).filter(([key]) => allowed.has(key))) as TData;
  }

  return data;
};

const filterSourceData = (source: AIContextSourceSnapshot, baseScope: AIPermissionScope): Record<string, unknown> | null => {
  const sourceScope = mergePermissions(baseScope, source.permission_scope, {
    sourceId: source.id,
    sourceKind: source.kind,
  });

  return applyPermissionScope(source.data, sourceScope);
};

const pushArray = (target: unknown[], value: unknown): void => {
  if (Array.isArray(value)) {
    target.push(...value);
  } else if (value !== undefined && value !== null) {
    target.push(value);
  }
};

const mergeRecord = (
  current: Record<string, unknown> | null,
  next: unknown,
): Record<string, unknown> | null => {
  if (!isRecord(next)) return current;
  return { ...(current ?? {}), ...next };
};

export function buildProjectAIContext(input: ProjectAIContextInput = {}): ProjectAIContext {
  const extraContext = input.extraContext ?? {};
  const extraPermissions = isRecord(extraContext.permissions) ? extraContext.permissions as AIContextPermissions : {};
  const permissionsScope = mergePermissions(extraPermissions, input.permissions);
  const role = normalizeRole(permissionsScope.role);
  const permissionScope: AIPermissionScope = {
    role,
    canViewFinancial: permissionsScope.canViewFinancial === true || role === 'host',
    canViewLegal: permissionsScope.canViewLegal === true || role === 'host',
    canViewSensitive: permissionsScope.canViewSensitive === true || role === 'host' || roleRank[role] >= roleRank.editor,
    ...permissionsScope,
  };

  const activeDepartmentId =
    normalizeString(input.activeDepartment) ??
    normalizeString(extraContext.activeDepartment) ??
    normalizeString(extraContext.active_department) ??
    getRegisteredAIContextSources().reduce<string | null>((found, source) => {
      if (found || source.kind !== 'department') return found;
      return normalizeString(source.data.id ?? source.data.activeDepartment ?? source.data.departmentId);
    }, null);
  const activeTabId = normalizeString(input.activeTab) ?? normalizeString(extraContext.activeTab);
  const departmentDefinition = getDepartmentDefinition(activeDepartmentId);
  const tabDefinition = getDepartmentTabDefinition(activeDepartmentId, activeTabId);

  const context: ProjectAIContext = {
    project_summary: mergeRecord(null, extraContext.project_summary),
    active_department: departmentDefinition
      ? {
          id: departmentDefinition.id,
          label: departmentDefinition.label,
          category: departmentDefinition.category,
        }
      : null,
    active_tab: tabDefinition
      ? {
          id: tabDefinition.id,
          label: tabDefinition.label,
          departmentId: activeDepartmentId,
        }
      : activeTabId
        ? { id: activeTabId, departmentId: activeDepartmentId }
        : null,
    visible_boxes: toArray(extraContext.visible_boxes as unknown[] | null | undefined),
    linked_entities: toArray(extraContext.linked_entities as unknown[] | null | undefined),
    recent_events: toArray(extraContext.recent_events as unknown[] | null | undefined),
    risks: toArray(extraContext.risks as unknown[] | null | undefined),
    financial_snapshot: mergeRecord(null, extraContext.financial_snapshot),
    tasks_snapshot: mergeRecord(null, extraContext.tasks_snapshot),
    documents_snapshot: mergeRecord(null, extraContext.documents_snapshot),
    permissions_scope: permissionScope,
  };

  if (tabDefinition?.boxKeys?.length) {
    context.visible_boxes.push(...tabDefinition.boxKeys.map((boxKey) => ({ id: boxKey, source: 'departmentRegistry' })));
  }

  for (const source of getRegisteredAIContextSources()) {
    const data = filterSourceData(source, permissionScope);
    if (!data) continue;

    if (source.kind === 'navigation') {
      context.active_tab = mergeRecord(context.active_tab, data.active_tab ?? data.activeTab ?? data.tab);
      pushArray(context.visible_boxes, data.visible_boxes ?? data.visibleBoxes);
    }

    if (source.kind === 'project' || source.kind === 'planning') {
      context.project_summary = mergeRecord(context.project_summary, data.project_summary ?? data.projectSummary ?? data);
      context.tasks_snapshot = mergeRecord(context.tasks_snapshot, data.tasks_snapshot ?? data.tasksSnapshot);
      pushArray(context.linked_entities, data.linked_entities ?? data.linkedEntities);
      pushArray(context.recent_events, data.recent_events ?? data.recentEvents);
      pushArray(context.risks, data.risks);
      pushArray(context.visible_boxes, data.visible_boxes ?? data.visibleBoxes);
    }

    if (source.kind === 'department') {
      context.active_department = mergeRecord(context.active_department, data.active_department ?? data.department ?? data);
      context.active_tab = mergeRecord(context.active_tab, data.active_tab ?? data.tab);
      pushArray(context.visible_boxes, data.visible_boxes ?? data.visibleBoxes);
    }

    if (source.kind === 'financial') {
      context.financial_snapshot = mergeRecord(context.financial_snapshot, data.financial_snapshot ?? data);
      pushArray(context.recent_events, data.recent_events ?? data.recentEvents);
      pushArray(context.risks, data.risks);
      pushArray(context.linked_entities, data.linked_entities ?? data.linkedEntities);
      pushArray(context.visible_boxes, data.visible_boxes ?? data.visibleBoxes);
    }

    if (source.kind === 'tasks') context.tasks_snapshot = mergeRecord(context.tasks_snapshot, data.tasks_snapshot ?? data);
    if (source.kind === 'documents') context.documents_snapshot = mergeRecord(context.documents_snapshot, data.documents_snapshot ?? data);
    if (source.kind === 'events') pushArray(context.recent_events, data.events ?? data.recent_events ?? data);
    if (source.kind === 'risks') pushArray(context.risks, data.risks ?? data);
    if (source.kind === 'links') pushArray(context.linked_entities, data.linked_entities ?? data.links ?? data);
  }

  const selectedElements = toArray(input.selectedElements ?? extraContext.selectedElements as unknown[] | null | undefined);
  if (selectedElements.length > 0) {
    context.visible_boxes.push({ id: 'selected-elements', count: selectedElements.length, source: 'canvas-selection' });
  }

  const availableLinks = toArray(input.availableLinks ?? extraContext.availableLinks as AIContextLink[] | null | undefined);
  if (availableLinks.length > 0) pushArray(context.linked_entities, availableLinks);

  return context;
}
