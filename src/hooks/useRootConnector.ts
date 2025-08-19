import { useState, useEffect, useCallback } from 'react';
import { ConnectionManager } from '../lib/canvas/controllers/connection-manager';
import { SceneGraph } from '../lib/canvas/utils/scene-graph';
import { Connection, ConnectionEvent, AnchorPoint } from '../lib/canvas/types/connection';

interface UseRootConnectorProps {
  sceneGraph: SceneGraph;
  boardId: string;
  selectedNodeIds: string[];
}

export function useRootConnector({
  sceneGraph,
  boardId,
  selectedNodeIds
}: UseRootConnectorProps) {
  const [connectionManager] = useState(() => new ConnectionManager(sceneGraph, boardId));
  const [connections, setConnections] = useState<Connection[]>([]);
  const [anchors, setAnchors] = useState<AnchorPoint[]>([]);
  const [pendingConnection, setPendingConnection] = useState(connectionManager.getPendingConnection());
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Update anchors when selection changes
  useEffect(() => {
    connectionManager.updateAnchorsForSelection(selectedNodeIds);
    setAnchors(connectionManager.getAllAnchorPoints());
  }, [selectedNodeIds, connectionManager]);

  // Load connections on mount and when board changes
  useEffect(() => {
    const loadConnections = async () => {
      await connectionManager.loadConnections();
      setConnections(connectionManager.getConnections());
    };
    loadConnections();
  }, [connectionManager, boardId]);

  // Listen to connection events
  useEffect(() => {
    const handleConnectionEvent = (event: ConnectionEvent) => {
      switch (event.type) {
        case 'connection-created':
        case 'connection-updated':
        case 'connection-deleted':
          setConnections(connectionManager.getConnections());
          break;
        case 'anchor-click':
          if (event.data?.action === 'start-connection') {
            setIsConnecting(true);
            setPendingConnection(connectionManager.getPendingConnection());
          }
          break;
      }
    };

    connectionManager.addEventListener(handleConnectionEvent);
    return () => connectionManager.removeEventListener(handleConnectionEvent);
  }, [connectionManager]);

  // Connection management functions
  const startConnection = useCallback((anchorId: string) => {
    setIsConnecting(true);
    connectionManager.startConnection(anchorId);
    setPendingConnection(connectionManager.getPendingConnection());
  }, [connectionManager]);

  const completeConnection = useCallback((anchorId: string) => {
    if (pendingConnection && isConnecting) {
      connectionManager.completeConnection(anchorId);
      setPendingConnection(connectionManager.getPendingConnection());
    }
    setIsConnecting(false);
  }, [connectionManager, pendingConnection, isConnecting]);

  const cancelConnection = useCallback(() => {
    connectionManager.cancelConnection();
    setPendingConnection(null);
    setIsConnecting(false);
  }, [connectionManager]);

  const updateTempPath = useCallback((point: { x: number; y: number }) => {
    if (pendingConnection) {
      connectionManager.updateTempPath(point);
      setPendingConnection(connectionManager.getPendingConnection());
    }
  }, [connectionManager, pendingConnection]);

  const selectConnection = useCallback((id: string) => {
    setSelectedConnectionId(id);
    connectionManager.selectConnection(id);
  }, [connectionManager]);

  const getConnection = useCallback((id: string) => {
    return connectionManager.getConnection(id);
  }, [connectionManager]);

  const analyzeConnections = useCallback(async () => {
    return await connectionManager.analyzeConnections();
  }, [connectionManager]);

  const deleteConnection = useCallback(async (id: string) => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id);

      if (!error) {
        // Refresh connections
        await connectionManager.loadConnections();
        setConnections(connectionManager.getConnections());
        if (selectedConnectionId === id) {
          setSelectedConnectionId(null);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete connection:', error);
      return false;
    }
  }, [connectionManager, selectedConnectionId]);

  const updateConnection = useCallback(async (id: string, updates: Partial<Connection>) => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase
        .from('links')
        .update({
          label: updates.title,
          // Add other fields as needed based on your schema
        })
        .eq('id', id);

      if (!error) {
        // Refresh connections
        await connectionManager.loadConnections();
        setConnections(connectionManager.getConnections());
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update connection:', error);
      return false;
    }
  }, [connectionManager]);

  return {
    // State
    connections,
    anchors,
    pendingConnection,
    selectedConnectionId,
    isConnecting,
    
    // Actions
    startConnection,
    completeConnection,
    cancelConnection,
    updateTempPath,
    selectConnection,
    getConnection,
    analyzeConnections,
    deleteConnection,
    updateConnection,
    
    // Manager instance for advanced usage
    connectionManager
  };
}