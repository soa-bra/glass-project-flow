// Whiteboard Root Canvas Component
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SceneGraph } from '@/lib/canvas/utils/scene-graph';
import { ConnectionManager } from '@/lib/canvas/controllers/connection-manager';
import { YSupabaseProvider } from '@/lib/yjs/y-supabase-provider';
import { RootConnector } from '@/components/canvas/RootConnector';
import { EnhancedSmartElementRenderer } from '@/components/smart-elements/enhanced-smart-element-renderer';

export interface WhiteboardRootProps {
  sceneGraph: SceneGraph;
  connectionManager: ConnectionManager;
  yProvider: YSupabaseProvider | null;
  selectedTool: string;
  selectedElements: string[];
  onSelectionChange: (ids: string[]) => void;
  zoom: number;
  canvasPosition: { x: number; y: number };
  onReady?: () => void;
  'data-test-id'?: string;
}

const WhiteboardRoot: React.FC<WhiteboardRootProps> = (props) => {
  const {
    sceneGraph,
    connectionManager,
    yProvider,
    selectedTool,
    selectedElements,
    onSelectionChange,
    zoom,
    canvasPosition,
    onReady,
    'data-test-id': testId
  } = props;

  const canvasRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [nodes, setNodes] = useState(sceneGraph.getAllNodes());

  // Call onReady once after first render
  useEffect(() => {
    if (!readyRef.current) {
      readyRef.current = true;
      onReady?.();
    }
  }, [onReady]);

  // Update nodes when sceneGraph changes
  useEffect(() => {
    const updateNodes = () => {
      setNodes([...sceneGraph.getAllNodes()]);
    };

    // Set up periodic updates since SceneGraph doesn't have event listeners
    const interval = setInterval(updateNodes, 1000);
    
    return () => clearInterval(interval);
  }, [sceneGraph]);

  // Handle mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'pan' || (e.button === 1)) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - canvasPosition.x, y: e.clientY - canvasPosition.y });
    } else if (selectedTool === 'select') {
      // Handle selection
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = (e.clientX - rect.left - canvasPosition.x) / zoom;
      const y = (e.clientY - rect.top - canvasPosition.y) / zoom;

      const clickedNode = nodes.find(node => {
        const bounds = sceneGraph.getNodeBounds(node);
        return x >= bounds.x && x <= bounds.x + bounds.width &&
               y >= bounds.y && y <= bounds.y + bounds.height;
      });

      if (clickedNode) {
        onSelectionChange([clickedNode.id]);
      } else {
        onSelectionChange([]);
      }
    }
  }, [selectedTool, canvasPosition, zoom, nodes, sceneGraph, onSelectionChange]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      // Canvas position is managed by parent CollaborativeCanvas
      // This would need to be passed up via callback if needed
      console.log('Canvas drag movement detected');
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    // Zoom is managed by parent CollaborativeCanvas
    // This would need to be passed up via callback if needed
    console.log('Wheel zoom detected:', e.deltaY > 0 ? 'zoom out' : 'zoom in');
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target !== document.body) return;

      switch (e.key.toLowerCase()) {
        case 'delete':
        case 'backspace':
          // Delete selected elements
          selectedElements.forEach(id => {
            sceneGraph.removeNode(id);
          });
          onSelectionChange([]);
          break;
        case 'escape':
          onSelectionChange([]);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElements, sceneGraph, onSelectionChange]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-background">
      {/* Canvas Container */}
      <div
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        data-test-id={testId}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        style={{
          cursor: selectedTool === 'pan' ? 'grab' : selectedTool === 'select' ? 'default' : 'crosshair'
        }}
      >
        {/* Grid Background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${canvasPosition.x}px ${canvasPosition.y}px`
          }}
        />

        {/* Canvas Content */}
        <div
          className="absolute"
          style={{
            transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
        >
          {/* Render Nodes */}
          {nodes.map(node => (
            <div
              key={node.id}
              className={`absolute cursor-pointer ${
                selectedElements.includes(node.id) ? 'ring-2 ring-primary' : ''
              }`}
              style={{
                left: node.transform.position.x,
                top: node.transform.position.y,
                width: node.size.width,
                height: node.size.height,
                transform: `rotate(${node.transform.rotation || 0}deg)`
              }}
              data-test-id={`node-${node.type}`}
            >
              {node.metadata?.smartElementType ? (
                <EnhancedSmartElementRenderer
                  node={node}
                  isSelected={selectedElements.includes(node.id)}
                  onUpdate={(nodeId, updates) => {
                    sceneGraph.updateNode(nodeId, updates);
                  }}
                />
              ) : (
                <div
                  className="w-full h-full border-2 border-muted-foreground bg-background/80 rounded"
                  style={{
                    backgroundColor: node.style?.fill || 'white',
                    borderColor: node.style?.stroke || '#ccc'
                  }}
                >
                  {(node.type === 'text' || node.type === 'sticky') && (node as any).content && (
                    <div className="p-2 text-sm">
                      {(node as any).content}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Root Connector */}
          <RootConnector
            sceneGraph={sceneGraph}
            boardId="integrated-planning-default"
            selectedNodeIds={selectedElements}
            zoom={zoom}
            onMouseMove={() => {}}
            onMouseUp={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default WhiteboardRoot;