import React from 'react';
import { CanvasElement } from '@/types/canvas';

interface CanvasDiagnosticsProps {
  selectedTool: string;
  elements: CanvasElement[];
  selectedElementIds: string[];
  zoom: number;
  canvasPosition: { x: number; y: number };
  showGrid: boolean;
  snapEnabled: boolean;
  isVisible?: boolean;
}

export const CanvasDiagnostics: React.FC<CanvasDiagnosticsProps> = ({
  selectedTool,
  elements,
  selectedElementIds,
  zoom,
  canvasPosition,
  showGrid,
  snapEnabled,
  isVisible = false
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-sm">
      <h3 className="font-bold mb-2">Canvas Diagnostics</h3>
      
      <div className="space-y-1">
        <div>Tool: <span className="text-green-400">{selectedTool}</span></div>
        <div>Elements: <span className="text-blue-400">{elements.length}</span></div>
        <div>Selected: <span className="text-yellow-400">{selectedElementIds.length}</span></div>
        <div>Zoom: <span className="text-purple-400">{Math.round(zoom * 100)}%</span></div>
        <div>Position: <span className="text-cyan-400">({Math.round(canvasPosition.x)}, {Math.round(canvasPosition.y)})</span></div>
        <div>Grid: <span className={showGrid ? "text-green-400" : "text-red-400"}>{showGrid ? "ON" : "OFF"}</span></div>
        <div>Snap: <span className={snapEnabled ? "text-green-400" : "text-red-400"}>{snapEnabled ? "ON" : "OFF"}</span></div>
      </div>

      {selectedElementIds.length > 0 && (
        <div className="mt-3 pt-2 border-t border-gray-600">
          <div className="font-bold mb-1">Selected Elements:</div>
          {selectedElementIds.slice(0, 3).map(id => {
            const element = elements.find(el => el.id === id);
            return (
              <div key={id} className="text-xs">
                {element?.type} ({Math.round(element?.position.x || 0)}, {Math.round(element?.position.y || 0)})
              </div>
            );
          })}
          {selectedElementIds.length > 3 && (
            <div className="text-gray-400">...and {selectedElementIds.length - 3} more</div>
          )}
        </div>
      )}
    </div>
  );
};