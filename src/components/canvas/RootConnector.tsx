import React, { useEffect, useState, useCallback } from 'react';
import { ConnectionManager } from '../../lib/canvas/controllers/connection-manager';
import { SceneGraph } from '../../lib/canvas/utils/scene-graph';
import { AnchorPoints } from './AnchorPoints';
import { ConnectionRenderer } from './ConnectionRenderer';
import { LinkDialog } from './LinkDialog';
import { Connection, ConnectionEvent } from '../../lib/canvas/types/connection';

interface RootConnectorProps {
  sceneGraph: SceneGraph;
  selectedNodeIds: string[];
  boardId: string;
  zoom: number;
  onMouseMove?: (event: React.MouseEvent) => void;
  onMouseUp?: () => void;
}

export function RootConnector({
  sceneGraph,
  selectedNodeIds,
  boardId,
  zoom,
  onMouseMove,
  onMouseUp
}: RootConnectorProps) {
  const [connectionManager] = useState(() => new ConnectionManager(sceneGraph, boardId));
  const [anchors, setAnchors] = useState(connectionManager.getAllAnchorPoints());
  const [connections, setConnections] = useState(connectionManager.getConnections());
  const [pendingConnection, setPendingConnection] = useState(connectionManager.getPendingConnection());
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Update anchors when selection changes
  useEffect(() => {
    connectionManager.updateAnchorsForSelection(selectedNodeIds);
    setAnchors(connectionManager.getAllAnchorPoints());
  }, [selectedNodeIds, connectionManager]);

  // Load connections on mount
  useEffect(() => {
    connectionManager.loadConnections().then(() => {
      setConnections(connectionManager.getConnections());
    });
  }, [connectionManager]);

  // Listen to connection events
  useEffect(() => {
    const handleConnectionEvent = (event: ConnectionEvent) => {
      switch (event.type) {
        case 'connection-created':
        case 'connection-updated':
        case 'connection-deleted':
          setConnections(connectionManager.getConnections());
          break;
      }
    };

    connectionManager.addEventListener(handleConnectionEvent);
    return () => connectionManager.removeEventListener(handleConnectionEvent);
  }, [connectionManager]);

  // Handle mouse movement during connection
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (pendingConnection) {
      const svg = event.currentTarget as SVGElement;
      const rect = svg.getBoundingClientRect();
      const point = {
        x: (event.clientX - rect.left) / zoom,
        y: (event.clientY - rect.top) / zoom
      };
      
      connectionManager.updateTempPath(point);
      setPendingConnection(connectionManager.getPendingConnection());
    }
    
    onMouseMove?.(event);
  }, [pendingConnection, connectionManager, zoom, onMouseMove]);

  // Handle mouse up during connection
  const handleMouseUp = useCallback(() => {
    if (pendingConnection && !isConnecting) {
      connectionManager.cancelConnection();
      setPendingConnection(null);
    }
    setIsConnecting(false);
    onMouseUp?.();
  }, [pendingConnection, isConnecting, connectionManager, onMouseUp]);

  // Anchor event handlers
  const handleAnchorMouseDown = (anchorId: string) => {
    setIsConnecting(true);
    connectionManager.startConnection(anchorId);
    setPendingConnection(connectionManager.getPendingConnection());
  };

  const handleAnchorMouseUp = (anchorId: string) => {
    if (pendingConnection && isConnecting) {
      connectionManager.completeConnection(anchorId);
      setPendingConnection(connectionManager.getPendingConnection());
    }
    setIsConnecting(false);
  };

  const handleAnchorMouseEnter = (anchorId: string) => {
    // Visual feedback for hover
  };

  const handleAnchorMouseLeave = (anchorId: string) => {
    // Clear hover visual feedback
  };

  // Connection event handlers
  const handleConnectionClick = (connectionId: string) => {
    setSelectedConnectionId(connectionId);
    connectionManager.selectConnection(connectionId);
    
    const connection = connectionManager.getConnection(connectionId);
    if (connection) {
      setSelectedConnection(connection);
      setLinkDialogOpen(true);
    }
  };

  const handleConnectionUpdate = async (id: string, updates: Partial<Connection>) => {
    const connection = connectionManager.getConnection(id);
    if (!connection) return;

    // Update connection in memory
    const updatedConnection = { ...connection, ...updates };
    
    // Update in database (simplified - you may need more complex logic)
    const { error } = await supabase
      .from('links')
      .update({
        label: updatedConnection.title,
        // Add other fields as needed
      })
      .eq('id', id);

    if (!error) {
      setConnections(connectionManager.getConnections());
    }
  };

  const handleConnectionDelete = async (id: string) => {
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', id);

    if (!error) {
      // Remove from connection manager
      connectionManager.getConnections().filter(c => c.id !== id);
      setConnections(connectionManager.getConnections());
      setSelectedConnectionId(null);
    }
  };

  const handleAnalyzeConnections = async () => {
    return await connectionManager.analyzeConnections();
  };

  return (
    <>
      {/* SVG Layer for connections and anchors */}
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 10 }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <ConnectionRenderer
          connections={connections}
          pendingConnection={pendingConnection}
          selectedConnectionId={selectedConnectionId}
          onConnectionClick={handleConnectionClick}
          zoom={zoom}
        />
        
        <AnchorPoints
          anchors={anchors}
          onAnchorMouseDown={handleAnchorMouseDown}
          onAnchorMouseUp={handleAnchorMouseUp}
          onAnchorMouseEnter={handleAnchorMouseEnter}
          onAnchorMouseLeave={handleAnchorMouseLeave}
          zoom={zoom}
        />
      </svg>

      {/* Link Dialog */}
      <LinkDialog
        connection={selectedConnection}
        isOpen={linkDialogOpen}
        onClose={() => {
          setLinkDialogOpen(false);
          setSelectedConnection(null);
          setSelectedConnectionId(null);
        }}
        onUpdate={handleConnectionUpdate}
        onAnalyze={handleAnalyzeConnections}
        onDelete={handleConnectionDelete}
      />
    </>
  );
}

// Export the supabase client for the component
import { supabase } from '@/lib/supabase/client';