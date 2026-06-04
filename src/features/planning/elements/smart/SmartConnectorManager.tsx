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
  showAnchors = true,
}) => {
  const viewport = useCanvasStore((state) => state.viewport);
  const [isCreatingConnector, setIsCreatingConnector] = useState(false);
  const [dragStartPoint, setDragStartPoint] = useState<ConnectorPoint | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const svgGroupRef = useRef<SVGGElement | null>(null);

  // Only show anchors for selected, non-connector elements
  const anchoredElements = useMemo(
    () => elements.filter((el) => selectedElementIds.includes(el.id)),
    [elements, selectedElementIds],
  );

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
      color: 'hsl(var(--primary))',
      strokeWidth: 2,
      style: 'solid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onConnectorsChange([...connectors, newConnector]);
    onSelectConnector?.(newConnector.id);
  }, [connectors, onConnectorsChange, onSelectConnector]);

  const handleUpdateConnector = useCallback((id: string, data: RootConnectorData) => {
    onConnectorsChange(connectors.map(c => c.id === id ? data : c));
  }, [connectors, onConnectorsChange]);

  const handleDeleteConnector = useCallback((id: string) => {
    onConnectorsChange(connectors.filter(c => c.id !== id));
    if (selectedConnectorId === id) onSelectConnector?.(null);
  }, [connectors, onConnectorsChange, selectedConnectorId, onSelectConnector]);

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

    const findElementAt = (x: number, y: number) =>
      elements.find((el) =>
        el.id !== dragStartPoint.elementId &&
        x >= el.x && x <= el.x + el.width &&
        y >= el.y && y <= el.y + el.height,
      );

    const onMove = (e: MouseEvent) => {
      const p = clientToCanvas(e.clientX, e.clientY);
      if (!p) return;
      setDragCurrent(p);
      const hovered = findElementAt(p.x, p.y);
      setHoveredElementId(hovered?.id ?? null);
    };

    const onUp = (e: MouseEvent) => {
      const p = clientToCanvas(e.clientX, e.clientY);
      if (p) {
        const target = findElementAt(p.x, p.y);
        if (target) {
          handleCreateConnector(
            dragStartPoint,
            {
              elementId: target.id,
              x: target.x + target.width / 2,
              y: target.y + target.height / 2,
              anchorPoint: 'center',
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

      {/* Connection Anchors — only for selected elements */}
      {showAnchors && anchoredElements.map(element => (
        <ConnectionAnchors
          key={element.id}
          elementId={element.id}
          bounds={element}
          onStartDrag={handleAnchorDragStart}
          isConnecting={isCreatingConnector}
        />
      ))}

      {/* Render all connectors */}
      {connectors.map(connector => (
        <RootConnector
          key={connector.id}
          data={connector}
          isSelected={selectedConnectorId === connector.id}
          onUpdate={(data) => handleUpdateConnector(connector.id, data)}
          onDelete={() => handleDeleteConnector(connector.id)}
          onAISuggest={() => handleAISuggest(connector)}
          onInsertSuggestion={(suggestion) => handleInsertSuggestion(connector, suggestion)}
        />
      ))}

      {/* Preview line while dragging */}
      {isCreatingConnector && dragStartPoint && dragCurrent && (
        <line
          x1={dragStartPoint.x}
          y1={dragStartPoint.y}
          x2={dragCurrent.x}
          y2={dragCurrent.y}
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          strokeDasharray="6,4"
          opacity={0.85}
          className="pointer-events-none"
        />
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
