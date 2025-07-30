import { useState, useEffect, useCallback, useRef } from 'react';
import { CanvasElement } from '@/types/canvas';

interface UseRealTimeCanvasProps {
  projectId: string;
  userId: string;
  elements: CanvasElement[];
  onElementsChange: (elements: CanvasElement[]) => void;
  enable?: boolean;
}

interface CanvasOperation {
  type: 'add' | 'update' | 'delete' | 'reorder' | 'bulk_update';
  elementId?: string;
  elementIds?: string[];
  element?: CanvasElement;
  elements?: CanvasElement[];
  data?: any;
  userId: string;
  timestamp: Date;
  operationId: string;
}

interface ConflictResolution {
  strategy: 'last_write_wins' | 'merge' | 'user_choice';
  conflictData?: any;
}

export const useRealTimeCanvas = ({
  projectId,
  userId,
  elements,
  onElementsChange,
  enable = true
}: UseRealTimeCanvasProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [conflicts, setConflicts] = useState<CanvasOperation[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const operationQueueRef = useRef<CanvasOperation[]>([]);
  const lastOperationIdRef = useRef<string>('');
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generate unique operation ID
  const generateOperationId = useCallback(() => {
    return `${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, [userId]);

  // Send operation to server
  const sendOperation = useCallback((operation: CanvasOperation) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      // Queue operation for when connection is restored
      operationQueueRef.current.push(operation);
      return;
    }

    try {
      wsRef.current.send(JSON.stringify({
        type: 'canvas_operation',
        projectId,
        operation
      }));
    } catch (error) {
      console.error('Failed to send canvas operation:', error);
      operationQueueRef.current.push(operation);
    }
  }, [projectId]);

  // Process queued operations
  const processOperationQueue = useCallback(() => {
    if (operationQueueRef.current.length === 0) return;

    const queue = [...operationQueueRef.current];
    operationQueueRef.current = [];

    queue.forEach(operation => {
      sendOperation(operation);
    });
  }, [sendOperation]);

  // Apply remote operation
  const applyRemoteOperation = useCallback((operation: CanvasOperation) => {
    if (operation.userId === userId) return; // Ignore own operations

    setIsSyncing(true);
    
    try {
      let newElements = [...elements];

      switch (operation.type) {
        case 'add':
          if (operation.element && !newElements.find(e => e.id === operation.element!.id)) {
            newElements.push(operation.element);
          }
          break;

        case 'update':
          if (operation.element) {
            const index = newElements.findIndex(e => e.id === operation.element!.id);
            if (index !== -1) {
              // Check for conflicts (simultaneous edits)
              const localElement = newElements[index];
              const remoteElement = operation.element;
              
              // Simple conflict detection based on timestamp
              if (localElement.data?.lastModified && 
                  remoteElement.data?.lastModified &&
                  Math.abs(new Date(localElement.data.lastModified).getTime() - 
                           new Date(remoteElement.data.lastModified).getTime()) < 1000) {
                // Potential conflict - add to conflicts list
                setConflicts(prev => [...prev, operation]);
                return;
              }
              
              newElements[index] = remoteElement;
            }
          }
          break;

        case 'delete':
          if (operation.elementId) {
            newElements = newElements.filter(e => e.id !== operation.elementId);
          }
          break;

        case 'reorder':
          if (operation.data?.fromIndex !== undefined && operation.data?.toIndex !== undefined) {
            const [moved] = newElements.splice(operation.data.fromIndex, 1);
            newElements.splice(operation.data.toIndex, 0, moved);
          }
          break;

        case 'bulk_update':
          if (operation.elements) {
            // Replace elements with new versions
            operation.elements.forEach(updatedElement => {
              const index = newElements.findIndex(e => e.id === updatedElement.id);
              if (index !== -1) {
                newElements[index] = updatedElement;
              } else {
                newElements.push(updatedElement);
              }
            });
          }
          break;
      }

      onElementsChange(newElements);
      setLastSyncTime(new Date());
      
    } catch (error) {
      console.error('Failed to apply remote operation:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [elements, onElementsChange, userId]);

  // Handle incoming WebSocket messages
  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'canvas_operation':
          if (data.operation.operationId !== lastOperationIdRef.current) {
            applyRemoteOperation(data.operation);
          }
          break;

        case 'sync_request':
          // Server is requesting a full sync
          sendFullSync();
          break;

        case 'conflict_resolution':
          // Handle conflict resolution from server
          handleConflictResolution(data.resolution);
          break;

        case 'canvas_state':
          // Full canvas state from server
          if (data.elements) {
            onElementsChange(data.elements);
            setLastSyncTime(new Date());
          }
          break;
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }, [applyRemoteOperation]);

  // Send full canvas state to server
  const sendFullSync = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    try {
      wsRef.current.send(JSON.stringify({
        type: 'full_sync',
        projectId,
        elements,
        timestamp: new Date(),
        userId
      }));
    } catch (error) {
      console.error('Failed to send full sync:', error);
    }
  }, [projectId, elements, userId]);

  // Handle conflict resolution
  const handleConflictResolution = useCallback((resolution: ConflictResolution) => {
    // Implementation depends on resolution strategy
    switch (resolution.strategy) {
      case 'last_write_wins':
        // Accept the latest change
        setConflicts([]);
        break;
        
      case 'merge':
        // Attempt to merge changes
        // This would require more sophisticated logic
        break;
        
      case 'user_choice':
        // Keep conflicts for user to resolve
        break;
    }
  }, []);

  // Public API for local operations
  const addElement = useCallback((element: CanvasElement) => {
    const operation: CanvasOperation = {
      type: 'add',
      element,
      userId,
      timestamp: new Date(),
      operationId: generateOperationId()
    };
    
    lastOperationIdRef.current = operation.operationId;
    sendOperation(operation);
    
    // Apply locally immediately for responsiveness
    onElementsChange([...elements, element]);
  }, [elements, onElementsChange, userId, generateOperationId, sendOperation]);

  const updateElement = useCallback((elementId: string, updates: Partial<CanvasElement>) => {
    const elementIndex = elements.findIndex(e => e.id === elementId);
    if (elementIndex === -1) return;

    const updatedElement = {
      ...elements[elementIndex],
      ...updates,
      data: {
        ...elements[elementIndex].data,
        lastModified: new Date().toISOString()
      }
    };

    const operation: CanvasOperation = {
      type: 'update',
      elementId,
      element: updatedElement,
      userId,
      timestamp: new Date(),
      operationId: generateOperationId()
    };
    
    lastOperationIdRef.current = operation.operationId;
    sendOperation(operation);
    
    // Apply locally immediately
    const newElements = [...elements];
    newElements[elementIndex] = updatedElement;
    onElementsChange(newElements);
  }, [elements, onElementsChange, userId, generateOperationId, sendOperation]);

  const deleteElement = useCallback((elementId: string) => {
    const operation: CanvasOperation = {
      type: 'delete',
      elementId,
      userId,
      timestamp: new Date(),
      operationId: generateOperationId()
    };
    
    lastOperationIdRef.current = operation.operationId;
    sendOperation(operation);
    
    // Apply locally immediately
    onElementsChange(elements.filter(e => e.id !== elementId));
  }, [elements, onElementsChange, userId, generateOperationId, sendOperation]);

  const reorderElements = useCallback((fromIndex: number, toIndex: number) => {
    const operation: CanvasOperation = {
      type: 'reorder',
      data: { fromIndex, toIndex },
      userId,
      timestamp: new Date(),
      operationId: generateOperationId()
    };
    
    lastOperationIdRef.current = operation.operationId;
    sendOperation(operation);
    
    // Apply locally immediately
    const newElements = [...elements];
    const [moved] = newElements.splice(fromIndex, 1);
    newElements.splice(toIndex, 0, moved);
    onElementsChange(newElements);
  }, [elements, onElementsChange, userId, generateOperationId, sendOperation]);

  // WebSocket connection management
  useEffect(() => {
    if (!enable) return;

    const connectWebSocket = () => {
      try {
        // For now, use a mock WebSocket implementation
        console.log(`Connecting to real-time canvas for project: ${projectId}`);
        
        // Mock connection for development
        setIsConnected(true);
        processOperationQueue();
        
        // Request initial sync
        setTimeout(() => {
          sendFullSync();
        }, 1000);

      } catch (error) {
        console.error('Failed to connect to real-time canvas:', error);
        setIsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      setIsConnected(false);
    };
  }, [enable, projectId, processOperationQueue, sendFullSync]);

  // Periodic sync check
  useEffect(() => {
    if (!enable || !isConnected) return;

    const interval = setInterval(() => {
      if (lastSyncTime && Date.now() - lastSyncTime.getTime() > 30000) {
        // No updates for 30 seconds, request sync
        sendFullSync();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [enable, isConnected, lastSyncTime, sendFullSync]);

  return {
    // Connection state
    isConnected,
    isSyncing,
    lastSyncTime,
    
    // Operations
    addElement,
    updateElement,
    deleteElement,
    reorderElements,
    
    // Conflict management
    conflicts,
    resolveConflict: handleConflictResolution,
    
    // Manual sync
    forceSync: sendFullSync,
    
    // Queue status
    pendingOperations: operationQueueRef.current.length
  };
};
