/**
 * Smart Connectors Service — logical persistence for visual SVG connectors
 * whose geometry is stored as `planning_elements` rows.
 */
import { supabase } from '@/integrations/supabase/client';
import type { Database, Json } from '@/integrations/supabase/types';
import type { PlanningConnectorLogicalRecord } from '@/features/planning/integration/connectors';
import { isOperationalRelationshipType } from '@/features/planning/integration/connectors';
import { audit } from '@/services/audit';

export type SmartConnector = Database['public']['Tables']['smart_connectors']['Row'];
type SmartConnectorInsert = Database['public']['Tables']['smart_connectors']['Insert'];
type DataLinkInsert = Database['public']['Tables']['data_links']['Insert'];
type DependencyInsert = Database['public']['Tables']['dependencies']['Insert'];
type CentralEntityType = Database['public']['Enums']['central_entity_type'];

type SmartConnectorWithNullableEndpoints = Omit<SmartConnector, 'source_element_id' | 'target_element_id'> & {
  source_element_id: string | null;
  target_element_id: string | null;
  status?: string;
};

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error('Not authenticated');
  return data.user.id;
}

const CENTRAL_ENTITY_TYPES = new Set<string>([
  'central_board',
  'department',
  'project',
  'task',
  'tool',
  'engine_job',
  'project_card',
  'task_card',
]);

function hasOperationalApproval(record: PlanningConnectorLogicalRecord): boolean {
  return record.approvedByUser && isOperationalRelationshipType(record.relationship_type);
}

function isUuid(value?: string | null): boolean {
  return Boolean(
    value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value),
  );
}

function hasEntityEndpoints(record: PlanningConnectorLogicalRecord): boolean {
  return Boolean(
    record.sourceEntityType &&
      record.targetEntityType &&
      isUuid(record.sourceEntityId) &&
      isUuid(record.targetEntityId),
  );
}

function isCentralEntityType(value?: string | null): value is CentralEntityType {
  return Boolean(value && CENTRAL_ENTITY_TYPES.has(value));
}

function buildOperationalMapping(record: PlanningConnectorLogicalRecord): Record<string, unknown> {
  return {
    source: record.source ?? 'planningConnectorAdapter',
    connectorSource: 'planning_connector',
    relationshipType: record.relationship_type,
    connectorKind: record.connector_kind,
    sourceEntityId: record.sourceEntityId ?? null,
    sourceEntityType: record.sourceEntityType ?? null,
    targetEntityId: record.targetEntityId ?? null,
    targetEntityType: record.targetEntityType ?? null,
    direction: record.direction,
    confidence: record.confidence ?? null,
    createdBy: record.createdBy ?? null,
    isAIGenerated: record.isAIGenerated,
    approvedByUser: record.approvedByUser,
    approvedBy: record.approvedBy ?? null,
  };
}

async function refreshOperationalDataLink(
  record: PlanningConnectorLogicalRecord,
  createdBy: string,
): Promise<void> {
  const { error: deleteError } = await supabase
    .from('data_links')
    .delete()
    .eq('board_id', record.board_id)
    .eq('link_kind', 'operational_relationship')
    .filter('metadata->>connectorElementId', 'eq', record.connector_element_id);

  if (deleteError) throw deleteError;

  if (!hasOperationalApproval(record)) {
    await refreshCentralDependencyLink(record);
    return;
  }

  const mapping = buildOperationalMapping(record);
  const hasRealEntities = hasEntityEndpoints(record);

  const payload: DataLinkInsert = {
    board_id: record.board_id,
    created_by: createdBy,
    source_element_id: record.source_element_id,
    target_element_id: record.target_element_id,
    source_type: hasRealEntities ? record.sourceEntityType : 'planning_element',
    source_id: hasRealEntities ? record.sourceEntityId : record.source_element_id,
    target_type: hasRealEntities ? record.targetEntityType : 'planning_element',
    target_id: hasRealEntities ? record.targetEntityId : record.target_element_id,
    link_kind: 'operational_relationship',
    relation_type: record.relationship_type,
    sync_type: 'planning_connector',
    label: record.label ?? record.relationship_type,
    mapping: mapping as Json,
    fields_map: mapping as Json,
    metadata: {
      ...record.metadata,
      ...mapping,
      connectorElementId: record.connector_element_id,
      relationshipType: record.relationship_type,
      source: record.source ?? 'planningConnectorAdapter',
      operationalLinkFallback: hasRealEntities
        ? 'data_links stores EntityLink-compatible endpoints until a dedicated entity_links table is available.'
        : undefined,
    } as Json,
    status: 'active',
  };

  const { error: insertError } = await supabase.from('data_links').insert(payload as never);
  if (insertError) throw insertError;

  await refreshCentralDependencyLink(record);
}

