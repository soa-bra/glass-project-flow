import React, { useState, useCallback, useMemo } from 'react';
import { nanoid } from 'nanoid';
import { 
  RootConnector, 
  RootConnectorData, 
  ConnectorPoint, 
  AISuggestion,
  ConnectionAnchors,
  RootConnectorCreator 
} from './RootConnector';

interface ElementBounds {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'component' | 'frame' | 'smart-element';
}

interface SmartConnectorManagerProps {
  elements: ElementBounds[];
  connectors: RootConnectorData[];
  onConnectorsChange: (connectors: RootConnectorData[]) => void;
  onInsertComponent?: (suggestion: AISuggestion, position: { x: number; y: number }) => void;
  selectedConnectorId?: string;
  onSelectConnector?: (id: string | null) => void;
  showAnchors?: boolean;
}

export const SmartConnectorManager: React.FC<SmartConnectorManagerProps> = ({
  elements,
  connectors,
  onConnectorsChange,
  onInsertComponent,
  selectedConnectorId,
  onSelectConnector,
  showAnchors = true,
}) => {
  const [isCreatingConnector, setIsCreatingConnector] = useState(false);
  const [dragStartPoint, setDragStartPoint] = useState<ConnectorPoint | null>(null);

  // Handle creating new connector
  const handleCreateConnector = useCallback((
    startPoint: ConnectorPoint,
    endPoint: ConnectorPoint,
    connectionType: RootConnectorData['connectionType']
  ) => {
    const newConnector: RootConnectorData = {
      id: nanoid(),
      startPoint,
      endPoint,
      connectionType,
      color: 'hsl(var(--primary))',
      strokeWidth: 2,
      style: 'solid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onConnectorsChange([...connectors, newConnector]);
    onSelectConnector?.(newConnector.id);
  }, [connectors, onConnectorsChange, onSelectConnector]);

  // Handle updating connector
  const handleUpdateConnector = useCallback((id: string, data: RootConnectorData) => {
    onConnectorsChange(
      connectors.map(c => c.id === id ? data : c)
    );
  }, [connectors, onConnectorsChange]);

  // Handle deleting connector
  const handleDeleteConnector = useCallback((id: string) => {
    onConnectorsChange(connectors.filter(c => c.id !== id));
    if (selectedConnectorId === id) {
      onSelectConnector?.(null);
    }
  }, [connectors, onConnectorsChange, selectedConnectorId, onSelectConnector]);

  // AI suggestion handler
  const handleAISuggest = useCallback(async (connector: RootConnectorData): Promise<AISuggestion[]> => {
    // Simulate AI analysis based on connected elements
    const startElement = elements.find(e => e.id === connector.startPoint.elementId);
    const endElement = elements.find(e => e.id === connector.endPoint.elementId);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const suggestions: AISuggestion[] = [
      {
        id: nanoid(),
        type: 'component',
        title: 'إضافة معالج وسيط',
        description: 'مكون لمعالجة البيانات بين العنصرين المتصلين',
        confidence: 0.92,
        data: {
          componentType: 'processor',
          position: {
            x: (connector.startPoint.x + connector.endPoint.x) / 2,
            y: (connector.startPoint.y + connector.endPoint.y) / 2,
          },
        },
      },
      {
        id: nanoid(),
        type: 'connector',
        title: 'رابط تدفق البيانات',
        description: 'تحويل إلى رابط تدفق بيانات مع مؤشرات اتجاه',
        confidence: 0.85,
        data: {
          style: 'animated',
          showDataFlow: true,
        },
      },
      {
        id: nanoid(),
        type: 'action',
        title: 'إضافة نقطة تحقق',
        description: 'إدراج نقطة تحقق من صحة البيانات',
        confidence: 0.78,
        data: {
          actionType: 'validation',
        },
      },
    ];

    return suggestions;
  }, [elements]);

  // Handle inserting suggestion
  const handleInsertSuggestion = useCallback((
    connector: RootConnectorData,
    suggestion: AISuggestion
  ) => {
    if (suggestion.type === 'component' && onInsertComponent) {
      onInsertComponent(suggestion, suggestion.data?.position || {
        x: (connector.startPoint.x + connector.endPoint.x) / 2,
        y: (connector.startPoint.y + connector.endPoint.y) / 2,
      });
    } else if (suggestion.type === 'connector') {
      // Update connector style
      handleUpdateConnector(connector.id, {
        ...connector,
        style: suggestion.data?.style || connector.style,
      });
    }
  }, [onInsertComponent, handleUpdateConnector]);

  // Handle anchor drag start
  const handleAnchorDragStart = useCallback((point: ConnectorPoint) => {
    setDragStartPoint(point);
    setIsCreatingConnector(true);
  }, []);

  // Handle anchor drag end
  const handleAnchorDragEnd = useCallback((point: ConnectorPoint) => {
    if (dragStartPoint && dragStartPoint.elementId !== point.elementId) {
      handleCreateConnector(dragStartPoint, point, 'component-component');
    }
    setDragStartPoint(null);
    setIsCreatingConnector(false);
  }, [dragStartPoint, handleCreateConnector]);

  return (
    <g className="smart-connector-manager">
      {/* Connection Anchors for each element */}
      {showAnchors && elements.map(element => (
        <ConnectionAnchors
          key={element.id}
          elementId={element.id}
          bounds={element}
          onStartDrag={handleAnchorDragStart}
          onEndDrag={handleAnchorDragEnd}
          isConnecting={isCreatingConnector}
        />
      ))}

      {/* Render all connectors */}
      {connectors.map(connector => (
        <RootConnector
          key={connector.id}
          data={connector}
          isSelected={selectedConnectorId === connector.id}
          onUpdate={(data) => handleUpdateConnector(connector.id, data)}
          onDelete={() => handleDeleteConnector(connector.id)}
          onAISuggest={() => handleAISuggest(connector)}
          onInsertSuggestion={(suggestion) => handleInsertSuggestion(connector, suggestion)}
        />
      ))}

      {/* Preview line while dragging from anchor */}
      {isCreatingConnector && dragStartPoint && (
        <line
          x1={dragStartPoint.x}
          y1={dragStartPoint.y}
          x2={dragStartPoint.x}
          y2={dragStartPoint.y}
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          strokeDasharray="5,5"
          opacity={0.7}
          className="pointer-events-none"
        />
      )}
    </g>
  );
};

// Hook for managing connectors
export const useSmartConnectors = (initialConnectors: RootConnectorData[] = []) => {
  const [connectors, setConnectors] = useState<RootConnectorData[]>(initialConnectors);
  const [selectedConnectorId, setSelectedConnectorId] = useState<string | null>(null);

  const addConnector = useCallback((connector: Omit<RootConnectorData, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newConnector: RootConnectorData = {
      ...connector,
      id: nanoid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setConnectors(prev => [...prev, newConnector]);
    return newConnector;
  }, []);

  const updateConnector = useCallback((id: string, updates: Partial<RootConnectorData>) => {
    setConnectors(prev => prev.map(c => 
      c.id === id 
        ? { ...c, ...updates, updatedAt: new Date().toISOString() }
        : c
    ));
  }, []);

  const removeConnector = useCallback((id: string) => {
    setConnectors(prev => prev.filter(c => c.id !== id));
    if (selectedConnectorId === id) {
      setSelectedConnectorId(null);
    }
  }, [selectedConnectorId]);

  const getConnectorsByElement = useCallback((elementId: string) => {
    return connectors.filter(c => 
      c.startPoint.elementId === elementId || 
      c.endPoint.elementId === elementId
    );
  }, [connectors]);

  const selectedConnector = useMemo(() => 
    connectors.find(c => c.id === selectedConnectorId),
    [connectors, selectedConnectorId]
  );

  return {
    connectors,
    setConnectors,
    selectedConnectorId,
    setSelectedConnectorId,
    selectedConnector,
    addConnector,
    updateConnector,
    removeConnector,
    getConnectorsByElement,
  };
};

export default SmartConnectorManager;
