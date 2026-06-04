/**
 * @specRef planning/smart-connectors
 * SmartConnectorManager — orchestrates RootConnector anchors and drag-to-create
 * workflow. Includes a debug overlay (anchor hitboxes, drag start/current,
 * hovered target, live checklist) toggled via the connectorDebug store.
 */
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  RootConnector,
  RootConnectorData,
  ConnectorPoint,
  AISuggestion,
  ConnectionAnchors,
} from './RootConnector';
import { useCanvasStore } from '@/stores/canvasStore';
import { useConnectorDebug, setConnectorDebug, ANCHOR_OFFSET } from './connectorDebug';

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

interface ChecklistState {
  anchorMounted: boolean;
  pointerDownCaptured: boolean;
  dragActive: boolean;
  hoverTargetFound: boolean;
  dropCompleted: boolean;
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
  const [debug] = useConnectorDebug();

  const [isCreatingConnector, setIsCreatingConnector] = useState(false);
  const [dragStartPoint, setDragStartPoint] = useState<ConnectorPoint | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number; client: { x: number; y: number } } | null>(null);
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<ChecklistState>({
    anchorMounted: false,
    pointerDownCaptured: false,
    dragActive: false,
    hoverTargetFound: false,
    dropCompleted: false,
  });
  const svgGroupRef = useRef<SVGGElement | null>(null);

  const anchoredElements = useMemo(
    () => elements.filter((el) => selectedElementIds.includes(el.id)),
    [elements, selectedElementIds],
  );

  useEffect(() => {
    setChecklist((c) => ({ ...c, anchorMounted: anchoredElements.length > 0 }));
  }, [anchoredElements.length]);

  const handleCreateConnector = useCallback((
    startPoint: ConnectorPoint,
    endPoint: ConnectorPoint,
    connectionType: RootConnectorData['connectionType'],
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
    onConnectorsChange(connectors.map((c) => (c.id === id ? data : c)));
  }, [connectors, onConnectorsChange]);

  const handleDeleteConnector = useCallback((id: string) => {
    onConnectorsChange(connectors.filter((c) => c.id !== id));
    if (selectedConnectorId === id) onSelectConnector?.(null);
  }, [connectors, onConnectorsChange, selectedConnectorId, onSelectConnector]);

  const handleAISuggest = useCallback(async (): Promise<AISuggestion[]> => {
    await new Promise((r) => setTimeout(r, 600));
    return [];
  }, []);

  const handleInsertSuggestion = useCallback((
    connector: RootConnectorData,
    suggestion: AISuggestion,
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
    setDragCurrent({ x: point.x, y: point.y, client: { x: 0, y: 0 } });
    setIsCreatingConnector(true);
    setChecklist((c) => ({
      ...c,
      pointerDownCaptured: true,
      dragActive: true,
      hoverTargetFound: false,
      dropCompleted: false,
    }));
  }, []);

  // Global pointer tracking during drag
  useEffect(() => {
    if (!isCreatingConnector || !dragStartPoint) return;

    const clientToCanvas = (clientX: number, clientY: number) => {
      const svgEl = svgGroupRef.current?.ownerSVGElement;
      if (!svgEl) return null;
      const rect = svgEl.getBoundingClientRect();
      const zoom = viewport.zoom || 1;
      return { x: (clientX - rect.left) / zoom, y: (clientY - rect.top) / zoom };
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
      setDragCurrent({ ...p, client: { x: e.clientX, y: e.clientY } });
      const hovered = findElementAt(p.x, p.y);
      setHoveredElementId(hovered?.id ?? null);
      setChecklist((c) => (c.hoverTargetFound === !!hovered ? c : { ...c, hoverTargetFound: !!hovered }));
    };

    const onUp = (e: MouseEvent) => {
      const p = clientToCanvas(e.clientX, e.clientY);
      let dropped = false;
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
          dropped = true;
        }
      }
      if (debug) {
        // eslint-disable-next-line no-console
        console.log('[connector:debug] drop', { dropped, point: p });
      }
      setChecklist((c) => ({ ...c, dropCompleted: dropped, dragActive: false }));
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
        setChecklist((c) => ({ ...c, dragActive: false }));
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
  }, [isCreatingConnector, dragStartPoint, elements, viewport.zoom, handleCreateConnector, debug]);

  return (
    <>
      <g ref={svgGroupRef} className="smart-connector-manager" style={{ pointerEvents: 'auto' }}>
        {/* Debug: outline every connectable element */}
        {debug && elements.map((el) => (
          <rect
            key={`dbg-${el.id}`}
            x={el.x}
            y={el.y}
            width={el.width}
            height={el.height}
            fill="none"
            stroke="hsl(var(--primary) / 0.35)"
            strokeWidth={1}
            strokeDasharray="4,4"
            className="pointer-events-none"
          />
        ))}

        {/* Hover highlight on target element during drag */}
        {hoveredElementId && (() => {
          const el = elements.find((e) => e.id === hoveredElementId);
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

        {/* Connection anchors — only for selected elements */}
        {showAnchors && anchoredElements.map((element) => (
          <ConnectionAnchors
            key={element.id}
            elementId={element.id}
            bounds={element}
            onStartDrag={handleAnchorDragStart}
            isConnecting={isCreatingConnector}
          />
        ))}

        {/* Existing connectors */}
        {connectors.map((connector) => (
          <RootConnector
            key={connector.id}
            data={connector}
            isSelected={selectedConnectorId === connector.id}
            onUpdate={(data) => handleUpdateConnector(connector.id, data)}
            onDelete={() => handleDeleteConnector(connector.id)}
            onAISuggest={handleAISuggest}
            onInsertSuggestion={(suggestion) => handleInsertSuggestion(connector, suggestion)}
          />
        ))}

        {/* Live drag preview */}
        {isCreatingConnector && dragStartPoint && dragCurrent && (
          <>
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
            {debug && (
              <>
                <circle cx={dragStartPoint.x} cy={dragStartPoint.y} r={5} fill="hsl(var(--primary))" className="pointer-events-none" />
                <circle cx={dragCurrent.x} cy={dragCurrent.y} r={5} fill="hsl(var(--destructive))" className="pointer-events-none" />
                <text
                  x={dragCurrent.x + 8}
                  y={dragCurrent.y - 8}
                  fontSize={10}
                  fill="hsl(var(--destructive))"
                  style={{ fontFamily: 'monospace' }}
                  className="pointer-events-none"
                >
                  {`(${dragCurrent.x.toFixed(0)}, ${dragCurrent.y.toFixed(0)})`}
                </text>
              </>
            )}
          </>
        )}
      </g>

      {/* Debug HUD (HTML, portaled outside the SVG) */}
      {debug && typeof document !== 'undefined' && createPortal(
        <ConnectorDebugHUD
          checklist={checklist}
          dragStart={dragStartPoint}
          dragCurrent={dragCurrent}
          hoveredElementId={hoveredElementId}
          selectedCount={selectedElementIds.length}
          totalElements={elements.length}
          zoom={viewport.zoom}
        />,
        document.body,
      )}
    </>
  );
};

// ============= Debug HUD =============
interface DebugHUDProps {
  checklist: ChecklistState;
  dragStart: ConnectorPoint | null;
  dragCurrent: { x: number; y: number; client: { x: number; y: number } } | null;
  hoveredElementId: string | null;
  selectedCount: number;
  totalElements: number;
  zoom: number;
}

const Row: React.FC<{ ok: boolean; label: string }> = ({ ok, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, lineHeight: '16px' }}>
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 14,
        height: 14,
        borderRadius: 3,
        background: ok ? '#3DBE8B' : 'rgba(255,255,255,0.08)',
        color: ok ? '#fff' : 'rgba(255,255,255,0.5)',
        fontWeight: 700,
      }}
    >
      {ok ? '✓' : '·'}
    </span>
    <span>{label}</span>
  </div>
);

