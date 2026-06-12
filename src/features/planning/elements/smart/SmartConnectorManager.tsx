import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { 
  RootConnector, 
  RootConnectorData, 
  ConnectorPoint, 
  AISuggestion,
  ConnectionAnchors,
} from './RootConnector';
import { useCanvasStore } from '@/stores/canvasStore';

interface ElementBounds {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'component' | 'frame' | 'smart-element';
}

interface SmartConnectorManagerProps {
  elements: ElementBounds[];
  connectors: RootConnectorData[];
  onConnectorsChange: (connectors: RootConnectorData[]) => void;
  onInsertComponent?: (suggestion: AISuggestion, position: { x: number; y: number }) => void;
  selectedConnectorId?: string;
  onSelectConnector?: (id: string | null) => void;
  selectedElementIds?: string[];
  hoveredElementId?: string | null;
  showAnchors?: boolean;
}

export const SmartConnectorManager: React.FC<SmartConnectorManagerProps> = ({
  elements,
  connectors,
  onConnectorsChange,
  onInsertComponent,
  selectedConnectorId,
  onSelectConnector,
  selectedElementIds = [],
  hoveredElementId: hoveredConnectableElementId = null,
  showAnchors = true,
}) => {
  const viewport = useCanvasStore((state) => state.viewport);
  const [isCreatingConnector, setIsCreatingConnector] = useState(false);
  const [dragStartPoint, setDragStartPoint] = useState<ConnectorPoint | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [internalSelectedConnectorId, setInternalSelectedConnectorId] = useState<string | null>(null);
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

  const handleCreateConnector = useCallback((
    startPoint: ConnectorPoint,
    endPoint: ConnectorPoint,
    connectionType: RootConnectorData['connectionType']
  ) => {
    const newConnector: RootConnectorData = {
      id: crypto.randomUUID(),
      startPoint,
      endPoint,
      connectionType,
      relationshipType: connectionType,
      status: 'approved',
      direction: 'source_to_target',
      connectorMode: 'semantic',
      connectorPointType: 'anchor',
      branchMode: 'single',
      sourceSubAnchor: startPoint.anchorPoint,
      targetSubAnchor: endPoint.anchorPoint,
      permissionScope: 'board',
      source: 'user',
      requiresReview: false,
      isAIGenerated: false,
      approvedByUser: true,
      smartActions: [],
      color: '#9CA3AF',
      strokeWidth: 0.25,
      style: 'solid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onConnectorsChange([...connectors, newConnector]);
    selectConnector(newConnector.id);
  }, [connectors, onConnectorsChange, selectConnector]);

  const handleUpdateConnector = useCallback((id: string, data: RootConnectorData) => {
    onConnectorsChange(connectors.map(c => c.id === id ? data : c));
  }, [connectors, onConnectorsChange]);

  const handleDeleteConnector = useCallback((id: string) => {
    onConnectorsChange(connectors.filter(c => c.id !== id));
    if (effectiveSelectedConnectorId === id) selectConnector(null);
  }, [connectors, effectiveSelectedConnectorId, onConnectorsChange, selectConnector]);

  const handleAISuggest = useCallback(async (_connector: RootConnectorData): Promise<AISuggestion[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [];
  }, []);

  const handleInsertSuggestion = useCallback((
    connector: RootConnectorData,
    suggestion: AISuggestion
  ) => {
    if (suggestion.type === 'component' && onInsertComponent) {
      onInsertComponent(suggestion, suggestion.data?.position || {
        x: (connector.startPoint.x + connector.endPoint.x) / 2,
        y: (connector.startPoint.y + connector.endPoint.y) / 2,
      });
    }
  }, [onInsertComponent]);

  const handleAnchorDragStart = useCallback((point: ConnectorPoint) => {
    setDragStartPoint(point);
    setDragCurrent({ x: point.x, y: point.y });
    setIsCreatingConnector(true);
  }, []);

  // Global mousemove/mouseup while dragging from anchor → drop on any element body
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
            },
            'references',
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
        const resolvePoint = (p: ConnectorPoint): ConnectorPoint => {
          const el = elements.find(e => e.id === p.elementId);
          if (!el) return p;
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
        };
        const liveData: RootConnectorData = {
          ...connector,
          startPoint: resolvePoint(connector.startPoint),
          endPoint: resolvePoint(connector.endPoint),
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
              relationshipType: data.relationshipType || data.connectionType || 'references',
              connectionType: data.connectionType || data.relationshipType || 'references',
            })}
            onSelect={() => selectConnector(connector.id)}
            onDelete={() => handleDeleteConnector(connector.id)}
            onAISuggest={() => handleAISuggest(connector)}
            onInsertSuggestion={(suggestion) => handleInsertSuggestion(connector, suggestion)}
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
    return connectors.filter(c => 
      c.startPoint.elementId === elementId || c.endPoint.elementId === elementId
    );
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
