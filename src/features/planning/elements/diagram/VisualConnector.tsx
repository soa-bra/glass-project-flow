/**
 * مكون الرابط للمخطط البصري — مظهر موحّد.
 */

import React, { useMemo, useState } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasElement } from '@/types/canvas';
import type { VisualConnectorData } from '@/types/visual-diagram-canvas';
import { getVisualAnchorPosition } from '@/types/visual-diagram-canvas';
import {
  buildConnectorPath,
  connectorGradientIds,
  getConnectorStrokeWidth,
  mirrorAnchor,
  CONNECTOR_COLOR_START,
  CONNECTOR_COLOR_END,
  type AnchorSide,
} from '@/features/planning/elements/connectors/connectorAppearance';

interface VisualConnectorProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: (multiSelect: boolean) => void;
}

const VisualConnector: React.FC<VisualConnectorProps> = ({
  element,
  isSelected,
  onSelect
}) => {
  const elements = useCanvasStore(state => state.elements);
  const connectorData = element.data as VisualConnectorData;
  const [isHovered, setIsHovered] = useState(false);

  const startNode = elements.find(el => el.id === connectorData.startNodeId);
  const endNode = elements.find(el => el.id === connectorData.endNodeId);

  const { path, viewBox, svgPosition, svgSize } = useMemo(() => {
    if (!startNode || !endNode) {
      return {
        path: 'M 0 0 L 100 100',
        viewBox: '0 0 100 100',
        svgPosition: { x: 0, y: 0 },
        svgSize: { width: 100, height: 100 },
      };
    }

    const rawStart = connectorData.startAnchor?.anchor || 'right';
    const rawEnd = connectorData.endAnchor?.anchor || 'left';
    const startAnchor: AnchorSide = rawStart === 'center' ? 'right' : (rawStart as AnchorSide);
    const endAnchor: AnchorSide = rawEnd === 'center' ? mirrorAnchor(startAnchor) : (rawEnd as AnchorSide);

    const start = getVisualAnchorPosition(startNode.position, startNode.size, startAnchor);
    const end = getVisualAnchorPosition(endNode.position, endNode.size, endAnchor);

    const padding = 60;
    const minX = Math.min(start.x, end.x) - padding;
    const minY = Math.min(start.y, end.y) - padding;
    const maxX = Math.max(start.x, end.x) + padding;
    const maxY = Math.max(start.y, end.y) + padding;
    const width = maxX - minX;
    const height = maxY - minY;

    const localStart = { x: start.x - minX, y: start.y - minY };
    const localEnd = { x: end.x - minX, y: end.y - minY };
    const pathD = buildConnectorPath(localStart, localEnd, startAnchor, endAnchor);

    return {
      path: pathD,
      viewBox: `0 0 ${width} ${height}`,
      svgPosition: { x: minX, y: minY },
      svgSize: { width, height },
    };
  }, [startNode, endNode, connectorData]);

  const parentNode = elements.find(el => el.id === connectorData.startNodeId);
  if (parentNode && (parentNode.data as any)?.isCollapsed) return null;
  if (!startNode || !endNode) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const multiSelect = e.shiftKey || e.ctrlKey || e.metaKey;
    onSelect(multiSelect);
  };

  const strokeWidth = getConnectorStrokeWidth({ isHovered, isSelected });
  const { gradientId, glowId } = connectorGradientIds(element.id);

  return (
    <svg
      className="absolute pointer-events-none"
      style={{
        left: svgPosition.x,
        top: svgPosition.y,
        width: svgSize.width,
        height: svgSize.height,
        overflow: 'visible',
        zIndex: 5,
      }}
      viewBox={viewBox}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={CONNECTOR_COLOR_START} />
          <stop offset="100%" stopColor={CONNECTOR_COLOR_END} />
        </linearGradient>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Hit region */}
      <path
        d={path}
        stroke="transparent"
        strokeWidth={20}
        fill="none"
        className="pointer-events-auto cursor-pointer"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />

      {/* Visible line */}
      <path
        d={path}
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-[stroke-width] duration-150"
        style={{ filter: isHovered ? `url(#${glowId})` : undefined }}
      />
    </svg>
  );
};

export default VisualConnector;
