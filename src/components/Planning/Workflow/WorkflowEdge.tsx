/**
 * WorkflowEdge Component - خط ربط Workflow في الكانفس
 * Sprint 2: Workflow Design Layer
 */

import React, { memo, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { WorkflowEdgeData, WorkflowNodeData } from '@/types/workflow';
import { getDefaultEdgeStyle } from '@/types/workflow';

// ============= Props =============

interface WorkflowEdgeProps {
  edge: WorkflowEdgeData;
  fromNode: WorkflowNodeData;
  toNode: WorkflowNodeData;
  isSelected?: boolean;
  isHovered?: boolean;
  scale?: number;
  onSelect?: (edgeId: string) => void;
  onDoubleClick?: (edgeId: string) => void;
  onLabelClick?: (edgeId: string) => void;
}

// ============= Helper Functions =============

const getAnchorPosition = (
  node: WorkflowNodeData,
  anchor: 'top' | 'bottom' | 'left' | 'right' | undefined
): { x: number; y: number } => {
  const width = node.size?.width || 180;
  const height = node.size?.height || 80;
  const x = node.position.x;
  const y = node.position.y;

  switch (anchor) {
    case 'top':
      return { x: x + width / 2, y };
    case 'bottom':
      return { x: x + width / 2, y: y + height };
    case 'left':
      return { x, y: y + height / 2 };
    case 'right':
      return { x: x + width, y: y + height / 2 };
    default:
      // Auto-detect best anchor
      return { x: x + width / 2, y: y + height };
  }
};

const calculateAutoAnchors = (
  fromNode: WorkflowNodeData,
  toNode: WorkflowNodeData
): { from: 'top' | 'bottom' | 'left' | 'right'; to: 'top' | 'bottom' | 'left' | 'right' } => {
  const fromCenter = {
    x: fromNode.position.x + (fromNode.size?.width || 180) / 2,
    y: fromNode.position.y + (fromNode.size?.height || 80) / 2
  };
  const toCenter = {
    x: toNode.position.x + (toNode.size?.width || 180) / 2,
    y: toNode.position.y + (toNode.size?.height || 80) / 2
  };

  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;

  // إذا كان الفرق الأفقي أكبر
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) {
      return { from: 'right', to: 'left' };
    } else {
      return { from: 'left', to: 'right' };
    }
  } else {
    if (dy > 0) {
      return { from: 'bottom', to: 'top' };
    } else {
      return { from: 'top', to: 'bottom' };
    }
  }
};

const generatePath = (
  start: { x: number; y: number },
  end: { x: number; y: number },
  fromAnchor: 'top' | 'bottom' | 'left' | 'right',
  toAnchor: 'top' | 'bottom' | 'left' | 'right',
  pathType: 'straight' | 'orthogonal' | 'curved' = 'orthogonal'
): string => {
  if (pathType === 'straight') {
    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  }

  if (pathType === 'curved') {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const cx1 = start.x + dx * 0.5;
    const cy1 = start.y;
    const cx2 = start.x + dx * 0.5;
    const cy2 = end.y;
    return `M ${start.x} ${start.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${end.x} ${end.y}`;
  }

  // Orthogonal path
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;

  // حساب المسار بناءً على نقاط الارتكاز
  if (fromAnchor === 'bottom' && toAnchor === 'top') {
    const controlY = start.y + (end.y - start.y) / 2;
    return `M ${start.x} ${start.y} L ${start.x} ${controlY} L ${end.x} ${controlY} L ${end.x} ${end.y}`;
  }

  if (fromAnchor === 'right' && toAnchor === 'left') {
    const controlX = start.x + (end.x - start.x) / 2;
    return `M ${start.x} ${start.y} L ${controlX} ${start.y} L ${controlX} ${end.y} L ${end.x} ${end.y}`;
  }

  if (fromAnchor === 'left' && toAnchor === 'right') {
    const controlX = start.x - Math.abs(end.x - start.x) / 2;
    return `M ${start.x} ${start.y} L ${controlX} ${start.y} L ${controlX} ${end.y} L ${end.x} ${end.y}`;
  }

  if (fromAnchor === 'top' && toAnchor === 'bottom') {
    const controlY = start.y - Math.abs(end.y - start.y) / 2;
    return `M ${start.x} ${start.y} L ${start.x} ${controlY} L ${end.x} ${controlY} L ${end.x} ${end.y}`;
  }

  // Default fallback
  return `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`;
};

// ============= WorkflowEdge Component =============