async function refreshCentralDependencyLink(record: PlanningConnectorLogicalRecord): Promise<void> {
  const { error: deleteError } = await supabase
    .from('dependencies')
    .delete()
    .filter('metadata->>connectorElementId', 'eq', record.connector_element_id);

  if (deleteError) throw deleteError;

  if (
    !hasOperationalApproval(record) ||
    !hasEntityEndpoints(record) ||
    !isCentralEntityType(record.sourceEntityType) ||
    !isCentralEntityType(record.targetEntityType)
  ) {
    return;
  }

  const payload: DependencyInsert = {
    id: crypto.randomUUID(),
    from_entity_type: record.sourceEntityType,
    from_entity_id: record.sourceEntityId,
    to_entity_type: record.targetEntityType,
    to_entity_id: record.targetEntityId,
    dependency_type: record.relationship_type as never,
    description: record.label ?? null,
    metadata: {
      ...record.metadata,
      ...buildOperationalMapping(record),
      connectorElementId: record.connector_element_id,
      boardId: record.board_id,
    } as Json,
  };

  const { error: insertError } = await supabase.from('dependencies').insert(payload);
  if (insertError) throw insertError;
}

async function deleteOperationalArtifactsByConnectorElementId(
  connectorElementId: string,
): Promise<void> {
  const { error } = await supabase
    .from('data_links')
    .delete()
    .eq('link_kind', 'operational_relationship')
    .filter('metadata->>connectorElementId', 'eq', connectorElementId);
  if (error) throw error;

  const { error: dependencyError } = await supabase
    .from('dependencies')
    .delete()
    .filter('metadata->>connectorElementId', 'eq', connectorElementId);
  if (dependencyError) throw dependencyError;
}

async function archiveOperationalDataLinksByConnector(
  connector: SmartConnectorWithNullableEndpoints,
  missingElementId: string,
  missingEndpoint: 'source' | 'target' | 'connector' | 'unknown',
): Promise<void> {
  const { data: links, error: selectError } = await supabase
    .from('data_links')
    .select('id, metadata, source_element_id, target_element_id')
    .eq('board_id', connector.board_id)
    .eq('link_kind', 'operational_relationship')
    .filter('metadata->>connectorElementId', 'eq', connector.connector_element_id);
  if (selectError) throw selectError;

  await Promise.all((links ?? []).map(async (link) => {
    const { error } = await supabase
      .from('data_links' as any)
      .update({
        source_element_id: missingEndpoint === 'source' ? null : link.source_element_id,
        target_element_id: missingEndpoint === 'target' ? null : link.target_element_id,
        status: missingEndpoint === 'connector' ? 'archived' : 'broken',
        metadata: {
          ...(link.metadata as Record<string, unknown>),
          status: missingEndpoint === 'connector' ? 'archived' : 'broken',
          missingElementId,
          missingEndpoint,
          archivedAt: new Date().toISOString(),
          preservedOperationalRelationship: true,
        } as Json,
      })
      .eq('id', link.id);
    if (error) throw error;
  }));
}

