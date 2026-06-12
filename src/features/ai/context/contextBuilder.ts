import { buildProjectAIContext } from './projectContextBuilder';

export type AIContextRole = 'guest' | 'viewer' | 'editor' | 'host';

export interface AIContextPermissions {
  role?: AIContextRole | string;
  canViewFinancial?: boolean;
  canViewLegal?: boolean;
  canViewSensitive?: boolean;
  [key: string]: unknown;
}

export interface AIContextLink {
  id?: string;
  label?: string;
  url?: string;
  type?: string;
  [key: string]: unknown;
}

export interface BuildAIContextInput {
  boardId?: string | null;
  selectedElements?: unknown[];
  activeSection?: string | null;
  activeTab?: string | null;
  activeDepartment?: string | null;
  permissions?: AIContextPermissions | null;
  availableLinks?: AIContextLink[] | null;
  extraContext?: Record<string, unknown> | null;
}

export interface UnifiedAIContext {
  boardId: string | null;
  selectedElements: unknown[];
  activeSection: string | null;
  activeTab: string | null;
  activeDepartment: string | null;
  permissions: AIContextPermissions;
  availableLinks: AIContextLink[];
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
  permissions_scope: Record<string, unknown>;
  [key: string]: unknown;
}

const toArray = <T>(value: T[] | null | undefined): T[] => (Array.isArray(value) ? value : []);

const normalizeString = (value: string | null | undefined): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export function buildAIContext(input: BuildAIContextInput = {}): UnifiedAIContext {
  const extraContext = input.extraContext ?? {};
  const contextPermissions =
    (extraContext.permissions && typeof extraContext.permissions === 'object'
      ? (extraContext.permissions as AIContextPermissions)
      : {}) ?? {};

  const projectContext = buildProjectAIContext(input);

  return {
    ...extraContext,
    ...projectContext,
    boardId: normalizeString(input.boardId) ?? normalizeString(extraContext.boardId as string | null | undefined),
    selectedElements: toArray(
      input.selectedElements ?? (extraContext.selectedElements as unknown[] | null | undefined),
    ),
    activeSection:
      normalizeString(input.activeSection) ?? normalizeString(extraContext.activeSection as string | null | undefined),
    activeTab: normalizeString(input.activeTab) ?? normalizeString(extraContext.activeTab as string | null | undefined),
    activeDepartment:
      normalizeString(input.activeDepartment) ??
      normalizeString(extraContext.activeDepartment as string | null | undefined) ??
      normalizeString(extraContext.active_department as string | null | undefined),
    permissions: {
      ...contextPermissions,
      ...(input.permissions ?? {}),
    },
    availableLinks: toArray(input.availableLinks ?? (extraContext.availableLinks as AIContextLink[] | null | undefined)),
  };
}
