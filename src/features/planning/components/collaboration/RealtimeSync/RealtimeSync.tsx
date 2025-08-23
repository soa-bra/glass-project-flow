import React, { useEffect, useRef } from 'react';
import { useCollaborationStore } from '../../../store/collaboration.store';
import { useCanvasStore } from '../../../store/canvas.store';
import { useToolsStore } from '../../../store/tools.store';

export const RealtimeSync: React.FC = () => {
  const { 
    pendingChanges, 
    currentUserId, 
    updateUserPresence, 
    sendBoardUpdate,
    updateLiveCursor 
  } = useCollaborationStore();
  
  const { 
    elements, 
    selectedElementIds, 
    updateElement, 
    addElement
  } = useCanvasStore();
  
  const { activeTool } = useToolsStore();
  
  const lastSyncRef = useRef<number>(0);
  const mousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Sync tool changes
  useEffect(() => {
    updateUserPresence({
      currentTool: activeTool,
      selectedElements: selectedElementIds
    });
  }, [activeTool, selectedElementIds, updateUserPresence]);

  // Apply pending changes from other users
  useEffect(() => {
    pendingChanges.forEach((change) => {
      if (change.userId === currentUserId) return; // Skip own changes
      if (change.timestamp <= lastSyncRef.current) return; // Skip old changes

      try {
        // Apply the change to canvas
        if (change.updates.type === 'update') {
          updateElement(change.elementId, change.updates.data);
        } else if (change.updates.type === 'create') {
          addElement(change.updates.element);
        }
        
        lastSyncRef.current = Math.max(lastSyncRef.current, change.timestamp);
      } catch (error) {
        console.error('Failed to apply remote change:', error);
      }
    });
  }, [pendingChanges, currentUserId, updateElement, addElement]);

  // Track mouse movement for live cursors
  useEffect(() => {
    let throttleTimeout: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };

      // Throttle cursor updates to avoid spam
      clearTimeout(throttleTimeout);
      throttleTimeout = setTimeout(() => {
        updateLiveCursor({
          position: {
            x: e.clientX,
            y: e.clientY
          },
          tool: activeTool,
          isSelecting: e.buttons === 1, // Left mouse button pressed
          action: getActionFromTool(activeTool)
        });
      }, 50); // Update every 50ms
    };

    const handleMouseLeave = () => {
      updateLiveCursor({
        position: null,
        tool: activeTool,
        isSelecting: false
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(throttleTimeout);
    };
  }, [activeTool, updateLiveCursor]);

  // Broadcast element changes
  useEffect(() => {
    // This would be triggered when local elements change
    // For now, we'll implement a simple change detection
    const elementChangeHandler = (elementId: string, updates: any) => {
      sendBoardUpdate(elementId, {
        type: 'update',
        data: updates,
        timestamp: Date.now()
      });
    };

    // Note: In a real implementation, you would hook into the canvas store's
    // element update events to automatically broadcast changes
  }, [sendBoardUpdate]);

  const getActionFromTool = (tool: string) => {
    switch (tool) {
      case 'select': return 'تحديد';
      case 'pan': return 'تحريك';
      case 'zoom': return 'تكبير';
      case 'smart_pen': return 'رسم';
      case 'smart_element': return 'إضافة عنصر';
      default: return null;
    }
  };

  // This component doesn't render anything visible
  // It just handles the real-time synchronization logic
  return null;
};

// Hook to broadcast element changes
export const useBroadcastChanges = () => {
  const { sendBoardUpdate } = useCollaborationStore();

  const broadcastElementUpdate = (elementId: string, updates: any) => {
    sendBoardUpdate(elementId, {
      type: 'update',
      data: updates,
      timestamp: Date.now()
    });
  };

  const broadcastElementCreate = (element: any) => {
    sendBoardUpdate(element.id, {
      type: 'create',
      element: element,
      timestamp: Date.now()
    });
  };

  const broadcastElementDelete = (elementId: string) => {
    sendBoardUpdate(elementId, {
      type: 'delete',
      timestamp: Date.now()
    });
  };

  return {
    broadcastElementUpdate,
    broadcastElementCreate,
    broadcastElementDelete
  };
};