export async function unlinkDataLinksByElementId(elementId: string, boardId?: string): Promise<void> {
  let operationalSelect = supabase
    .from('data_links')
    .select('id, metadata, source_element_id, target_element_id')
    .or(`source_element_id.eq.${elementId},target_element_id.eq.${elementId}`)
    .or('link_kind.eq.operational_relationship,relation_type.in.(depends_on,blocks,funds,delivers)');

  if (boardId) operationalSelect = operationalSelect.eq('board_id', boardId);
  const { data: operationalLinks, error: selectError } = await operationalSelect;
  if (selectError) throw selectError;

  await Promise.all((operationalLinks ?? []).map(async (link) => {
    const missingEndpoint = link.source_element_id === elementId
      ? 'source'
      : link.target_element_id === elementId
        ? 'target'
        : 'unknown';
    const { error } = await supabase
      .from('data_links' as any)
      .update({
        source_element_id: missingEndpoint === 'source' ? null : link.source_element_id,
        target_element_id: missingEndpoint === 'target' ? null : link.target_element_id,
        status: 'broken',
        metadata: {
          ...(link.metadata as Record<string, unknown>),
          status: 'broken',
          missingElementId: elementId,
          missingEndpoint,
          unlinkedAt: new Date().toISOString(),
          preservedOperationalRelationship: true,
        } as Json,
      })
      .eq('id', link.id);
    if (error) throw error;
  }));

  let deleteQuery = supabase
    .from('data_links')
    .delete()
    .or(`source_element_id.eq.${elementId},target_element_id.eq.${elementId},metadata->>connectorElementId.eq.${elementId}`)
    .neq('link_kind', 'operational_relationship')
    .not('relation_type', 'in', '(depends_on,blocks,funds,delivers)');

  if (boardId) deleteQuery = deleteQuery.eq('board_id', boardId);
  const { error: deleteError } = await deleteQuery;
  if (deleteError) throw deleteError;
}

export const deleteDataLinksByElementId = unlinkDataLinksByElementId;

function toSmartConnectorInsert(
  record: PlanningConnectorLogicalRecord,
  createdBy: string,
): SmartConnectorInsert {
  const hasRealEntities = hasEntityEndpoints(record);

  return {
    connector_element_id: record.connector_element_id,
    board_id: record.board_id,
    source_element_id: record.source_element_id,
    target_element_id: record.target_element_id,
    source_type: hasRealEntities ? record.sourceEntityType : 'planning_element',
    source_id: hasRealEntities ? record.sourceEntityId : record.source_element_id,
    target_type: hasRealEntities ? record.targetEntityType : 'planning_element',
    target_id: hasRealEntities ? record.targetEntityId : record.target_element_id,
    relationship_type: record.relationship_type,
    connector_kind: record.connector_kind,
    label: record.label ?? null,
    style: record.style as Json,
    metadata: record.metadata as Json,
    status: record.approvedByUser ? 'approved' : 'pending',
    direction: record.direction,
    confidence: record.confidence ?? null,
    source: record.source ?? null,
    created_by: createdBy,
    logical_created_by: record.createdBy ?? null,
    is_ai_generated: record.isAIGenerated,
    approved_by_user: record.approvedByUser,
    approved_by: record.approvedBy ?? null,
  };
}

export async function upsertSmartConnector(
  record: PlanningConnectorLogicalRecord,
): Promise<SmartConnector | null> {
  const payload = toSmartConnectorInsert(record, await requireUserId());

  const { data, error } = await supabase
    .from('smart_connectors')
    .upsert(payload as never, { onConflict: 'connector_element_id' })
    .select('*')
    .single();

  if (error) throw error;
  await refreshOperationalDataLink(record, payload.created_by);
  void audit({
    resource_type: 'smart_connector',
    action: 'canvas.connector.upserted',
    resource_id: data.connector_element_id,
    scope_type: 'board',
    scope_id: data.board_id,
    metadata: {
      sourceElementId: data.source_element_id,
      targetElementId: data.target_element_id,
      relationshipType: data.relationship_type,
      connectorKind: data.connector_kind,
      status: (data as SmartConnectorWithNullableEndpoints).status ?? 'active',
    },
  });
  return data;
}

