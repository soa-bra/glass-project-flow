import React from 'react';
import { useCanvasStore } from '../../store/canvas.store';
import { useToolsStore } from '../../store/tools.store';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useToolInteraction } from '../../hooks/useToolInteraction';
import { Grid } from './Grid';
import { ElementsLayer } from './ElementsLayer';
import { SelectionLayer } from './SelectionLayer';
import { PresenceLayer } from './PresenceLayer';
import { SnapGuides } from './SnapGuides';
import { useState } from 'react';

export const CanvasSurface: React.FC = () => {
  const { viewport } = useCanvasStore();
  const { activeTool } = useToolsStore();
  const [snapGuides, setSnapGuides] = useState({ vertical: [], horizontal: [] });

  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  // Get tool interaction handlers
  const {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel
  } = useToolInteraction();

  return (
    <div className="canvas-container flex-1 relative overflow-hidden bg-canvas">
      <svg
        className="w-full h-full absolute inset-0"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        style={{ 
          cursor: activeTool === 'pan' ? 'grab' : activeTool === 'zoom' ? 'zoom-in' : 'crosshair'
        }}
      >
        <g
          transform={`translate(${viewport.x}, ${viewport.y}) scale(${viewport.zoom})`}
        >
          <Grid />
          <ElementsLayer />
          <SnapGuides vertical={snapGuides.vertical} horizontal={snapGuides.horizontal} />
          <SelectionLayer />
          <PresenceLayer />
        </g>
      </svg>
    </div>
  );
};