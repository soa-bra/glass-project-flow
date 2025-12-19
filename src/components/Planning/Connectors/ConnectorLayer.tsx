/**
 * ConnectorLayer - طبقة عرض الموصلات
 * Sprint 3: Connector Tool 2.0
 */

import React, { memo, useMemo, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useCanvasStore } from '@/stores/canvasStore';
import { anchorCalculator, type AnchorPoint, type ElementBounds } from '@/core/connectors/anchors';
import { pathRouter } from '@/core/connectors/routing';
import { ConnectorPath } from './ConnectorPath';
import { AnchorHandles } from './AnchorHandles';
import type { CanvasWorkflowEdgeElement } from '@/types/canvas-elements';

// =============================================================================
// Types
// =============================================================================

interface ConnectorLayerProps {
  showAnchors?: boolean;
  onConnectorSelect?: (connectorId: string) => void;
  onConnectorCreate?: (fromId: string, toId: string, fromAnchor: string, toAnchor: string) => void;
}

interface DragState {
  isDragging: boolean;
  fromElementId: string | null;
  fromAnchor: AnchorPoint | null;
  currentPoint: { x: number; y: number } | null;
}

// =============================================================================
// Connector Layer Component
// =============================================================================

export const ConnectorLayer: React.FC<ConnectorLayerProps> = memo(({
  showAnchors = false,
  onConnectorSelect,
  onConnectorCreate
}) => {
  const { elements, selectedElementIds, viewport, activeTool } = useCanvasStore();
  
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    fromElementId: null,
    fromAnchor: null,
    currentPoint: null
  });

  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [highlightedAnchor, setHighlightedAnchor] = useState<string | null>(null);

  // استخراج الموصلات من العناصر
  const connectors = useMemo(() => 
    elements.filter(el => 
      el.type === 'workflow_edge' || el.type === 'connector'
    ) as any[],
    [elements]
  );

  // استخراج العناصر القابلة للربط
  const connectableElements = useMemo(() => 
    elements.filter(el => 
      el.type !== 'workflow_edge' && 
      el.type !== 'connector' &&
      el.visible !== false
    ),
    [elements]
  );

  // حساب anchors لكل عنصر
  const elementAnchors = useMemo(() => {
    const map = new Map<string, AnchorPoint[]>();
    
    for (const element of connectableElements) {
      const bounds: ElementBounds = {
        x: element.position.x,
        y: element.position.y,
        width: element.size.width,
        height: element.size.height
      };
      map.set(element.id, anchorCalculator.calculateAnchors(element.id, bounds));
    }
    
    return map;
  }, [connectableElements]);

  // حساب مسارات الموصلات
  const connectorPaths = useMemo(() => {
    return connectors.map(connector => {
      const fromElement = elements.find(el => el.id === connector.fromNodeId);
      const toElement = elements.find(el => el.id === connector.toNodeId);

      if (!fromElement || !toElement) return null;

      const fromBounds: ElementBounds = {
        x: fromElement.position.x,
        y: fromElement.position.y,
        width: fromElement.size.width,
        height: fromElement.size.height
      };

      const toBounds: ElementBounds = {
        x: toElement.position.x,
        y: toElement.position.y,
        width: toElement.size.width,
        height: toElement.size.height
      };

      // حساب أفضل نقاط ارتكاز
      const { source, target } = anchorCalculator.calculateBestAnchors(
        fromBounds,
        toBounds,
        connector.fromNodeId,
        connector.toNodeId
      );

      // حساب المسار
      const path = pathRouter.calculatePath(source, target);

      return {
        connector,
        path,
        isSelected: selectedElementIds.includes(connector.id)
      };
    }).filter(Boolean);
  }, [connectors, elements, selectedElementIds]);

  // معالجة بدء السحب من anchor
  const handleAnchorDragStart = useCallback((elementId: string, anchor: AnchorPoint, event: React.MouseEvent) => {
    setDragState({
      isDragging: true,
      fromElementId: elementId,
      fromAnchor: anchor,
      currentPoint: { x: event.clientX, y: event.clientY }
    });
  }, []);

  // معالجة حركة الماوس أثناء السحب
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!dragState.isDragging) return;

    const svgRect = (event.currentTarget as SVGElement).getBoundingClientRect();
    const x = (event.clientX - svgRect.left - viewport.pan.x) / viewport.zoom;
    const y = (event.clientY - svgRect.top - viewport.pan.y) / viewport.zoom;

    setDragState(prev => ({
      ...prev,
      currentPoint: { x, y }
    }));

    // البحث عن أقرب anchor
    const elementsWithBounds = connectableElements
      .filter(el => el.id !== dragState.fromElementId)
      .map(el => ({
        id: el.id,
        bounds: {
          x: el.position.x,
          y: el.position.y,
          width: el.size.width,
          height: el.size.height
        }
      }));

    const nearest = anchorCalculator.findNearestAnchor(
      { x, y },
      elementsWithBounds,
      [dragState.fromElementId!]
    );

    if (nearest) {
      setHoveredElementId(nearest.elementId);
      setHighlightedAnchor(nearest.anchor.position);
    } else {
      setHoveredElementId(null);
      setHighlightedAnchor(null);
    }
  }, [dragState, viewport, connectableElements]);

  // معالجة إنهاء السحب
  const handleMouseUp = useCallback(() => {
    if (dragState.isDragging && dragState.fromElementId && hoveredElementId && highlightedAnchor) {
      onConnectorCreate?.(
        dragState.fromElementId,
        hoveredElementId,
        dragState.fromAnchor?.position || 'right',
        highlightedAnchor
      );
    }

    setDragState({
      isDragging: false,
      fromElementId: null,
      fromAnchor: null,
      currentPoint: null
    });
    setHoveredElementId(null);
    setHighlightedAnchor(null);
  }, [dragState, hoveredElementId, highlightedAnchor, onConnectorCreate]);

  // مسار السحب المؤقت
  const dragPath = useMemo(() => {
    if (!dragState.isDragging || !dragState.fromAnchor || !dragState.currentPoint) return null;

    const tempTarget: AnchorPoint = {
      id: 'temp',
      position: 'center',
      point: dragState.currentPoint,
      normal: { x: 0, y: 0 }
    };

    return pathRouter.calculatePath(dragState.fromAnchor, tempTarget);
  }, [dragState]);

  // أدوات الربط - تظهر نقاط الارتكاز عند استخدام أداة الأشكال أو التحديد
  const isConnectorTool = activeTool === 'shapes_tool' || activeTool === 'selection_tool';

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ overflow: 'visible' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <g transform={`translate(${viewport.pan.x}, ${viewport.pan.y}) scale(${viewport.zoom})`}>
        {/* الموصلات الموجودة */}
        {connectorPaths.map(item => item && (
          <ConnectorPath
            key={item.connector.id}
            path={item.path}
            color={item.connector.style?.color || 'hsl(var(--accent-blue))'}
            strokeWidth={item.connector.strokeWidth || 2}
            selected={item.isSelected}
            animated={item.connector.animated}
            label={item.connector.label}
            arrowEnd={true}
            onClick={() => onConnectorSelect?.(item.connector.id)}
          />
        ))}

        {/* مسار السحب المؤقت */}
        {dragPath && (
          <ConnectorPath
            path={dragPath}
            color="hsl(var(--accent-blue))"
            strokeWidth={2}
            dashed={true}
            animated={true}
            arrowEnd={true}
          />
        )}

        {/* نقاط الارتكاز */}
        {(showAnchors || isConnectorTool) && connectableElements.map(element => {
          const anchors = elementAnchors.get(element.id) || [];
          const isHovered = hoveredElementId === element.id;
          const isSelected = selectedElementIds.includes(element.id);
          const showElementAnchors = isHovered || isSelected || dragState.isDragging;

          return (
            <AnchorHandles
              key={element.id}
              anchors={anchors}
              visible={showElementAnchors}
              highlightedAnchor={isHovered ? highlightedAnchor as any : undefined}
              onDragStart={(anchor, event) => handleAnchorDragStart(element.id, anchor, event)}
            />
          );
        })}
      </g>
    </svg>
  );
});

ConnectorLayer.displayName = 'ConnectorLayer';
