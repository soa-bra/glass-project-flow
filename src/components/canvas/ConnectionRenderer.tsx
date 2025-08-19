import React from 'react';
import { Connection, ConnectionState } from '../../lib/canvas/types/connection';

interface ConnectionRendererProps {
  connections: Connection[];
  pendingConnection: ConnectionState['pendingConnection'];
  selectedConnectionId: string | null;
  onConnectionClick: (connectionId: string) => void;
  zoom: number;
}

export function ConnectionRenderer({
  connections,
  pendingConnection,
  selectedConnectionId,
  onConnectionClick,
  zoom
}: ConnectionRendererProps) {
  
  const generatePathString = (points: Array<{ x: number; y: number }>): string => {
    if (points.length === 0) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
  };

  return (
    <>
      <defs>
        <marker
          id="arrow"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,0 L0,6 L9,3 z"
            fill="hsl(var(--primary))"
          />
        </marker>
        <marker
          id="arrow-selected"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,0 L0,6 L9,3 z"
            fill="hsl(var(--primary))"
            fillOpacity="1"
          />
        </marker>
      </defs>

      <g className="connections">
        {/* Render existing connections */}
        {connections.map(connection => {
          const isSelected = connection.id === selectedConnectionId;
          const pathString = generatePathString(connection.path.points);
          
          return (
            <g key={connection.id} className="connection-group">
              {/* Invisible wider path for easier clicking */}
              <path
                d={pathString}
                fill="none"
                stroke="transparent"
                strokeWidth={12}
                style={{ cursor: 'pointer' }}
                onClick={() => onConnectionClick(connection.id)}
              />
              
              {/* Visible connection path */}
              <path
                d={pathString}
                fill="none"
                stroke={isSelected ? 'hsl(var(--primary))' : connection.style.stroke}
                strokeWidth={isSelected ? connection.style.strokeWidth + 1 : connection.style.strokeWidth}
                strokeDasharray={connection.style.strokeDasharray}
                markerEnd={`url(#${isSelected ? 'arrow-selected' : 'arrow'})`}
                style={{
                  cursor: 'pointer',
                  opacity: isSelected ? 1 : 0.8
                }}
                onClick={() => onConnectionClick(connection.id)}
              />
              
              {/* Selection indicator */}
              {isSelected && (
                <path
                  d={pathString}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth={connection.style.strokeWidth + 4}
                  opacity={0.2}
                  pointerEvents="none"
                />
              )}

              {/* Connection nodes for editing (when selected) */}
              {isSelected && connection.path.nodes?.map((node, index) => (
                <circle
                  key={`${connection.id}-node-${index}`}
                  cx={node.x}
                  cy={node.y}
                  r={4 / zoom}
                  fill="hsl(var(--primary))"
                  stroke="hsl(var(--background))"
                  strokeWidth={1 / zoom}
                  style={{ cursor: 'move' }}
                />
              ))}
            </g>
          );
        })}

        {/* Render pending connection */}
        {pendingConnection && (
          <path
            d={generatePathString(pendingConnection.tempPath)}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            strokeDasharray="5,5"
            opacity={0.7}
            pointerEvents="none"
          />
        )}
      </g>
    </>
  );
}