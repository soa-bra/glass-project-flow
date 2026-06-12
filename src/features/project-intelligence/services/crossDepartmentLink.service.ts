import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import type {
  CrossDepartmentLinkQuery,
  DataLinkEndpoint,
  DataLinkImpact,
  DataLinkRow,
} from '../types/data-link.types';
import type { ProjectIntelligenceDepartment } from '../types/project-intelligence.types';

type LinkJson = Record<string, unknown>;

const DEFAULT_DEPARTMENT: ProjectIntelligenceDepartment = 'planning';

function asRecord(value: Json): LinkJson {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? value as LinkJson : {};
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function readDepartment(record: LinkJson, keys: string[]): ProjectIntelligenceDepartment | undefined {
  for (const key of keys) {
    const direct = asString(record[key]);
    if (direct) return direct;
  }
  return undefined;
}

function buildEndpoint(link: DataLinkRow, side: 'source' | 'target'): DataLinkEndpoint {
  const mapping = asRecord(link.mapping);
  const metadata = asRecord(link.metadata);
  const nested = asRecord((mapping[side] ?? metadata[side]) as Json);
  const department =
    readDepartment(nested, ['department', 'departmentKey', 'workspace']) ??
    readDepartment(mapping, [`${side}Department`, `${side}_department`, `${side}Workspace`]) ??
    readDepartment(metadata, [`${side}Department`, `${side}_department`, `${side}Workspace`]) ??
    DEFAULT_DEPARTMENT;

  return {
    department,
    elementId: side === 'source' ? link.source_element_id : link.target_element_id,
    entityTable: asString(nested.entityTable ?? nested.entity_table ?? mapping[`${side}EntityTable`]),
    entityId: asString(nested.entityId ?? nested.entity_id ?? mapping[`${side}EntityId`]),
  };
}

function inferImpactLevel(link: DataLinkRow, source: DataLinkEndpoint, target: DataLinkEndpoint): DataLinkImpact['impactLevel'] {
  const metadata = asRecord(link.metadata);
  const explicit = asString(metadata.impactLevel ?? metadata.impact_level);
  if (explicit === 'low' || explicit === 'medium' || explicit === 'high') return explicit;
  if (link.link_kind.includes('dependency') || link.link_kind.includes('blocking')) return 'high';
  if (source.department !== target.department) return 'medium';
  return 'low';
}

function describeImpact(link: DataLinkRow, source: DataLinkEndpoint, target: DataLinkEndpoint): string {
  if (source.department === target.department) {
    return `يربط ${link.link_kind} عناصر داخل قسم ${source.department}.`;
  }
  return `يربط ${link.link_kind} قسم ${source.department} بقسم ${target.department}.`;
}

function toImpact(link: DataLinkRow): DataLinkImpact {
  const source = buildEndpoint(link, 'source');
  const target = buildEndpoint(link, 'target');
  return {
    link,
    source,
    target,
    impactLevel: inferImpactLevel(link, source, target),
    reason: describeImpact(link, source, target),
  };
}

export async function getCrossDepartmentImpacts(
  query: CrossDepartmentLinkQuery = {},
): Promise<DataLinkImpact[]> {
  let request = supabase
    .from('data_links')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(query.limit ?? 100);

  if (query.projectId) request = request.eq('project_id', query.projectId);
  if (query.boardId) request = request.eq('board_id', query.boardId);

  const { data, error } = await request;
  if (error) throw error;

  return (data ?? [])
    .map(toImpact)
    .filter((impact) => {
      if (query.sourceDepartment && impact.source.department !== query.sourceDepartment) return false;
      if (query.targetDepartment && impact.target.department !== query.targetDepartment) return false;
      return impact.source.department !== impact.target.department;
    });
}

export const crossDepartmentLinkService = {
  getImpacts: getCrossDepartmentImpacts,
};