export async function upsertSmartConnectors(
  records: PlanningConnectorLogicalRecord[],
): Promise<SmartConnector[]> {
  if (records.length === 0) return [];

  const createdBy = await requireUserId();
  const payload: SmartConnectorInsert[] = records.map((record) =>
    toSmartConnectorInsert(record, createdBy),
  );

  const { data, error } = await supabase
    .from('smart_connectors')
    .upsert(payload as never, { onConflict: 'connector_element_id' })
    .select('*');

  if (error) throw error;
  await Promise.all(records.map((record) => refreshOperationalDataLink(record, createdBy)));
  (data ?? []).forEach((connector) => {
    void audit({
      resource_type: 'smart_connector',
      action: 'canvas.connector.upserted',
      resource_id: connector.connector_element_id,
      scope_type: 'board',
      scope_id: connector.board_id,
      metadata: {
        sourceElementId: connector.source_element_id,
        targetElementId: connector.target_element_id,
        relationshipType: connector.relationship_type,
        connectorKind: connector.connector_kind,
        status: (connector as SmartConnectorWithNullableEndpoints).status ?? 'active',
        batchSize: data?.length ?? 0,
      },
    });
  });
  return data ?? [];
}

export async function archiveSmartConnectorForElementUnlink(
  connector: SmartConnectorWithNullableEndpoints,
  missingElementId: string,
): Promise<void> {
  const missingEndpoint = connector.connector_element_id === missingElementId
    ? 'connector'
    : (connector.source_element_id === missingElementId ? 'source' : 'target');
  const status = missingEndpoint === 'connector' ? 'archived' : 'broken';

  const { error } = await supabase
    .from('smart_connectors' as any)
    .update({
      source_element_id: missingEndpoint === 'source' ? null : connector.source_element_id,
      target_element_id: missingEndpoint === 'target' ? null : connector.target_element_id,
      status,
      metadata: {
        ...(connector.metadata as Record<string, unknown>),
        status,
        missingElementId,
        missingEndpoint,
        archivedAt: new Date().toISOString(),
        preservedOperationalRelationship: true,
      } as Json,
    })
    .eq('id', connector.id);
  if (error) throw error;

  await archiveOperationalDataLinksByConnector(connector, missingElementId, missingEndpoint);
  void audit({
    resource_type: 'smart_connector',
    action: status === 'archived' ? 'canvas.connector.archived' : 'entity.unlinked',
    resource_id: connector.connector_element_id,
    scope_type: 'board',
    scope_id: connector.board_id,
    metadata: {
      sourceElementId: connector.source_element_id,
      targetElementId: connector.target_element_id,
      relationshipType: connector.relationship_type,
      missingElementId,
      missingEndpoint,
      status,
    },
  });
}

export async function deleteSmartConnectorByElementId(connectorElementId: string): Promise<void> {
  const { data: existing } = await supabase
    .from('smart_connectors')
    .select('*')
    .eq('connector_element_id', connectorElementId)
    .maybeSingle();
  const { error } = await supabase
    .from('smart_connectors')
    .delete()
    .eq('connector_element_id', connectorElementId);
  if (error) throw error;
  await deleteOperationalArtifactsByConnectorElementId(connectorElementId);
  if (existing) {
    void audit({
      resource_type: 'smart_connector',
      action: isOperationalRelationshipType(existing.relationship_type)
        ? 'canvas.connector.archived'
        : 'canvas.connector.deleted',
      resource_id: existing.connector_element_id,
      scope_type: 'board',
      scope_id: existing.board_id,
      metadata: {
        sourceElementId: existing.source_element_id,
        targetElementId: existing.target_element_id,
        relationshipType: existing.relationship_type,
        status: isOperationalRelationshipType(existing.relationship_type) ? 'archived' : 'deleted',
      },
    });
  }
}

export async function getSmartConnectorsForElement(
  elementId: string,
  boardId?: string,
): Promise<SmartConnectorWithNullableEndpoints[]> {
  let query = supabase
    .from('smart_connectors')
    .select('*')
    .or(`connector_element_id.eq.${elementId},source_element_id.eq.${elementId},target_element_id.eq.${elementId}`);

  if (boardId) query = query.eq('board_id', boardId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as SmartConnectorWithNullableEndpoints[];
}
