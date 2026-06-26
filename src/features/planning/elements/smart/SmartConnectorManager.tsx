/* eslint-disable react-refresh/only-export-components */
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { 
  RootConnector, 
  RootConnectorData, 
  ConnectorPoint, 
  AISuggestion,
  ConnectionAnchors,
  ConnectorBranch,
} from './RootConnector';
import { useCanvasStore } from '@/stores/canvasStore';
import { toast } from 'sonner';
import {
  canCreateConnector,
  canUpdateConnector,
  type ConnectorPolicyElement,
} from '@/features/planning/integration/connectors/connectorPolicy';
import { UNIFIED_RELATIONSHIP_TYPES } from '@/features/planning/integration/connectors/relationshipTypes';
import { useCanvasAIPermissions } from '@/features/planning/hooks/useCanvasAIPermissions';
import { suggestSmartConnectorRelationship, type ReadableConnectorElementForAI } from '@/features/planning/services/smartConnectorAI.service';
import { audit } from '@/services/audit';

interface ElementBounds extends ConnectorPolicyElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'component' | 'frame' | 'smart-element';
}


const resolveSubAnchor = (el: ElementBounds, x: number, y: number): string | null => {
  const relX = Math.min(0.999, Math.max(0, (x - el.x) / Math.max(1, el.width)));
  const relY = Math.min(0.999, Math.max(0, (y - el.y) / Math.max(1, el.height)));
  const col = relX < 1 / 3 ? 'left' : relX < 2 / 3 ? 'center' : 'right';
  const row = relY < 1 / 3 ? 'top' : relY < 2 / 3 ? 'middle' : 'bottom';
  return `${row}-${col}`;
};

const subAnchorToPoint = (el: ElementBounds, subAnchor?: string | null) => {
  if (!subAnchor) return null;
  const [row, col] = subAnchor.split('-');
  const xRatio = col === 'left' ? 1 / 6 : col === 'right' ? 5 / 6 : 1 / 2;
  const yRatio = row === 'top' ? 1 / 6 : row === 'bottom' ? 5 / 6 : 1 / 2;
  return { x: el.x + el.width * xRatio, y: el.y + el.height * yRatio };
};

const getPointSubAnchor = (point: ConnectorPoint): string => point.subAnchor ?? point.anchorPoint;

const getConnectorRelationshipType = (connector: RootConnectorData) => (
  connector.relationshipType ?? connector.connectionType ?? UNIFIED_RELATIONSHIP_TYPES[0]
);

const getConnectorTargets = (connector: RootConnectorData): ConnectorPoint[] => {
  if (connector.branches?.length) return connector.branches.map((branch) => branch.targetPoint);
  if (connector.targetPoints?.length) return connector.targetPoints;
  return [connector.endPoint];
};

const getConnectorSourceSubAnchor = (connector: RootConnectorData): string => (
  connector.sourceSubAnchor ?? getPointSubAnchor(connector.startPoint)
);

const isSameConnectorSource = (
  connector: RootConnectorData,
  startPoint: ConnectorPoint,
  connectionType: RootConnectorData['connectionType'],
): boolean => (
  connector.startPoint.elementId === startPoint.elementId &&
  getConnectorSourceSubAnchor(connector) === getPointSubAnchor(startPoint) &&
  getConnectorRelationshipType(connector) === connectionType
);

const isSameConnectorTarget = (target: ConnectorPoint, point: ConnectorPoint): boolean => (
  target.elementId === point.elementId && getPointSubAnchor(target) === getPointSubAnchor(point)
);

const createBranch = (
  connector: RootConnectorData,
  targetPoint: ConnectorPoint,
  targetSubAnchor = getPointSubAnchor(targetPoint),
): ConnectorBranch => ({
  id: crypto.randomUUID(),
  targetPoint,
  sourceSubAnchor: getConnectorSourceSubAnchor(connector),
  targetSubAnchor,
});

