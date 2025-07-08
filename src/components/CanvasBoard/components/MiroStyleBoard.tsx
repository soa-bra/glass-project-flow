import React, { useState } from 'react';
import { useEnhancedCanvasState } from '../hooks/useEnhancedCanvasState';
import { MiroStyleCanvas } from './MiroStyleCanvas';
import { MiroStyleMainToolbar } from './MiroStyleMainToolbar';
import { MiroStyleEnhancedTopBar } from './MiroStyleEnhancedTopBar';
import { ToolPropsBar } from './ToolPropsBar';
import { AIPanel } from './AIPanel';
import { EnhancedInspector } from './EnhancedInspector';
import { CollabBar } from '../collaboration/CollabBar';

interface MiroStyleBoardProps {
  projectId?: string;
  userId?: string;
}

export const MiroStyleBoard: React.FC<MiroStyleBoardProps> = ({
  projectId = 'default',
  userId = 'user1'
}) => {
  const canvasState = useEnhancedCanvasState(projectId, userId);
  
  // Panel states
  const [isCollabBarOpen, setIsCollabBarOpen] = useState(true);
  const [isAIPanelExpanded, setIsAIPanelExpanded] = useState(false);
  const [isInspectorExpanded, setIsInspectorExpanded] = useState(true);

  // Tool-specific states
  const [selectedPenMode, setSelectedPenMode] = useState('smart-draw');
  const [lineWidth, setLineWidth] = useState(2);
  const [lineStyle, setLineStyle] = useState('solid');

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

  const handleFileAction = (action: string) => {
    console.log('File action:', action);
    switch (action) {
      case 'new':
        // Clear canvas
        canvasState.setElements([]);
        break;
      case 'save':
        canvasState.saveCanvas();
        break;
      case 'copy':
        // Create copy logic
        break;
      case 'open':
        // Open file logic
        break;
    }
  };

  const handleSmartProjectGenerator = () => {
    console.log('Smart Project Generator clicked');
    // Implement smart project generation logic
  };

  const handleGridToggle = () => {
    canvasState.setShowGrid(!canvasState.showGrid);
  };

  const handleSnapToggle = () => {
    canvasState.setSnapEnabled(!canvasState.snapEnabled);
  };

  const selectedElement = canvasState.elements.find(el => el.id === canvasState.selectedElementId);

  return (
    <div className="relative w-full h-screen bg-gray-50 overflow-hidden">
      {/* Enhanced Top Bar - 40% width, centered */}
      <MiroStyleEnhancedTopBar
        canUndo={canvasState.historyIndex > 0}
        canRedo={canvasState.historyIndex < canvasState.history.length - 1}
        onUndo={canvasState.undo}
        onRedo={canvasState.redo}
        onSave={canvasState.saveCanvas}
        onFileAction={handleFileAction}
        onGridToggle={handleGridToggle}
        onSmartProjectGenerator={handleSmartProjectGenerator}
        showGrid={canvasState.showGrid}
        snapEnabled={canvasState.snapEnabled}
        onSnapToggle={handleSnapToggle}
      />

      {/* Main Canvas */}
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

      {/* Floating Panels */}
      
      {/* Left Top (0-25%) - CollabBar */}
      <CollabBar 
        projectId={projectId} 
        currentUserId={userId}
      />

      {/* Left Bottom (25-100%) - ToolPropsBar */}
      <ToolPropsBar
        selectedTool={canvasState.selectedTool}
        isCollabBarOpen={isCollabBarOpen}
        selectedElement={selectedElement}
        onElementUpdate={(updates) => {
          if (selectedElement) {
            canvasState.updateElement(selectedElement.id, updates);
          }
        }}
        onAction={(action) => {
          console.log('Tool action:', action);
          // Handle tool actions like cut, copy, paste, delete, etc.
        }}
        // Tool-specific props
        zoom={canvasState.zoom}
        canvasPosition={canvasState.canvasPosition}
        onZoomChange={canvasState.setZoom}
        onPositionChange={canvasState.setCanvasPosition}
        onFitToScreen={handleFitToScreen}
        onResetView={handleResetZoom}
        selectedPenMode={selectedPenMode}
        lineWidth={lineWidth}
        lineStyle={lineStyle}
        onPenModeSelect={setSelectedPenMode}
        onLineWidthChange={setLineWidth}
        onLineStyleChange={setLineStyle}
        onFileUpload={(files) => {
          console.log('Files uploaded:', files);
          // Handle file upload logic
        }}
        selectedSmartElement={canvasState.selectedSmartElement}
        onSmartElementSelect={canvasState.setSelectedSmartElement}
      />

      {/* Right Top (0-75%) - Inspector */}
      <EnhancedInspector
        selectedElement={selectedElement}
        onElementUpdate={(updates) => {
          if (selectedElement) {
            canvasState.updateElement(selectedElement.id, updates);
          }
        }}
        isExpanded={isInspectorExpanded}
        onToggle={() => setIsInspectorExpanded(!isInspectorExpanded)}
      />

      {/* Right Bottom (75-100%) - AI Panel */}
      <AIPanel
        isExpanded={isAIPanelExpanded}
        onToggle={() => setIsAIPanelExpanded(!isAIPanelExpanded)}
      />

      {/* Bottom Center (70% width) - Main Toolbar */}
      <MiroStyleMainToolbar
        selectedTool={canvasState.selectedTool}
        onToolSelect={handleToolSelect}
      />
    </div>
  );
};