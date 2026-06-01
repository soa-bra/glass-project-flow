/**
 * Smart Connectors Service — logical persistence for visual SVG connectors
 * whose geometry is stored as `planning_elements` rows.
 */
import { supabase } from '@/integrations/supabase/client';
import type { Database, Json } from '@/integrations/supabase/types';
import type { PlanningConnectorLogicalRecord } from '@/features/planning/integration/connectors';

export type SmartConnector = Database['public']['Tables']['smart_connectors']['Row'];
type SmartConnectorInsert = Database['public']['Tables']['smart_connectors']['Insert'];

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error('Not authenticated');
  return data.user.id;
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
  return data ?? [];
}

export async function deleteSmartConnectorByElementId(connectorElementId: string): Promise<void> {
  const { error } = await supabase
    .from('smart_connectors')
    .delete()
    .eq('connector_element_id', connectorElementId);
  if (error) throw error;
}
