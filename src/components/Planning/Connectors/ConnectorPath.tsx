/**
 * ConnectorPath - مسار الموصل
 * Sprint 3: Connector Tool 2.0
 */

import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { RoutePath } from '@/core/connectors/routing';

// =============================================================================
// Types
// =============================================================================

export interface ConnectorPathProps {
  path: RoutePath;
  color?: string;
  strokeWidth?: number;
  animated?: boolean;
  selected?: boolean;
  dashed?: boolean;
  arrowStart?: boolean;
  arrowEnd?: boolean;
  label?: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

// =============================================================================
// Arrow Marker
// =============================================================================

const ArrowMarker: React.FC<{ id: string; color: string; size: number }> = ({ id, color, size }) => (
  <marker
    id={id}
    markerWidth={size}
    markerHeight={size}
    refX={size - 1}
    refY={size / 2}
    orient="auto"
    markerUnits="strokeWidth"
  >
    <path
      d={`M 0 0 L ${size} ${size / 2} L 0 ${size} Z`}
      fill={color}
    />
  </marker>
);

// =============================================================================
// Connector Path Component
// =============================================================================

export const ConnectorPath: React.FC<ConnectorPathProps> = memo(({
  path,
  color = 'hsl(var(--accent-blue))',
  strokeWidth = 2,
  animated = false,
  selected = false,
  dashed = false,
  arrowStart = false,
  arrowEnd = true,
  label,
  onClick,
  onDoubleClick
}) => {
  const markerId = useMemo(() => `arrow-${Math.random().toString(36).substr(2, 9)}`, []);
  const markerStartId = `${markerId}-start`;
  const markerEndId = `${markerId}-end`;

  // حساب موقع النص على المسار
  const labelPosition = useMemo(() => {
    if (!label || path.segments.length === 0) return null;

    const segment = path.segments[0];
    if (segment.type === 'cubic' && segment.points.length >= 4) {
      // نقطة الوسط على منحنى Bezier
      const t = 0.5;
      const [p0, p1, p2, p3] = segment.points;
      const mt = 1 - t;
      return {
        x: mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x,
        y: mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y
      };
    }

    // للخطوط المستقيمة
    const start = segment.points[0];
    const end = segment.points[segment.points.length - 1];
    return {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2
    };
  }, [path, label]);

  return (
    <g className="connector-path-group">
      {/* تعريف الأسهم */}
      <defs>
        {arrowEnd && <ArrowMarker id={markerEndId} color={color} size={8} />}
        {arrowStart && (
          <marker
            id={markerStartId}
            markerWidth={8}
            markerHeight={8}
            refX={1}
            refY={4}
            orient="auto-start-reverse"
            markerUnits="strokeWidth"
          >
            <path d="M 8 0 L 0 4 L 8 8 Z" fill={color} />
          </marker>
        )}
      </defs>

      {/* المسار الخلفي للتحديد (hitbox أكبر) */}
      <path
        d={path.svgPath}
        fill="none"
        stroke="transparent"
        strokeWidth={strokeWidth + 12}
        className="cursor-pointer"
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      />

      {/* المسار الرئيسي */}
      <motion.path
        d={path.svgPath}
        fill="none"
        stroke={color}
        strokeWidth={selected ? strokeWidth + 1 : strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? '8 4' : undefined}
        markerStart={arrowStart ? `url(#${markerStartId})` : undefined}
        markerEnd={arrowEnd ? `url(#${markerEndId})` : undefined}
        initial={animated ? { pathLength: 0 } : undefined}
        animate={animated ? { pathLength: 1 } : undefined}
        transition={animated ? { duration: 0.5, ease: 'easeInOut' } : undefined}
        className="pointer-events-none"
        style={{
          filter: selected ? `drop-shadow(0 0 4px ${color})` : undefined
        }}
      />

      {/* تأثير التحديد */}
      {selected && (
        <path
          d={path.svgPath}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth + 4}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.2}
          className="pointer-events-none"
        />
      )}

      {/* النص على المسار */}
      {label && labelPosition && (
        <g transform={`translate(${labelPosition.x}, ${labelPosition.y})`}>
          <rect
            x={-label.length * 4 - 8}
            y={-12}
            width={label.length * 8 + 16}
            height={24}
            rx={12}
            fill="white"
            stroke={color}
            strokeWidth={1}
          />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={12}
            fill={color}
            fontWeight={500}
            className="pointer-events-none select-none"
            style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
});

ConnectorPath.displayName = 'ConnectorPath';
