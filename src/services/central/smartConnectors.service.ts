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

function getMissingEndpoint(connector: Pick<SmartConnectorWithNullableEndpoints, 'source_element_id' | 'target_element_id'>, elementId: string): 'source' | 'target' | 'connector' | 'unknown' {
  if (connector.source_element_id === elementId) return 'source';
  if (connector.target_element_id === elementId) return 'target';
  return 'unknown';
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

  if (!isOperationalRelationshipType(record.relationship_type)) return;

  const payload: DataLinkInsert = {
    board_id: record.board_id,
    created_by: createdBy,
    source_element_id: record.source_element_id,
    target_element_id: record.target_element_id,
    source_type: 'planning_element',
    source_id: record.source_element_id,
    target_type: 'planning_element',
    target_id: record.target_element_id,
    relation_type: record.relationship_type,
    sync_type: 'manual',
    link_kind: 'operational_relationship',
    label: record.label ?? record.relationship_type,
    mapping: {
      source: 'planning_connector',
      relationshipType: record.relationship_type,
      connectorKind: record.connector_kind,
    } as Json,
    fields_map: {
      source: 'planning_connector',
      relationshipType: record.relationship_type,
      connectorKind: record.connector_kind,
    } as Json,
    metadata: {
      ...record.metadata,
      connectorElementId: record.connector_element_id,
      relationshipType: record.relationship_type,
      source: 'planningConnectorAdapter',
      status: 'active',
    } as Json,
    status: 'active',
  };

  const { error: insertError } = await supabase.from('data_links').insert(payload);
  if (insertError) throw insertError;
}

async function deleteOperationalDataLinksByConnectorElementId(
  connectorElementId: string,
): Promise<void> {
  const { error } = await supabase
    .from('data_links')
    .delete()
    .eq('link_kind', 'operational_relationship')
    .filter('metadata->>connectorElementId', 'eq', connectorElementId);
  if (error) throw error;
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
  return {
    connector_element_id: record.connector_element_id,
    board_id: record.board_id,
    source_element_id: record.source_element_id,
    target_element_id: record.target_element_id,
    relationship_type: record.relationship_type,
    connector_kind: record.connector_kind,
    label: record.label ?? null,
    style: record.style as Json,
    metadata: record.metadata as Json,
    status: 'active',
    created_by: createdBy,
  } as SmartConnectorInsert;
}

export async function upsertSmartConnector(
  record: PlanningConnectorLogicalRecord,
): Promise<SmartConnector | null> {
  const payload = toSmartConnectorInsert(record, await requireUserId());

  const { data, error } = await supabase
    .from('smart_connectors')
    .upsert(payload, { onConflict: 'connector_element_id' })
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
    .upsert(payload, { onConflict: 'connector_element_id' })
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
    : getMissingEndpoint(connector, missingElementId);
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
  if (existing && isOperationalRelationshipType(existing.relationship_type)) {
    await archiveOperationalDataLinksByConnector(
      existing as SmartConnectorWithNullableEndpoints,
      connectorElementId,
      'connector',
    );
  } else {
    await deleteOperationalDataLinksByConnectorElementId(connectorElementId);
  }
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
