import React from 'react';
import { AnchorPoint } from '../../lib/canvas/types/connection';

interface AnchorPointsProps {
  anchors: AnchorPoint[];
  onAnchorMouseDown: (anchorId: string) => void;
  onAnchorMouseUp: (anchorId: string) => void;
  onAnchorMouseEnter: (anchorId: string) => void;
  onAnchorMouseLeave: (anchorId: string) => void;
  zoom: number;
}

export function AnchorPoints({
  anchors,
  onAnchorMouseDown,
  onAnchorMouseUp,
  onAnchorMouseEnter,
  onAnchorMouseLeave,
  zoom
}: AnchorPointsProps) {
  const anchorSize = 8 / zoom; // Responsive to zoom
  const anchorRadius = anchorSize / 2;

  return (
    <g className="anchor-points">
      {anchors.map(anchor => (
        <circle
          key={anchor.id}
          cx={anchor.position.x}
          cy={anchor.position.y}
          r={anchorRadius}
          className={`anchor-point ${anchor.active ? 'active' : ''}`}
          style={{
            fill: anchor.active ? 'hsl(var(--primary))' : 'hsl(var(--background))',
            stroke: 'hsl(var(--primary))',
            strokeWidth: 1.5 / zoom,
            cursor: 'crosshair',
            opacity: 0.9
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            onAnchorMouseDown(anchor.id);
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            onAnchorMouseUp(anchor.id);
          }}
          onMouseEnter={() => onAnchorMouseEnter(anchor.id)}
          onMouseLeave={() => onAnchorMouseLeave(anchor.id)}
        />
      ))}
      
      <style>
        {`
          .anchor-point {
            transition: all 0.15s ease;
          }
          .anchor-point:hover {
            fill: hsl(var(--primary)) !important;
          }
          .anchor-point.active {
            animation: pulse 1s infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.9; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </g>
  );
}