/**
 * Smart Connectors Service — logical persistence for visual SVG connectors
 * whose geometry is stored as `planning_elements` rows.
 */
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import type { PlanningConnectorLogicalRecord } from '@/features/planning/integration/connectors';

export type SmartConnector = PlanningConnectorLogicalRecord & {
  id: string;
  created_at: string;
  updated_at: string;
};

export async function upsertSmartConnector(
  record: PlanningConnectorLogicalRecord,
): Promise<SmartConnector | null> {
  const payload = {
    connector_element_id: record.connector_element_id,
    board_id: record.board_id,
    source_element_id: record.source_element_id,
    target_element_id: record.target_element_id,
    relationship_type: record.relationship_type,
    connector_kind: record.connector_kind,
    label: record.label ?? null,
    style: record.style as Json,
    metadata: record.metadata as Json,
  };

  const { data, error } = await supabase
    .from('smart_connectors')
    .upsert(payload, { onConflict: 'connector_element_id' })
    .select('*')
    .single();

  if (error) throw error;
  return data as SmartConnector | null;
}

export async function upsertSmartConnectors(
  records: PlanningConnectorLogicalRecord[],
): Promise<SmartConnector[]> {
  if (records.length === 0) return [];

  const payload = records.map((record) => ({
    connector_element_id: record.connector_element_id,
    board_id: record.board_id,
    source_element_id: record.source_element_id,
    target_element_id: record.target_element_id,
    relationship_type: record.relationship_type,
    connector_kind: record.connector_kind,
    label: record.label ?? null,
    style: record.style as Json,
    metadata: record.metadata as Json,
  }));

  const { data, error } = await supabase
    .from('smart_connectors')
    .upsert(payload, { onConflict: 'connector_element_id' })
    .select('*');

  if (error) throw error;
  return (data ?? []) as SmartConnector[];
}

export async function deleteSmartConnectorByElementId(connectorElementId: string): Promise<void> {
  const { error } = await supabase
    .from('smart_connectors')
    .delete()
    .eq('connector_element_id', connectorElementId);
  if (error) throw error;
}
