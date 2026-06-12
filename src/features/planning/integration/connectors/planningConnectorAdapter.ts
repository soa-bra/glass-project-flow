import type { CanvasElement } from '@/types/canvas';
import type { PlanningElement, PlanningElementInsert } from '@/services/central/planningBoards.service';
import { normalizeRelationshipType, type UnifiedRelationshipType } from './relationshipTypes';

export type PlanningConnectorKind = 'visual_connector' | 'mindmap_connector' | 'root_connector';

export interface PlanningConnectorEndpoint {
  elementId: string;
  anchor?: string | null;
}

export type PlanningConnectorDirection = 'source_to_target' | 'target_to_source' | 'bidirectional';

export interface PlanningConnectorLogicalRecord {
  connector_element_id: string;
  board_id: string;
  source_element_id: string;
  target_element_id: string;
  relationship_type: UnifiedRelationshipType;
  connector_kind: PlanningConnectorKind;
  label?: string | null;
  style: Record<string, unknown>;
  metadata: Record<string, unknown>;
  sourceEntityId?: string | null;
  sourceEntityType?: string | null;
  targetEntityId?: string | null;
  targetEntityType?: string | null;
  direction: PlanningConnectorDirection;
  confidence?: number | null;
  source?: string | null;
  createdBy?: string | null;
  isAIGenerated: boolean;
  approvedByUser: boolean;
  approvedBy?: string | null;
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
}

function readBoolean(...values: unknown[]): boolean | null {
  for (const value of values) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (['true', 'yes', 'approved', 'user_approved'].includes(normalized)) return true;
      if (['false', 'no', 'pending', 'rejected'].includes(normalized)) return false;
    }
  }
  return null;
}

function readNumber(...values: unknown[]): number | null {
  for (const value of values) {
    const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : Number.NaN;
    if (Number.isFinite(parsed)) return Math.min(1, Math.max(0, parsed));
  }
  return null;
}

function readSideRecord(container: Record<string, any>, side: 'source' | 'target'): Record<string, any> {
  const nestedContainers = [container.entityBindings, container.entity_bindings, container.bindings, container.endpoints]
    .filter(isRecord)
    .map((nested) => nested[side]);
  const candidates = [
    container[side],
    container[`${side}Entity`],
    container[`${side}_entity`],
    container[`${side}Binding`],
    container[`${side}_binding`],
    container[`${side}Endpoint`],
    container[`${side}_endpoint`],
    ...nestedContainers,
  ];

  for (const candidate of candidates) {
    if (isRecord(candidate)) return candidate;
  }
  return {};
}

function readEntityBinding(
  data: Record<string, any>,
  metadata: Record<string, any>,
  side: 'source' | 'target',
): { entityId: string | null; entityType: string | null } {
  const metadataSide = readSideRecord(metadata, side);
  const dataSide = readSideRecord(data, side);

  return {
    entityId: readString(
      metadata[`${side}EntityId`],
      metadata[`${side}_entity_id`],
      metadataSide.entityId,
      metadataSide.entity_id,
      metadataSide.id,
      data[`${side}EntityId`],
      data[`${side}_entity_id`],
      dataSide.entityId,
      dataSide.entity_id,
      dataSide.id,
    ),
    entityType: readString(
      metadata[`${side}EntityType`],
      metadata[`${side}_entity_type`],
      metadata[`${side}EntityTable`],
      metadata[`${side}_entity_table`],
      metadataSide.entityType,
      metadataSide.entity_type,
      metadataSide.entityTable,
      metadataSide.entity_table,
      metadataSide.type,
      data[`${side}EntityType`],
      data[`${side}_entity_type`],
      data[`${side}EntityTable`],
      data[`${side}_entity_table`],
      dataSide.entityType,
      dataSide.entity_type,
      dataSide.entityTable,
      dataSide.entity_table,
      dataSide.type,
    ),
  };
}

function readDirection(data: Record<string, any>, metadata: Record<string, any>): PlanningConnectorDirection {
  const raw = readString(metadata.direction, metadata.linkDirection, data.direction, data.linkDirection);
  if (raw === 'target_to_source' || raw === 'reverse') return 'target_to_source';
  if (raw === 'bidirectional' || raw === 'both') return 'bidirectional';
  return 'source_to_target';
}

function getConnectorKind(type?: string): PlanningConnectorKind | null {
  if (type === 'visual_connector' || type === 'mindmap_connector') return type;
  if (type === 'root_connector') return 'root_connector';
  return null;
}

function isRootConnectorData(data: Record<string, unknown>): boolean {
  return Boolean((data as any)?.startPoint?.elementId && (data as any)?.endPoint?.elementId);
}

