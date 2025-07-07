import React from 'react';
import { useEnhancedCanvasState } from './hooks/useEnhancedCanvasState';
import { CanvasBoardContentsProps } from './types';
import { DefaultView } from './components';
import { useCanvasEventHandlers } from './components/CanvasEventHandlers';
import { MiroStyleBoard } from './components/MiroStyleBoard';

const CanvasBoardContents: React.FC<CanvasBoardContentsProps> = ({ 
  projectId = 'default', 
  userId = 'user1' 
}) => {
  // Initialize enhanced canvas state - تحسين حالة الكانفاس
  const canvasState = useEnhancedCanvasState(projectId, userId);
  
  const eventHandlers = useCanvasEventHandlers({
    selectedElementId: canvasState.selectedElementId,
    setSelectedSmartElement: canvasState.setSelectedSmartElement,
    setShowDefaultView: canvasState.setShowDefaultView,
    setSelectedTool: canvasState.setSelectedTool,
    deleteElement: canvasState.deleteElement
  });

  console.log('🎨 CanvasBoardContents state:', {
    selectedTool: canvasState.selectedTool,
    selectedSmartElement: canvasState.selectedSmartElement,
    elementsCount: canvasState.elements.length,
    showDefaultView: canvasState.showDefaultView
  });

  // Create wrapper functions to match CanvasWrapper interface
  const wrappedHandleElementMouseDown = (e: React.MouseEvent, elementId: string) => {
    canvasState.handleElementMouseDown(e, elementId);
  };

  const wrappedHandleElementMouseMove = (e: React.MouseEvent) => {
    canvasState.handleElementMouseMove(e);
  };

  const wrappedHandleResizeMouseDown = (e: React.MouseEvent, handle: string) => {
    canvasState.handleResizeMouseDown(e, handle);
  };

  const wrappedHandleResizeMouseMove = (e: React.MouseEvent) => {
    canvasState.handleResizeMouseMove(e);
  };

  if (canvasState.showDefaultView) {
    return <DefaultView onStartCanvas={eventHandlers.handleStartCanvas} />;
  }

  return (
    <MiroStyleBoard 
      projectId={projectId} 
      userId={userId} 
    />
  );
};

export default CanvasBoardContents;