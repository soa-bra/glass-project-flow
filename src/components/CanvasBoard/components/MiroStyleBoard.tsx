import React from 'react';
import { useEnhancedCanvasState } from '../hooks/useEnhancedCanvasState';
import { MiroStyleTopBar } from './MiroStyleTopBar';
import { MiroStyleToolbar } from './MiroStyleToolbar';
import { MiroStyleCanvas } from './MiroStyleCanvas';
import { MiroStyleBottomBar } from './MiroStyleBottomBar';

interface MiroStyleBoardProps {
  projectId?: string;
  userId?: string;
}

export const MiroStyleBoard: React.FC<MiroStyleBoardProps> = ({
  projectId = 'default',
  userId = 'user1'
}) => {
  const canvasState = useEnhancedCanvasState(projectId, userId);

  // Map old tool names to new ones
  const handleToolSelect = (tool: string) => {
    let mappedTool = tool;
    
    // Map Miro-style tools to our internal tools
    switch (tool) {
      case 'rectangle':
      case 'circle':
      case 'triangle':
      case 'diamond':
      case 'line':
      case 'arrow':
        mappedTool = 'shape';
        canvasState.setSelectedSmartElement(tool);
        break;
      case 'pen':
        mappedTool = 'smart-pen';
        break;
      default:
        mappedTool = tool;
    }
    
    canvasState.setSelectedTool(mappedTool);
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(canvasState.zoom + 25, 400);
    canvasState.setZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(canvasState.zoom - 25, 25);
    canvasState.setZoom(newZoom);
  };

  const handleResetZoom = () => {
    canvasState.setZoom(100);
    canvasState.setCanvasPosition({ x: 0, y: 0 });
  };

  const handleFitToScreen = () => {
    if (canvasState.elements.length === 0) return;
    
    // Calculate bounds of all elements
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    canvasState.elements.forEach(element => {
      minX = Math.min(minX, element.position.x);
      minY = Math.min(minY, element.position.y);
      maxX = Math.max(maxX, element.position.x + element.size.width);
      maxY = Math.max(maxY, element.position.y + element.size.height);
    });
    
    const bounds = {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
    
    // Calculate zoom to fit
    const padding = 50;
    const containerWidth = window.innerWidth - padding * 2;
    const containerHeight = window.innerHeight - padding * 2;
    
    const zoomX = (containerWidth / bounds.width) * 100;
    const zoomY = (containerHeight / bounds.height) * 100;
    const newZoom = Math.min(zoomX, zoomY, 200);
    
    canvasState.setZoom(newZoom);
    canvasState.setCanvasPosition({
      x: -bounds.x + (containerWidth - bounds.width * (newZoom / 100)) / 2,
      y: -bounds.y + (containerHeight - bounds.height * (newZoom / 100)) / 2
    });
  };

  return (
    <div className="relative w-full h-screen bg-gray-50 overflow-hidden">
      {/* Top Bar */}
      <MiroStyleTopBar
        projectName="لوحة التخطيط التشاركي"
        canUndo={canvasState.historyIndex > 0}
        canRedo={canvasState.historyIndex < canvasState.history.length - 1}
        zoom={canvasState.zoom}
        onUndo={canvasState.undo}
        onRedo={canvasState.redo}
        onSave={canvasState.saveCanvas}
        onShare={() => console.log('مشاركة')}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
      />

      {/* Left Toolbar */}
      <MiroStyleToolbar
        selectedTool={canvasState.selectedTool}
        onToolSelect={handleToolSelect}
      />

      {/* Main Canvas */}
      <div className="pt-16 h-full">
        <MiroStyleCanvas
          elements={canvasState.elements}
          selectedElementId={canvasState.selectedElementId}
          selectedTool={canvasState.selectedTool}
          zoom={canvasState.zoom}
          canvasPosition={canvasState.canvasPosition}
          showGrid={canvasState.showGrid}
          canvasRef={canvasState.canvasRef}
          onElementSelect={canvasState.setSelectedElementId}
          onElementMouseDown={canvasState.handleElementMouseDown}
          onCanvasClick={canvasState.handleCanvasClick}
          onCanvasMouseDown={canvasState.handleCanvasMouseDown}
          onCanvasMouseMove={canvasState.handleCanvasMouseMove}
          onCanvasMouseUp={canvasState.handleCanvasMouseUp}
        />
      </div>

      {/* Bottom Bar */}
      <MiroStyleBottomBar
        zoom={canvasState.zoom}
        elementsCount={canvasState.elements.length}
        selectedElementsCount={canvasState.selectedElements.length}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitToScreen={handleFitToScreen}
        onResetZoom={handleResetZoom}
      />
    </div>
  );
};