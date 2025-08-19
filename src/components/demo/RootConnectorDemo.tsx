import React, { useState, useRef, useEffect } from 'react';
import { SceneGraph } from '../../lib/canvas/utils/scene-graph';
import { CanvasNode } from '../../lib/canvas/types';
import { RootConnector } from '../canvas/RootConnector';
import { SelectionManager } from '../../lib/canvas/controllers/selection-manager';
import { Button } from '@/components/ui/button';

// Demo component showing RootConnector usage
export function RootConnectorDemo() {
  const [sceneGraph] = useState(() => new SceneGraph());
  const [selectionManager] = useState(() => new SelectionManager(sceneGraph));
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);

  // Create some demo nodes
  useEffect(() => {
    const node1: CanvasNode = {
      id: 'demo-node-1',
      type: 'rect',
      transform: {
        position: { x: 100, y: 100 },
        rotation: 0,
        scale: { x: 1, y: 1 }
      },
      size: { width: 120, height: 80 },
      style: {
        fill: 'hsl(var(--primary) / 0.1)',
        stroke: 'hsl(var(--primary))',
        strokeWidth: 2
      },
      metadata: { title: 'عقدة 1' }
    };

    const node2: CanvasNode = {
      id: 'demo-node-2',
      type: 'rect',
      transform: {
        position: { x: 300, y: 200 },
        rotation: 0,
        scale: { x: 1, y: 1 }
      },
      size: { width: 120, height: 80 },
      style: {
        fill: 'hsl(var(--secondary) / 0.1)',
        stroke: 'hsl(var(--secondary))',
        strokeWidth: 2
      },
      metadata: { title: 'عقدة 2' }
    };

    sceneGraph.addNode(node1);
    sceneGraph.addNode(node2);
  }, [sceneGraph]);

  // Handle node selection
  const handleNodeClick = (nodeId: string, multiSelect = false) => {
    selectionManager.selectNode(nodeId, multiSelect);
    setSelectedNodeIds(selectionManager.getSelection().selectedIds);
  };

  // Render nodes
  const renderNodes = () => {
    return sceneGraph.getAllNodes().map(node => {
      const bounds = sceneGraph.getNodeBounds(node);
      const isSelected = selectedNodeIds.includes(node.id);

      return (
        <g key={node.id}>
          <rect
            x={bounds.x}
            y={bounds.y}
            width={bounds.width}
            height={bounds.height}
            fill={node.style.fill}
            stroke={isSelected ? 'hsl(var(--primary))' : node.style.stroke}
            strokeWidth={isSelected ? 3 : node.style.strokeWidth}
            rx="8"
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              handleNodeClick(node.id, e.ctrlKey || e.metaKey);
            }}
          />
          <text
            x={bounds.x + bounds.width / 2}
            y={bounds.y + bounds.height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="hsl(var(--foreground))"
            fontSize="12"
            style={{ pointerEvents: 'none' }}
          >
            {node.metadata?.title || node.type}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="w-full h-[600px] border rounded-lg bg-background relative">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-20 space-x-2 flex" dir="ltr">
        <Button
          onClick={() => setZoom(Math.min(zoom * 1.2, 3))}
          size="sm"
          variant="outline"
        >
          تكبير +
        </Button>
        <Button
          onClick={() => setZoom(Math.max(zoom / 1.2, 0.3))}
          size="sm"
          variant="outline"
        >
          تصغير -
        </Button>
        <Button
          onClick={() => {
            selectionManager.clearSelection();
            setSelectedNodeIds([]);
          }}
          size="sm"
          variant="outline"
        >
          إلغاء التحديد
        </Button>
      </div>

      {/* Info Panel */}
      <div className="absolute top-4 right-4 z-20 bg-background/90 border rounded p-3 text-sm">
        <div className="font-medium mb-2">تعليمات الاستخدام:</div>
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li>• انقر على العقد لتحديدها</li>
          <li>• اسحب من نقاط الارتساء لإنشاء روابط</li>
          <li>• انقر على الروابط لتحريرها</li>
          <li>• استخدم Ctrl+Click للتحديد المتعدد</li>
        </ul>
      </div>

      {/* Main Canvas */}
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 800 600"
        onClick={() => {
          selectionManager.clearSelection();
          setSelectedNodeIds([]);
        }}
      >
        {/* Grid */}
        <defs>
          <pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#grid)"
        />

        {/* Nodes */}
        <g className="nodes">
          {renderNodes()}
        </g>

        {/* Root Connector - This handles all connection logic */}
        <foreignObject x="0" y="0" width="100%" height="100%">
          <RootConnector
            sceneGraph={sceneGraph}
            selectedNodeIds={selectedNodeIds}
            boardId="demo-board-123"
            zoom={zoom}
          />
        </foreignObject>
      </svg>
    </div>
  );
}