export const WorkflowEdge = memo(function WorkflowEdge({
  edge,
  fromNode,
  toNode,
  isSelected = false,
  isHovered = false,
  scale = 1,
  onSelect,
  onDoubleClick,
  onLabelClick
}: WorkflowEdgeProps) {
  const style = edge.style || getDefaultEdgeStyle(edge.type);

  // حساب نقاط البداية والنهاية
  const { start, end, fromAnchor, toAnchor } = useMemo(() => {
    const autoAnchors = calculateAutoAnchors(fromNode, toNode);
    const from = edge.fromAnchor || autoAnchors.from;
    const to = edge.toAnchor || autoAnchors.to;
    
    return {
      start: getAnchorPosition(fromNode, from),
      end: getAnchorPosition(toNode, to),
      fromAnchor: from,
      toAnchor: to
    };
  }, [fromNode, toNode, edge.fromAnchor, edge.toAnchor]);

  // إنشاء المسار
  const pathData = useMemo(() => {
    const pathType = edge.path?.type || 'orthogonal';
    return generatePath(start, end, fromAnchor, toAnchor, pathType);
  }, [start, end, fromAnchor, toAnchor, edge.path?.type]);

  // حساب موقع التسمية
  const labelPosition = useMemo(() => {
    return {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2
    };
  }, [start, end]);

  // حساب حدود SVG
  const bounds = useMemo(() => {
    const padding = 50;
    const minX = Math.min(start.x, end.x) - padding;
    const minY = Math.min(start.y, end.y) - padding;
    const maxX = Math.max(start.x, end.x) + padding;
    const maxY = Math.max(start.y, end.y) + padding;
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }, [start, end]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(edge.id);
  }, [edge.id, onSelect]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDoubleClick?.(edge.id);
  }, [edge.id, onDoubleClick]);

  return (
    <svg
      className="absolute pointer-events-none overflow-visible"
      style={{
        left: bounds.x,
        top: bounds.y,
        width: bounds.width,
        height: bounds.height,
        zIndex: isSelected ? 5 : 1
      }}
    >
      <defs>
        {/* Arrow Marker */}
        <marker
          id={`arrow-${edge.id}`}
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,0 L10,5 L0,10 L3,5 Z"
            fill={style.strokeColor || '#374151'}
          />
        </marker>
        
        {/* Start Arrow Marker */}
        {style.arrowStart && (
          <marker
            id={`arrow-start-${edge.id}`}
            markerWidth="10"
            markerHeight="10"
            refX="1"
            refY="5"
            orient="auto-start-reverse"
            markerUnits="strokeWidth"
          >
            <path
              d="M10,0 L0,5 L10,10 L7,5 Z"
              fill={style.strokeColor || '#374151'}
            />
          </marker>
        )}
      </defs>

      {/* Hit Area (wider for easier selection) */}
      <path
        d={pathData}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="pointer-events-auto cursor-pointer"
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        transform={`translate(${-bounds.x}, ${-bounds.y})`}
      />

      {/* Main Path */}
      <motion.path
        d={pathData}
        fill="none"
        stroke={style.strokeColor || '#374151'}
        strokeWidth={style.strokeWidth || 2}
        strokeDasharray={style.strokeDash}
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd={style.arrowEnd !== false ? `url(#arrow-${edge.id})` : undefined}
        markerStart={style.arrowStart ? `url(#arrow-start-${edge.id})` : undefined}
        className={cn(
          'pointer-events-none transition-all',
          isSelected && 'stroke-primary',
          isHovered && 'stroke-primary/70'
        )}
        transform={`translate(${-bounds.x}, ${-bounds.y})`}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />

      {/* Animated Flow (optional) */}
      {style.animated && (
        <motion.circle
          r={4}
          fill={style.strokeColor || '#374151'}
          transform={`translate(${-bounds.x}, ${-bounds.y})`}
          initial={{ offsetDistance: '0%' }}
          animate={{ offsetDistance: '100%' }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: 'linear' 
          }}
          style={{
            offsetPath: `path("${pathData}")`
          } as React.CSSProperties}
        />
      )}

      {/* Selection Highlight */}
      {isSelected && (
        <path
          d={pathData}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={(style.strokeWidth || 2) + 4}
          strokeDasharray={style.strokeDash}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.3}
          className="pointer-events-none"
          transform={`translate(${-bounds.x}, ${-bounds.y})`}
        />
      )}

      {/* Edge Label */}
      {edge.label && (
        <g transform={`translate(${labelPosition.x - bounds.x}, ${labelPosition.y - bounds.y})`}>
          <rect
            x={-40}
            y={-12}
            width={80}
            height={24}
            rx={4}
            fill="hsl(var(--background))"
            stroke="hsl(var(--border))"
            strokeWidth={1}
            className="pointer-events-auto cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onLabelClick?.(edge.id);
            }}
          />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-foreground pointer-events-none select-none"
            style={{ fontFamily: 'IBM Plex Sans Arabic' }}
          >
            {edge.label}
          </text>
        </g>
      )}

      {/* Condition Badge */}
      {edge.conditions && edge.conditions.length > 0 && (
        <g transform={`translate(${labelPosition.x - bounds.x}, ${labelPosition.y - bounds.y + (edge.label ? 20 : 0)})`}>
          <rect
            x={-12}
            y={-8}
            width={24}
            height={16}
            rx={8}
            fill="#F59E0B"
          />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[10px] fill-white font-bold pointer-events-none select-none"
          >
            {edge.conditions.length}
          </text>
        </g>
      )}
    </svg>
  );
});

export default WorkflowEdge;