function readConnectorEndpoints(element: Pick<CanvasElement, 'type' | 'data'>): {
  source: PlanningConnectorEndpoint;
  target: PlanningConnectorEndpoint;
} | null {
  const data = (element.data ?? {}) as Record<string, any>;

  if (isRootConnectorData(data)) {
    return {
      source: {
        elementId: data.startPoint.elementId,
        anchor: data.startPoint.anchor ?? data.startPoint.anchorId ?? null,
      },
      target: {
        elementId: data.endPoint.elementId,
        anchor: data.endPoint.anchor ?? data.endPoint.anchorId ?? null,
      },
    };
  }

  if (data.startNodeId && data.endNodeId) {
    return {
      source: {
        elementId: data.startNodeId,
        anchor: data.startAnchor?.anchor ?? null,
      },
      target: {
        elementId: data.endNodeId,
        anchor: data.endAnchor?.anchor ?? null,
      },
    };
  }

  return null;
}

export function isPlanningConnectorElement(element: Pick<CanvasElement, 'type' | 'data'>): boolean {
  if (getConnectorKind(element.type)) return true;
  return element.type === 'smart' && isRootConnectorData((element.data ?? {}) as Record<string, unknown>);
}

export function toPlanningConnectorLogicalRecord(
  element: CanvasElement,
  boardId: string,
): PlanningConnectorLogicalRecord | null {
  const kind = getConnectorKind(element.type) ?? (isPlanningConnectorElement(element) ? 'root_connector' : null);
  const endpoints = readConnectorEndpoints(element);
  if (!kind || !endpoints) return null;

  const data = (element.data ?? {}) as Record<string, any>;
  const metadata = (element.metadata ?? {}) as Record<string, unknown>;
  const relationshipType = normalizeRelationshipType(
    (metadata.relationshipType as string | undefined) ??
      (data.relationshipType as string | undefined) ??
      (data.connectionType as string | undefined),
  );
  const sourceBinding = readEntityBinding(data, metadata, 'source');
  const targetBinding = readEntityBinding(data, metadata, 'target');
  const direction = readDirection(data, metadata);
  const confidence = readNumber(metadata.confidence, data.confidence, metadata.aiConfidence, data.aiConfidence);
  const source = readString(metadata.source, data.source, metadata.generatedBy, data.generatedBy);
  const createdBy = readString(metadata.createdBy, metadata.created_by, data.createdBy, data.created_by);
  const approvedBy = readString(metadata.approvedBy, metadata.approved_by, data.approvedBy, data.approved_by);
  const isAIGenerated = readBoolean(
    metadata.isAIGenerated,
    metadata.aiGenerated,
    data.isAIGenerated,
    data.aiGenerated,
  ) ?? source === 'ai';
  const approvedByUser = readBoolean(
    metadata.approvedByUser,
    metadata.userApproved,
    metadata.isApproved,
    data.approvedByUser,
    data.userApproved,
    data.isApproved,
  ) ?? Boolean(approvedBy);

  return {
    connector_element_id: element.id,
    board_id: boardId,
    source_element_id: endpoints.source.elementId,
    target_element_id: endpoints.target.elementId,
    relationship_type: relationshipType,
    connector_kind: kind,
    label: (data.label as string | undefined) ?? (data.title as string | undefined) ?? null,
    style: {
      ...(element.style ?? {}),
      color: data.color,
      strokeWidth: data.strokeWidth,
      curveStyle: data.curveStyle,
      lineStyle: data.style,
      startAnchor: endpoints.source.anchor,
      endAnchor: endpoints.target.anchor,
    },
    metadata: {
      ...metadata,
      relationshipType,
      diagramType: data.diagramType,
      bidirectional: data.bidirectional,
      sourceEntityId: sourceBinding.entityId,
      sourceEntityType: sourceBinding.entityType,
      targetEntityId: targetBinding.entityId,
      targetEntityType: targetBinding.entityType,
      direction,
      confidence,
      source,
      createdBy,
      isAIGenerated,
      approvedByUser,
      approvedBy,
    },
    sourceEntityId: sourceBinding.entityId,
    sourceEntityType: sourceBinding.entityType,
    targetEntityId: targetBinding.entityId,
    targetEntityType: targetBinding.entityType,
    direction,
    confidence,
    source,
    createdBy,
    isAIGenerated,
    approvedByUser,
    approvedBy,
  };
}

export function planningElementToConnectorLogicalRecord(
  row: PlanningElement | PlanningElementInsert,
): PlanningConnectorLogicalRecord | null {
  return toPlanningConnectorLogicalRecord(
    {
      id: row.id as string,
      type: row.element_type,
      position: (row.position as CanvasElement['position']) ?? { x: 0, y: 0 },
      size: (row.size as CanvasElement['size']) ?? { width: 0, height: 0 },
      style: (row.style as Record<string, unknown>) ?? {},
      metadata: (row.metadata as Record<string, unknown>) ?? {},
      data: (row.content as Record<string, unknown>) ?? {},
    } as CanvasElement,
    row.board_id,
  );
}

export function withConnectorRelationship<T extends { data?: Record<string, unknown>; metadata?: Record<string, unknown> }>(
  element: T,
  relationshipType: UnifiedRelationshipType = 'references',
): T {
  return {
    ...element,
    data: {
      ...(element.data ?? {}),
      relationshipType,
    },
    metadata: {
      ...(element.metadata ?? {}),
      relationshipType,
    },
  };
}