const getConnectorBranchesWithPrimaryTarget = (connector: RootConnectorData): ConnectorBranch[] => {
  if (connector.branches?.length) return connector.branches;
  if (connector.targetPoints?.length) {
    return connector.targetPoints.map((targetPoint) => createBranch(connector, targetPoint));
  }
  return [createBranch(connector, connector.endPoint, connector.targetSubAnchor ?? getPointSubAnchor(connector.endPoint))];
};

interface SmartConnectorManagerProps {
  elements: ElementBounds[];
  boardId?: string | null;
  readableAIElements?: ReadableConnectorElementForAI[];
  connectors: RootConnectorData[];
  onConnectorsChange: (connectors: RootConnectorData[]) => void;
  onInsertComponent?: (suggestion: AISuggestion, position: { x: number; y: number }) => void;
  selectedConnectorId?: string;
  onSelectConnector?: (id: string | null) => void;
  selectedElementIds?: string[];
  hoveredElementId?: string | null;
  showAnchors?: boolean;
  canEditBoard?: boolean;
  canCreateOperationalRelationship?: boolean;
}

export const SmartConnectorManager: React.FC<SmartConnectorManagerProps> = ({
  elements,
  boardId,
  readableAIElements = [],
  connectors,
  onConnectorsChange,
  onInsertComponent,
  selectedConnectorId,
  onSelectConnector,
  selectedElementIds = [],
  hoveredElementId: hoveredConnectableElementId = null,
  showAnchors = true,
  canEditBoard = true,
  canCreateOperationalRelationship = true,
}) => {
  const aiPermissions = useCanvasAIPermissions(boardId);
  const viewport = useCanvasStore((state) => state.viewport);
  const [isCreatingConnector, setIsCreatingConnector] = useState(false);
  const [dragStartPoint, setDragStartPoint] = useState<ConnectorPoint | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [internalSelectedConnectorId, setInternalSelectedConnectorId] = useState<string | null>(null);
  const [policyMessage, setPolicyMessage] = useState<{ message: string; x: number; y: number } | null>(null);
  const effectiveSelectedConnectorId = selectedConnectorId ?? internalSelectedConnectorId;
  const selectConnector = useCallback((id: string | null) => {
    setInternalSelectedConnectorId(id);
    onSelectConnector?.(id);
  }, [onSelectConnector]);
  const svgGroupRef = useRef<SVGGElement | null>(null);

  // Show anchors for selected or hovered, non-connector elements.
  const anchoredElements = useMemo(() => {
    const anchorElementIds = new Set(selectedElementIds);
    if (hoveredConnectableElementId) anchorElementIds.add(hoveredConnectableElementId);
    return elements.filter((el) => anchorElementIds.has(el.id));
  }, [elements, hoveredConnectableElementId, selectedElementIds]);

  const showPolicyRejection = useCallback((reason: string, point?: ConnectorPoint | { x: number; y: number }) => {
    const fallbackPoint = dragCurrent ?? dragStartPoint ?? { x: 24, y: 24 };
    setPolicyMessage({
      message: reason,
      x: point?.x ?? fallbackPoint.x,
      y: point?.y ?? fallbackPoint.y,
    });
    toast.error('تعذر إنشاء العلاقة', { description: reason });
  }, [dragCurrent, dragStartPoint]);

  const handleCreateConnector = useCallback((
    startPoint: ConnectorPoint,
    endPoint: ConnectorPoint,
    connectionType: RootConnectorData['connectionType']
  ) => {
    const source = elements.find((element) => element.id === startPoint.elementId);
    const target = elements.find((element) => element.id === endPoint.elementId);

    if (!source || !target) {
      showPolicyRejection('تعذر العثور على أحد طرفي العلاقة داخل اللوحة.', endPoint);
      return;
    }

    const policyDecision = canCreateConnector({
      board: { canEditBoard, canCreateOperationalRelationship },
      source,
      target,
      relationshipType: connectionType,
    });

    if (!policyDecision.allowed) {
      showPolicyRejection(policyDecision.reason, endPoint);
      return;
    }

    setPolicyMessage(null);
    const now = new Date().toISOString();
    const existingConnector = connectors.find((connector) => isSameConnectorSource(connector, startPoint, connectionType));

    if (existingConnector) {
      const existingTargets = getConnectorTargets(existingConnector);
      if (existingTargets.some((targetPoint) => isSameConnectorTarget(targetPoint, endPoint))) {
        selectConnector(existingConnector.id);
        toast.info('العلاقة موجودة بالفعل', { description: 'تم تحديد الموصل الحالي بدل إنشاء نسخة مكررة.' });
        return;
      }

      const updatedConnector: RootConnectorData = {
        ...existingConnector,
        branches: [
          ...getConnectorBranchesWithPrimaryTarget(existingConnector),
          createBranch(existingConnector, endPoint, endPoint.subAnchor ?? endPoint.anchorPoint),
        ],
        targetPoints: undefined,
        branchMode: 'branch',
        connectorPointType: startPoint.subAnchor || endPoint.subAnchor ? 'sub_anchor' : 'anchor',
        updatedAt: now,
      };

      onConnectorsChange(connectors.map((connector) => connector.id === existingConnector.id ? updatedConnector : connector));
      selectConnector(existingConnector.id);
      return;
    }

    const newConnector: RootConnectorData = {
      id: crypto.randomUUID(),
      startPoint,
      endPoint,
      connectionType,
      relationshipType: connectionType,
      status: 'approved',
      direction: 'source_to_target',
      connectorMode: 'semantic',
      connectorPointType: startPoint.subAnchor || endPoint.subAnchor ? 'sub_anchor' : 'anchor',
      branchMode: 'single',
      sourceSubAnchor: startPoint.subAnchor ?? startPoint.anchorPoint,
      targetSubAnchor: endPoint.subAnchor ?? endPoint.anchorPoint,
      permissionScope: 'board',
      source: 'user',
      requiresReview: false,
      isAIGenerated: false,
      approvedByUser: true,
      smartActions: [],
      color: '#9CA3AF',
      strokeWidth: 0.25,
      style: 'solid',
      createdAt: now,
      updatedAt: now,
    };
    onConnectorsChange([...connectors, newConnector]);
    selectConnector(newConnector.id);
  }, [canCreateOperationalRelationship, canEditBoard, connectors, elements, onConnectorsChange, selectConnector, showPolicyRejection]);

  const handleUpdateConnector = useCallback((id: string, data: RootConnectorData) => {
    const source = elements.find((element) => element.id === data.startPoint.elementId);
    const existingConnector = connectors.find((connector) => connector.id === id);

    if (!source) {
      showPolicyRejection('تعذر العثور على مصدر العلاقة داخل اللوحة.', data.startPoint);
      return;
    }

    const relationshipType = data.relationshipType ?? data.connectionType;
    const connectorArchived = Boolean((existingConnector as RootConnectorData & { archived?: boolean })?.archived);
    const connectorLocked = Boolean((existingConnector as RootConnectorData & { locked?: boolean })?.locked);

    for (const targetPoint of getConnectorTargets(data)) {
      const target = elements.find((element) => element.id === targetPoint.elementId);
      if (!target) {
        showPolicyRejection('تعذر العثور على أحد أهداف العلاقة داخل اللوحة.', targetPoint);
        return;
      }

      const policyDecision = canUpdateConnector({
        board: { canEditBoard, canCreateOperationalRelationship },
        source,
        target,
        relationshipType,
        connectorArchived,
        connectorLocked,
      });

      if (!policyDecision.allowed) {
        showPolicyRejection(policyDecision.reason, targetPoint);
        return;
      }
    }

    setPolicyMessage(null);
    onConnectorsChange(connectors.map(c => c.id === id ? data : c));
  }, [canCreateOperationalRelationship, canEditBoard, connectors, elements, onConnectorsChange, showPolicyRejection]);

  const handleDeleteConnector = useCallback((id: string) => {
    onConnectorsChange(connectors.filter(c => c.id !== id));
    if (effectiveSelectedConnectorId === id) selectConnector(null);
  }, [connectors, effectiveSelectedConnectorId, onConnectorsChange, selectConnector]);

  const handleAISuggest = useCallback(async (connector: RootConnectorData): Promise<AISuggestion[]> => {
    if (!aiPermissions.canUseAI) {
      throw new Error(aiPermissions.denialReason || 'لا تملك صلاحية استخدام الذكاء الاصطناعي على هذه اللوحة');
    }

    const readableElementsById = new Set(readableAIElements.map((element) => element.id));
    const canReadBothEndpoints =
      readableElementsById.has(connector.startPoint.elementId) &&
      readableElementsById.has(connector.endPoint.elementId);

    if (!canReadBothEndpoints) {
      throw new Error('لا يمكن إرسال عناصر لا يملك المستخدم صلاحية قراءتها إلى AI');
    }

    const suggestion = await suggestSmartConnectorRelationship({
      boardId,
      sourceElementId: connector.startPoint.elementId,
      targetElementId: connector.endPoint.elementId,
      readableElements: readableAIElements,
      existingLinks: connectors.map((item) => ({
        id: item.id,
        sourceElementId: item.startPoint.elementId,
        targetElementId: item.endPoint.elementId,
        relationshipType: item.relationshipType ?? item.connectionType,
        status: item.status,
      })),
    });

    if (!suggestion) return [];

    void audit({
      resource_type: 'smart_connector',
      action: 'canvas.connector.ai_suggestion.created',
      resource_id: connector.id,
      scope_type: boardId ? 'board' : null,
      scope_id: boardId ?? null,
      metadata: {
        sourceElementId: connector.startPoint.elementId,
        targetElementId: connector.endPoint.elementId,
        relationshipType: suggestion.relationshipType,
        aiConfidence: suggestion.confidence,
        readableElementCount: readableAIElements.length,
      },
    });

    return [{
      id: `ai-connector-${connector.id}-${Date.now()}`,
      type: 'connector',
      title: suggestion.title,
      description: suggestion.description,
      confidence: suggestion.confidence,
      data: {
        relationshipType: suggestion.relationshipType,
        reasoning: suggestion.reasoning,
        connectorPatch: {
          relationshipType: suggestion.relationshipType,
          status: 'suggested',
          source: 'ai',
          aiConfidence: suggestion.confidence,
          requiresReview: true,
          approvedByUser: false,
        },
      },
    }];
  }, [aiPermissions.canUseAI, aiPermissions.denialReason, boardId, connectors, readableAIElements]);

  const handleInsertSuggestion = useCallback((
    connector: RootConnectorData,
    suggestion: AISuggestion
  ) => {
    if (suggestion.type === 'component' && onInsertComponent) {
      onInsertComponent(suggestion, suggestion.data?.position || {
        x: (connector.startPoint.x + connector.endPoint.x) / 2,
        y: (connector.startPoint.y + connector.endPoint.y) / 2,
      });
      return;
    }

    if (suggestion.type !== 'connector') return;

    const relationshipType = (suggestion.data?.relationshipType ?? connector.relationshipType ?? connector.connectionType ?? UNIFIED_RELATIONSHIP_TYPES[0]) as RootConnectorData['relationshipType'];
    const now = new Date().toISOString();
    const approvedConnector: RootConnectorData = {
      ...connector,
      connectionType: relationshipType,
      relationshipType,
      status: 'approved',
      source: connector.source ?? 'ai',
      aiConfidence: suggestion.confidence ?? connector.aiConfidence,
      requiresReview: false,
      approvedByUser: true,
      aiSuggestions: connector.aiSuggestions?.filter((item) => item.id !== suggestion.id),
      updatedAt: now,
    };

    handleUpdateConnector(connector.id, approvedConnector);
    void audit({
      resource_type: 'smart_connector',
      action: 'canvas.connector.ai_suggestion.approved',
      resource_id: connector.id,
      scope_type: boardId ? 'board' : null,
      scope_id: boardId ?? null,
      metadata: {
        sourceElementId: connector.startPoint.elementId,
        targetElementId: connector.endPoint.elementId,
        relationshipType,
        aiConfidence: approvedConnector.aiConfidence,
      },
    });
  }, [boardId, handleUpdateConnector, onInsertComponent]);


  const handleCreateWorkflow = useCallback((connector: RootConnectorData) => {
    const now = new Date().toISOString();
    handleUpdateConnector(connector.id, {
      ...connector,
      status: 'operational',
      purpose: 'operational',
      connectorMode: 'operational',
      requiresReview: false,
      approvedByUser: true,
      updatedAt: now,
    });
    toast.success('تم تجهيز Workflow من العلاقة', {
      description: 'تم تحويل العلاقة إلى حالة تشغيلية ويمكن ربطها بخطوات العمل.',
    });
    void audit({
      resource_type: 'smart_connector',
      action: 'canvas.connector.workflow.create_requested',
      resource_id: connector.id,
      scope_type: boardId ? 'board' : null,
      scope_id: boardId ?? null,
      metadata: {
        sourceElementId: connector.startPoint.elementId,
        targetElementId: connector.endPoint.elementId,
        relationshipType: connector.relationshipType ?? connector.connectionType,
      },
    });
  }, [boardId, handleUpdateConnector]);

  const handleCreateElementFromConnector = useCallback((connector: RootConnectorData) => {
    const position = {
      x: (connector.startPoint.x + connector.endPoint.x) / 2,
      y: (connector.startPoint.y + connector.endPoint.y) / 2,
    };
    const suggestion: AISuggestion = {
      id: `connector-element-${connector.id}-${Date.now()}`,
      type: 'component',
      title: 'عنصر من علاقة',
      description: `عنصر مولّد من علاقة ${connector.relationshipType ?? connector.connectionType ?? UNIFIED_RELATIONSHIP_TYPES[0]}`,
      confidence: 1,
      data: {
        position,
        sourceConnectorId: connector.id,
        relationshipType: connector.relationshipType ?? connector.connectionType,
      },
    };

    if (onInsertComponent) {
      onInsertComponent(suggestion, position);
      toast.success('تم إنشاء عنصر من العلاقة');
    } else {
      toast.info('تم طلب إنشاء عنصر من العلاقة', { description: 'لم يتم تمرير معالج إدراج عنصر لهذه اللوحة.' });
    }

    void audit({
      resource_type: 'smart_connector',
      action: 'canvas.connector.element.create_requested',
      resource_id: connector.id,
      scope_type: boardId ? 'board' : null,
      scope_id: boardId ?? null,
      metadata: {
        sourceElementId: connector.startPoint.elementId,
        targetElementId: connector.endPoint.elementId,
        relationshipType: connector.relationshipType ?? connector.connectionType,
      },
    });
  }, [boardId, onInsertComponent]);

  const handleAnchorDragStart = useCallback((point: ConnectorPoint) => {
    setDragStartPoint(point);
    setDragCurrent({ x: point.x, y: point.y });
    setIsCreatingConnector(true);
  }, []);

  // Global mousemove/mouseup while dragging from anchor -> drop on any element body
  useEffect(() => {
    if (!isCreatingConnector || !dragStartPoint) return;

    const clientToCanvas = (clientX: number, clientY: number) => {
      const svgEl = svgGroupRef.current?.ownerSVGElement;
      if (!svgEl) return null;
      const rect = svgEl.getBoundingClientRect();
      const zoom = viewport.zoom || 1;
      return {
        x: (clientX - rect.left) / zoom,
        y: (clientY - rect.top) / zoom,
      };
    };

    const findElementAt = (x: number, y: number) => {
      // Prefer non-frame elements (frames are background containers and should not
      // capture connector drops when a card sits on top of them).
      const candidates = elements.filter(
        (el) =>
          el.id !== dragStartPoint.elementId &&
          x >= el.x && x <= el.x + el.width &&
          y >= el.y && y <= el.y + el.height,
      );
      const nonFrame = candidates.find((el) => el.type !== 'frame');
      return nonFrame ?? candidates[0];
    };

    const onMove = (e: MouseEvent) => {
      const p = clientToCanvas(e.clientX, e.clientY);
      if (!p) return;
      setDragCurrent(p);
      const hovered = findElementAt(p.x, p.y);
      setHoveredElementId(hovered?.id ?? null);
    };

    const nearestEdgeAnchor = (el: ElementBounds, x: number, y: number) => {
      const dLeft = x - el.x;
      const dRight = (el.x + el.width) - x;
      const dTop = y - el.y;
      const dBottom = (el.y + el.height) - y;
      const min = Math.min(dLeft, dRight, dTop, dBottom);
      if (min === dLeft) return { anchor: 'left' as const, x: el.x, y: el.y + el.height / 2 };
      if (min === dRight) return { anchor: 'right' as const, x: el.x + el.width, y: el.y + el.height / 2 };
      if (min === dTop) return { anchor: 'top' as const, x: el.x + el.width / 2, y: el.y };
      return { anchor: 'bottom' as const, x: el.x + el.width / 2, y: el.y + el.height };
    };

    const onUp = (e: MouseEvent) => {
      const p = clientToCanvas(e.clientX, e.clientY);
      if (p) {
        const target = findElementAt(p.x, p.y);
        if (target) {
          const edge = nearestEdgeAnchor(target, p.x, p.y);
          handleCreateConnector(
            dragStartPoint,
            {
              elementId: target.id,
              x: edge.x,
              y: edge.y,
              anchorPoint: edge.anchor,
              subAnchor: resolveSubAnchor(target, p.x, p.y),
            },
            UNIFIED_RELATIONSHIP_TYPES[0],
          );
        }
      }
      setDragStartPoint(null);
      setDragCurrent(null);
      setHoveredElementId(null);
      setIsCreatingConnector(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDragStartPoint(null);
        setDragCurrent(null);
        setHoveredElementId(null);
        setIsCreatingConnector(false);
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('keydown', onKey);
    };
  }, [isCreatingConnector, dragStartPoint, elements, viewport.zoom, handleCreateConnector]);

  const resolvePoint = useCallback((p: ConnectorPoint): ConnectorPoint => {
    const el = elements.find(e => e.id === p.elementId);
    if (!el) return p;
    const subAnchorPoint = subAnchorToPoint(el, p.subAnchor);
    if (subAnchorPoint) return { ...p, ...subAnchorPoint };
    const anchorToXY = (a: typeof p.anchorPoint) => {
      switch (a) {
        case 'top': return { x: el.x + el.width / 2, y: el.y };
        case 'bottom': return { x: el.x + el.width / 2, y: el.y + el.height };
        case 'left': return { x: el.x, y: el.y + el.height / 2 };
        case 'right': return { x: el.x + el.width, y: el.y + el.height / 2 };
        case 'top-left': return { x: el.x, y: el.y };
        case 'top-right': return { x: el.x + el.width, y: el.y };
        case 'bottom-left': return { x: el.x, y: el.y + el.height };
        case 'bottom-right': return { x: el.x + el.width, y: el.y + el.height };
        case 'center':
        default: return { x: el.x + el.width / 2, y: el.y + el.height / 2 };
      }
    };
    const { x, y } = anchorToXY(p.anchorPoint);
    return { ...p, x, y };
  }, [elements]);

  return (
    <g ref={svgGroupRef} className="smart-connector-manager" style={{ pointerEvents: 'auto' }}>
      {/* Hover highlight on target element */}
      {hoveredElementId && (() => {
        const el = elements.find(e => e.id === hoveredElementId);
        if (!el) return null;
        return (
          <rect
            x={el.x - 3}
            y={el.y - 3}
            width={el.width + 6}
            height={el.height + 6}
            fill="hsl(var(--primary) / 0.08)"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            strokeDasharray="6,4"
            rx={10}
            className="pointer-events-none"
          />
        );
      })()}

      {/* Connection Anchors — selected or hovered elements */}
      {showAnchors && anchoredElements.map(element => (
        <ConnectionAnchors
          key={element.id}
          elementId={element.id}
          bounds={element}
          onStartDrag={handleAnchorDragStart}
          isConnecting={isCreatingConnector}
        />
      ))}

      {/* Render all connectors — endpoints recomputed live from current element bounds */}
      {connectors.map(connector => {
        const liveData: RootConnectorData = {
          ...connector,
          startPoint: resolvePoint(connector.startPoint),
          endPoint: resolvePoint(connector.endPoint),
          targetPoints: connector.targetPoints?.map(resolvePoint),
          branches: connector.branches?.map((branch) => ({
            ...branch,
            targetPoint: resolvePoint(branch.targetPoint),
          })),
        };
        return (
          <RootConnector
            key={connector.id}
            data={liveData}
            isSelected={effectiveSelectedConnectorId === connector.id}
            onUpdate={(data) => handleUpdateConnector(connector.id, {
              ...data,
              // preserve the original anchor descriptors, never persist the resolved x/y
              startPoint: { ...connector.startPoint, anchorPoint: data.startPoint.anchorPoint },
              endPoint: { ...connector.endPoint, anchorPoint: data.endPoint.anchorPoint },
              targetPoints: connector.targetPoints,
              branches: connector.branches,
              relationshipType: data.relationshipType || data.connectionType || UNIFIED_RELATIONSHIP_TYPES[0],
              connectionType: data.connectionType || data.relationshipType || UNIFIED_RELATIONSHIP_TYPES[0],
            })}
            onSelect={() => selectConnector(connector.id)}
            onDelete={() => handleDeleteConnector(connector.id)}
            onAISuggest={() => handleAISuggest(connector)}
            onInsertSuggestion={(suggestion) => handleInsertSuggestion(connector, suggestion)}
            onCreateWorkflow={handleCreateWorkflow}
            onCreateElement={handleCreateElementFromConnector}
          />
        );
      })}

      {/* Preview line while dragging — neutral grey, matches final connector */}
      {isCreatingConnector && dragStartPoint && dragCurrent && (
        <g className="pointer-events-none">
          <line
            x1={dragStartPoint.x}
            y1={dragStartPoint.y}
            x2={dragCurrent.x}
            y2={dragCurrent.y}
            stroke="#0B0F12"
            strokeWidth={1.5}
            strokeDasharray="6,4"
            strokeLinecap="round"
            opacity={0.7}
          />
          <circle cx={dragStartPoint.x} cy={dragStartPoint.y} r={3} fill="#0B0F12" />
          <circle cx={dragCurrent.x} cy={dragCurrent.y} r={3} fill="#0B0F12" opacity={0.6} />
        </g>
      )}
    </g>
  );
};

// Hook for managing connectors
export const useSmartConnectors = (initialConnectors: RootConnectorData[] = []) => {
  const [connectors, setConnectors] = useState<RootConnectorData[]>(initialConnectors);
  const [selectedConnectorId, setSelectedConnectorId] = useState<string | null>(null);

  const addConnector = useCallback((connector: Omit<RootConnectorData, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newConnector: RootConnectorData = {
      ...connector,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setConnectors(prev => [...prev, newConnector]);
    return newConnector;
  }, []);

  const updateConnector = useCallback((id: string, updates: Partial<RootConnectorData>) => {
    setConnectors(prev => prev.map(c => 
      c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
    ));
  }, []);

  const removeConnector = useCallback((id: string) => {
    setConnectors(prev => prev.filter(c => c.id !== id));
    if (selectedConnectorId === id) setSelectedConnectorId(null);
  }, [selectedConnectorId]);

  const getConnectorsByElement = useCallback((elementId: string) => {
    return connectors.filter((connector) => {
      if (connector.startPoint.elementId === elementId || connector.endPoint.elementId === elementId) {
        return true;
      }
      return getConnectorTargets(connector).some((targetPoint) => targetPoint.elementId === elementId);
    });
  }, [connectors]);

  const selectedConnector = useMemo(() => 
    connectors.find(c => c.id === selectedConnectorId),
    [connectors, selectedConnectorId]
  );

  return {
    connectors,
    setConnectors,
    selectedConnectorId,
    setSelectedConnectorId,
    selectedConnector,
    addConnector,
    updateConnector,
    removeConnector,
    getConnectorsByElement,
  };
};

export default SmartConnectorManager;
