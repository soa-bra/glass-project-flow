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

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error('Not authenticated');
  return data.user.id;
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
    link_kind: 'operational_relationship',
    label: record.label ?? record.relationship_type,
    mapping: {
      source: 'planning_connector',
      relationshipType: record.relationship_type,
      connectorKind: record.connector_kind,
    } as Json,
    metadata: {
      ...record.metadata,
      connectorElementId: record.connector_element_id,
      relationshipType: record.relationship_type,
      source: 'planningConnectorAdapter',
    } as Json,
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

export async function deleteDataLinksByElementId(elementId: string, boardId?: string): Promise<void> {
  let query = supabase
    .from('data_links')
    .delete()
    .or(`source_element_id.eq.${elementId},target_element_id.eq.${elementId},metadata->>connectorElementId.eq.${elementId}`);

  if (boardId) query = query.eq('board_id', boardId);
  const { error } = await query;
  if (error) throw error;
}

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
    created_by: createdBy,
  };
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
        batchSize: data?.length ?? 0,
      },
    });
  });
  return data ?? [];
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
  await deleteOperationalDataLinksByConnectorElementId(connectorElementId);
  if (existing) {
    void audit({
      resource_type: 'smart_connector',
      action: 'canvas.connector.deleted',
      resource_id: existing.connector_element_id,
      scope_type: 'board',
      scope_id: existing.board_id,
      metadata: {
        sourceElementId: existing.source_element_id,
        targetElementId: existing.target_element_id,
        relationshipType: existing.relationship_type,
      },
    });
  }
}
