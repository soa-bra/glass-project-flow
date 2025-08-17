import React, { memo, useCallback } from 'react';
import { CANVAS_POSITIONING } from '../../shared/design-system/canvas-positioning';

// Performance optimized Canvas Element Component
const OptimizedCanvasElement = memo<{
  element: any;
  isSelected: boolean;
  onUpdate: (id: string, updates: any) => void;
}>(({ element, isSelected, onUpdate }) => {
  const handleUpdate = useCallback(
    (updates: any) => onUpdate(element.id, updates),
    [element.id, onUpdate]
  );

  return (
    <div
      className={`${CANVAS_POSITIONING.ELEMENT_ABSOLUTE} ${CANVAS_POSITIONING.CURSOR_MOVE} ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${isSelected ? CANVAS_POSITIONING.Z_INDEX_SELECTED : CANVAS_POSITIONING.Z_INDEX_BASE}`}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        ...element.style,
      }}
      onClick={() => onUpdate(element.id, {})}
    >
      {element.content}
    </div>
  );
});

OptimizedCanvasElement.displayName = 'OptimizedCanvasElement';

// Performance optimized Tool Panel Component
const OptimizedToolPanel = memo<{
  tools: any[];
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
}>(({ tools, selectedTool, onToolSelect }) => {
  const handleToolSelect = useCallback(
    (toolId: string) => () => onToolSelect(toolId),
    [onToolSelect]
  );

  return (
    <div className="flex gap-2">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={handleToolSelect(tool.id)}
          className={`p-2 rounded transition-colors ${
            selectedTool === tool.id 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {tool.label}
        </button>
      ))}
    </div>
  );
});

OptimizedToolPanel.displayName = 'OptimizedToolPanel';

// Performance optimized Selection Box Component
const OptimizedSelectionBox = memo<{
  selectedElements: any[];
  onBulkMove: (offset: { x: number; y: number }) => void;
  onBulkResize: (scaleFactor: number) => void;
}>(({ selectedElements, onBulkMove, onBulkResize }) => {
  const handleBulkMove = useCallback(
    (offset: { x: number; y: number }) => onBulkMove(offset),
    [onBulkMove]
  );

  const handleBulkResize = useCallback(
    (scaleFactor: number) => onBulkResize(scaleFactor),
    [onBulkResize]
  );

  if (selectedElements.length === 0) return null;

  // Calculate bounding box
  const bounds = selectedElements.reduce(
    (acc, element) => ({
      left: Math.min(acc.left, element.position.x),
      top: Math.min(acc.top, element.position.y),
      right: Math.max(acc.right, element.position.x + element.size.width),
      bottom: Math.max(acc.bottom, element.position.y + element.size.height),
    }),
    { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
  );

  return (
    <div
      className={`${CANVAS_POSITIONING.ELEMENT_ABSOLUTE} pointer-events-none border-2 border-blue-500 ${CANVAS_POSITIONING.Z_INDEX_HANDLES}`}
      style={{
        left: bounds.left - 4,
        top: bounds.top - 4,
        width: bounds.right - bounds.left + 8,
        height: bounds.bottom - bounds.top + 8,
      }}
    >
      {/* Selection handles */}
      <div className={`${CANVAS_POSITIONING.ELEMENT_ABSOLUTE} w-3 h-3 bg-white border-2 border-blue-500 ${CANVAS_POSITIONING.HANDLE_TOP_LEFT} pointer-events-auto cursor-nw-resize`} />
      <div className={`${CANVAS_POSITIONING.ELEMENT_ABSOLUTE} w-3 h-3 bg-white border-2 border-blue-500 ${CANVAS_POSITIONING.HANDLE_TOP_RIGHT} pointer-events-auto cursor-ne-resize`} />
      <div className={`${CANVAS_POSITIONING.ELEMENT_ABSOLUTE} w-3 h-3 bg-white border-2 border-blue-500 ${CANVAS_POSITIONING.HANDLE_BOTTOM_LEFT} pointer-events-auto cursor-sw-resize`} />
      <div className={`${CANVAS_POSITIONING.ELEMENT_ABSOLUTE} w-3 h-3 bg-white border-2 border-blue-500 ${CANVAS_POSITIONING.HANDLE_BOTTOM_RIGHT} pointer-events-auto cursor-se-resize`} />
    </div>
  );
});

OptimizedSelectionBox.displayName = 'OptimizedSelectionBox';

export { OptimizedCanvasElement, OptimizedToolPanel, OptimizedSelectionBox };