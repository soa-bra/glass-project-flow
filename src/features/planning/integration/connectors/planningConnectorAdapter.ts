import type { CanvasElement } from '@/types/canvas';
import type { PlanningElement, PlanningElementInsert } from '@/services/central/planningBoards.service';
import { normalizeRelationshipType, type UnifiedRelationshipType } from './relationshipTypes';

export type PlanningConnectorKind = 'visual_connector' | 'mindmap_connector' | 'root_connector';

export interface PlanningConnectorEndpoint {
  elementId: string;
  anchor?: string | null;
}

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

function shouldPersistLogicalConnector(
  data: Record<string, any>,
  metadata: Record<string, unknown>,
): boolean {
  const connectorMode = (data.connectorMode ?? metadata.connectorMode) as string | undefined;
  if (connectorMode === 'visual') return false;

  const status = (data.status ?? metadata.status) as string | undefined;
  if (status && ['draft', 'pending_review', 'rejected', 'visual_only'].includes(status)) return false;

  const requiresReview = Boolean(data.requiresReview ?? metadata.requiresReview);
  const isAIGenerated = Boolean(data.isAIGenerated ?? metadata.isAIGenerated);
  const approvedByUser = Boolean(data.approvedByUser ?? metadata.approvedByUser);

  if ((requiresReview || isAIGenerated) && !approvedByUser) return false;

  return connectorMode === 'semantic' || connectorMode === 'operational' || status === 'approved' || approvedByUser;
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
    (data.relationshipType as string | undefined) ??
      (metadata.relationshipType as string | undefined) ??
      (data.connectionType as string | undefined),
  );

  if (!relationshipType || !shouldPersistLogicalConnector(data, metadata)) return null;

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
      connectorMode: data.connectorMode ?? metadata.connectorMode ?? 'semantic',
      status: data.status ?? metadata.status,
      permissionScope: data.permissionScope ?? metadata.permissionScope,
      source: data.source ?? metadata.source,
      reason: data.reason ?? metadata.reason,
      aiConfidence: data.aiConfidence ?? metadata.aiConfidence,
      requiresReview: data.requiresReview ?? metadata.requiresReview,
      isAIGenerated: data.isAIGenerated ?? metadata.isAIGenerated,
      approvedByUser: data.approvedByUser ?? metadata.approvedByUser,
      diagramType: data.diagramType,
      bidirectional: data.bidirectional,
    },
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
  relationshipType: UnifiedRelationshipType = 'reference',
): T {
  return {
    ...element,
    data: {
      ...(element.data ?? {}),
      relationshipType,
      connectorMode: 'semantic',
    },
    metadata: {
      ...(element.metadata ?? {}),
      relationshipType,
      connectorMode: 'semantic',
      status: 'approved',
      approvedByUser: true,
    },
  };
}