const ConnectorDebugHUD: React.FC<DebugHUDProps> = ({
  checklist,
  dragStart,
  dragCurrent,
  hoveredElementId,
  selectedCount,
  totalElements,
  zoom,
}) => {
  return (
    <div
      dir="ltr"
      style={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        zIndex: 9999,
        background: 'rgba(11,15,18,0.92)',
        color: '#fff',
        borderRadius: 12,
        padding: 12,
        width: 260,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        border: '1px solid rgba(255,255,255,0.08)',
        pointerEvents: 'auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <strong style={{ fontSize: 12, letterSpacing: 0.5 }}>CONNECTOR DEBUG</strong>
        <button
          type="button"
          onClick={() => setConnectorDebug(false)}
          style={{
            background: 'transparent',
            color: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 6,
            padding: '2px 6px',
            fontSize: 10,
            cursor: 'pointer',
          }}
        >
          OFF
        </button>
      </div>

      <div style={{ display: 'grid', gap: 4, marginBottom: 10 }}>
        <Row ok={checklist.anchorMounted} label="Anchor mounted on selection" />
        <Row ok={checklist.pointerDownCaptured} label="Pointerdown captured on anchor" />
        <Row ok={checklist.dragActive} label="Drag active (listeners armed)" />
        <Row ok={checklist.hoverTargetFound} label="Hover target detected" />
        <Row ok={checklist.dropCompleted} label="Drop created connector" />
      </div>

      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', lineHeight: '14px' }}>
        <div>zoom: {zoom.toFixed(2)} · selected: {selectedCount}/{totalElements}</div>
        <div>offset: +{ANCHOR_OFFSET.x},{ANCHOR_OFFSET.y} · hit r={ANCHOR_OFFSET.hitRadius}</div>
        <div>
          start: {dragStart ? `(${dragStart.x.toFixed(0)}, ${dragStart.y.toFixed(0)})` : '—'}
        </div>
        <div>
          curr:&nbsp; {dragCurrent ? `(${dragCurrent.x.toFixed(0)}, ${dragCurrent.y.toFixed(0)})` : '—'}
        </div>
        <div>hover: {hoveredElementId ?? '—'}</div>
      </div>
    </div>
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
    setConnectors((prev) => [...prev, newConnector]);
    return newConnector;
  }, []);

  const updateConnector = useCallback((id: string, updates: Partial<RootConnectorData>) => {
    setConnectors((prev) => prev.map((c) =>
      c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c,
    ));
  }, []);

  const removeConnector = useCallback((id: string) => {
    setConnectors((prev) => prev.filter((c) => c.id !== id));
    if (selectedConnectorId === id) setSelectedConnectorId(null);
  }, [selectedConnectorId]);

  const getConnectorsByElement = useCallback((elementId: string) =>
    connectors.filter((c) =>
      c.startPoint.elementId === elementId || c.endPoint.elementId === elementId,
    ), [connectors]);

  const selectedConnector = useMemo(() =>
    connectors.find((c) => c.id === selectedConnectorId),
    [connectors, selectedConnectorId]);

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
