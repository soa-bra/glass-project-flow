
import React, { memo } from 'react';
import { CanvasBoardContentsProps } from './types';
import { DefaultView } from './components';
import { useCanvasEventHandlers } from './components';
import { EnhancedCanvasBoard } from './components/EnhancedCanvasBoard';
import { useEnhancedCanvasState } from './hooks/useEnhancedCanvasState';

const CanvasBoardContents: React.FC<CanvasBoardContentsProps> = memo(({ 
  projectId = 'default', 
  userId = 'user1' 
}) => {
  // Initialize enhanced canvas state for default view check
  const canvasState = useEnhancedCanvasState(projectId, userId);
  
  const eventHandlers = useCanvasEventHandlers({
    selectedElementId: canvasState.selectedElementId,
    setSelectedSmartElement: canvasState.setSelectedSmartElement,
    setShowDefaultView: canvasState.setShowDefaultView,
    setSelectedTool: canvasState.setSelectedTool,
    deleteElement: canvasState.deleteElement
  });

  if (canvasState.showDefaultView) {
    return <DefaultView onStartCanvas={eventHandlers.handleStartCanvas} />;
  }

  return (
    <EnhancedCanvasBoard 
      projectId={projectId} 
      userId={userId} 
    />
  );
});

CanvasBoardContents.displayName = 'CanvasBoardContents';

export default CanvasBoardContents;
