import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Share2, Edit2, Check, X, LayoutGrid, Network, TreeDeciduous, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface VisualDiagramNode {
  id: string;
  label: string;
  parentId: string | null;
  childIds: string[];
  collapsed?: boolean;
  order: number;
  color?: string;
}

interface VisualDiagramData {
  nodes: Record<string, VisualDiagramNode>;
  rootId: string;
  layout?: 'tree-right' | 'tree-down' | 'radial' | 'organic';
}

interface VisualDiagramProps {
  data: VisualDiagramData;
  onUpdate: (data: Partial<VisualDiagramData>) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

type LayoutType = 'tree-right' | 'tree-down' | 'radial' | 'organic';

const NODE_COLORS = [
  '#3DA8F5', // blue
  '#3DBE8B', // green
  '#F6C445', // yellow
  '#E5564D', // red
  '#9B59B6', // purple
  '#1ABC9C', // teal
  '#EC4899', // pink
  '#F97316', // orange
];

const LAYOUT_OPTIONS: { id: LayoutType; label: string; icon: React.ReactNode }[] = [
  { id: 'tree-right', label: 'شجري أفقي', icon: <GitBranch className="h-4 w-4" /> },
  { id: 'tree-down', label: 'شجري عمودي', icon: <TreeDeciduous className="h-4 w-4" /> },
  { id: 'radial', label: 'شعاعي', icon: <Network className="h-4 w-4" /> },
  { id: 'organic', label: 'عضوي', icon: <LayoutGrid className="h-4 w-4" /> },
];

const generateId = () => `node-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export const VisualDiagram: React.FC<VisualDiagramProps> = ({ data: rawData, onUpdate }) => {
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Initialize with default data if empty
  const data = useMemo(() => {
    if (rawData?.nodes && Object.keys(rawData.nodes).length > 0) {
      return rawData;
    }
    return {
      nodes: {
        root: {
          id: 'root',
          label: 'العنصر الرئيسي',
          parentId: null,
          childIds: [],
          collapsed: false,
          order: 0,
          color: '#3DA8F5',
        }
      },
      rootId: 'root',
      layout: 'tree-right' as LayoutType,
    };
  }, [rawData]);

  const layout = (data.layout || 'tree-right') as LayoutType;
  const nodes = data.nodes || {};
  const rootId = data.rootId || 'root';

  const updateNodes = useCallback((newNodes: Record<string, VisualDiagramNode>) => {
    onUpdate({ nodes: newNodes, rootId });
  }, [onUpdate, rootId]);

  const setLayout = useCallback((newLayout: LayoutType) => {
    onUpdate({ layout: newLayout });
  }, [onUpdate]);

  const getNodeDepth = useCallback((nodeId: string, depth = 0): number => {
    if (nodeId === rootId) return depth;
    const node = nodes[nodeId];
    if (!node || !node.parentId) return depth;
    return getNodeDepth(node.parentId, depth + 1);
  }, [nodes, rootId]);

  const addChild = useCallback((parentId: string) => {
    const newId = generateId();
    const parent = nodes[parentId];
    if (!parent) return;

    const depth = getNodeDepth(parentId);
    
    const newNode: VisualDiagramNode = {
      id: newId,
      label: 'عنصر جديد',
      parentId: parentId,
      childIds: [],
      color: NODE_COLORS[(depth + 1) % NODE_COLORS.length],
      collapsed: false,
      order: parent.childIds.length,
    };

    updateNodes({
      ...nodes,
      [parentId]: { ...parent, childIds: [...parent.childIds, newId] },
      [newId]: newNode,
    });
    
    setEditingNode(newId);
    setEditText('عنصر جديد');
  }, [nodes, updateNodes, getNodeDepth]);

  const deleteNode = useCallback((nodeId: string) => {
    if (nodeId === rootId) return;

    const getAllDescendants = (id: string): string[] => {
      const node = nodes[id];
      if (!node) return [];
      return [id, ...node.childIds.flatMap(getAllDescendants)];
    };

    const toDelete = new Set(getAllDescendants(nodeId));
    const newNodes: Record<string, VisualDiagramNode> = {};

    Object.entries(nodes).forEach(([id, node]) => {
      if (!toDelete.has(id)) {
        newNodes[id] = {
          ...node,
          childIds: node.childIds.filter(childId => !toDelete.has(childId))
        };
      }
    });

    updateNodes(newNodes);
    setSelectedNode(null);
  }, [nodes, rootId, updateNodes]);

  const startEditing = useCallback((nodeId: string) => {
    setEditingNode(nodeId);
    setEditText(nodes[nodeId]?.label || '');
  }, [nodes]);

  const saveEdit = useCallback(() => {
    if (!editingNode || !editText.trim()) return;
    
    updateNodes({
      ...nodes,
      [editingNode]: { ...nodes[editingNode], label: editText.trim() }
    });
    setEditingNode(null);
    setEditText('');
  }, [editingNode, editText, nodes, updateNodes]);

  const cancelEdit = useCallback(() => {
    setEditingNode(null);
    setEditText('');
  }, []);

  const toggleCollapse = useCallback((nodeId: string) => {
    const node = nodes[nodeId];
    if (!node) return;
    
    updateNodes({
      ...nodes,
      [nodeId]: { ...node, collapsed: !node.collapsed }
    });
  }, [nodes, updateNodes]);

  const updateNodeColor = useCallback((nodeId: string, color: string) => {
    const node = nodes[nodeId];
    if (!node) return;
    
    updateNodes({
      ...nodes,
      [nodeId]: { ...node, color }
    });
  }, [nodes, updateNodes]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Render node component
  // ─────────────────────────────────────────────────────────────────────────────

  const renderNodeContent = (node: VisualDiagramNode, isRoot: boolean, level: number) => {
    const isEditing = editingNode === node.id;
    const isSelected = selectedNode === node.id;
    const hasChildren = node.childIds.length > 0;

    return (
      <div
        className={cn(
          "relative flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all",
          isRoot && "text-lg font-bold",
          isSelected && "ring-2 ring-primary ring-offset-2",
          !isEditing && "hover:scale-105"
        )}
        style={{ 
          backgroundColor: node.color || NODE_COLORS[level % NODE_COLORS.length],
          color: '#fff',
          minWidth: isRoot ? '140px' : '100px'
        }}
        onClick={() => setSelectedNode(node.id)}
        onDoubleClick={() => startEditing(node.id)}
      >
        {/* Collapse toggle */}
        {hasChildren && (
          <button
            className={cn(
              "absolute w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center text-xs hover:bg-muted z-10",
              layout === 'tree-down' ? "-bottom-3 left-1/2 -translate-x-1/2" : "-right-3 top-1/2 -translate-y-1/2"
            )}
            onClick={(e) => {
              e.stopPropagation();
              toggleCollapse(node.id);
            }}
          >
            {node.collapsed ? '+' : '−'}
          </button>
        )}

        {isEditing ? (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="h-6 text-xs bg-white/20 border-white/30 text-white placeholder:text-white/50"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-5 w-5 text-white hover:bg-white/20"
              onClick={saveEdit}
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-5 w-5 text-white hover:bg-white/20"
              onClick={cancelEdit}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <span className="text-sm whitespace-nowrap">{node.label}</span>
        )}
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Layout Renderers
  // ─────────────────────────────────────────────────────────────────────────────

  // Tree-Right Layout (horizontal tree)
  const renderTreeRight = (nodeId: string, level: number = 0): React.ReactNode => {
    const node = nodes[nodeId];
    if (!node) return null;

    const isRoot = nodeId === rootId;
    const hasChildren = node.childIds.length > 0;

    return (
      <div key={nodeId} className="flex items-start gap-3">
        {renderNodeContent(node, isRoot, level)}
        
        {hasChildren && !node.collapsed && (
          <div className="flex flex-col gap-2 border-r-2 border-border pr-3 mr-1">
            {node.childIds.map(childId => renderTreeRight(childId, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Tree-Down Layout (vertical tree)
  const renderTreeDown = (nodeId: string, level: number = 0): React.ReactNode => {
    const node = nodes[nodeId];
    if (!node) return null;

    const isRoot = nodeId === rootId;
    const hasChildren = node.childIds.length > 0;

    return (
      <div key={nodeId} className="flex flex-col items-center gap-4">
        {renderNodeContent(node, isRoot, level)}
        
        {hasChildren && !node.collapsed && (
          <div className="flex flex-row gap-4 border-t-2 border-border pt-4 mt-1">
            {node.childIds.map(childId => renderTreeDown(childId, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Radial Layout
  const renderRadial = (): React.ReactNode => {
    const rootNode = nodes[rootId];
    if (!rootNode) return null;

    const childCount = rootNode.childIds.length;
    const radius = 150;

    return (
      <div className="relative" style={{ minWidth: '400px', minHeight: '400px' }}>
        {/* Center node */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          {renderNodeContent(rootNode, true, 0)}
        </div>

        {/* Child nodes in circle */}
        {!rootNode.collapsed && rootNode.childIds.map((childId, index) => {
          const childNode = nodes[childId];
          if (!childNode) return null;

          const angle = (index * 360 / childCount) - 90;
          const radian = (angle * Math.PI) / 180;
          const x = Math.cos(radian) * radius;
          const y = Math.sin(radian) * radius;

          return (
            <div key={childId} className="absolute">
              {/* Connection line */}
              <svg 
                className="absolute pointer-events-none"
                style={{
                  left: '200px',
                  top: '200px',
                  width: '1px',
                  height: '1px',
                  overflow: 'visible',
                }}
              >
                <line
                  x1="0"
                  y1="0"
                  x2={x}
                  y2={y}
                  stroke={childNode.color || NODE_COLORS[1]}
                  strokeWidth="2"
                  strokeDasharray="4"
                />
              </svg>
              
              {/* Child node */}
              <div
                style={{
                  position: 'absolute',
                  left: `calc(50% + ${x}px - 50px)`,
                  top: `calc(50% + ${y}px - 15px)`,
                  transform: 'translate(100px, 185px)',
                }}
              >
                {renderNodeContent(childNode, false, 1)}
                
                {/* Grandchildren (simple list) */}
                {!childNode.collapsed && childNode.childIds.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1 pr-2">
                    {childNode.childIds.map(grandchildId => {
                      const grandchild = nodes[grandchildId];
                      if (!grandchild) return null;
                      return (
                        <div key={grandchildId} className="transform scale-90 origin-top-right">
                          {renderNodeContent(grandchild, false, 2)}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Organic Layout (free-form with connections)
  const renderOrganic = (): React.ReactNode => {
    const rootNode = nodes[rootId];
    if (!rootNode) return null;

    // Calculate positions for organic layout
    const getOrganicPositions = () => {
      const positions: Record<string, { x: number; y: number }> = {};
      const visited = new Set<string>();
      
      const traverse = (nodeId: string, x: number, y: number, angle: number, spread: number) => {
        if (visited.has(nodeId)) return;
        visited.add(nodeId);
        
        positions[nodeId] = { x, y };
        
        const node = nodes[nodeId];
        if (!node || node.collapsed) return;
        
        const childCount = node.childIds.length;
        node.childIds.forEach((childId, index) => {
          const childAngle = angle + (index - (childCount - 1) / 2) * spread;
          const distance = 120;
          const newX = x + Math.cos(childAngle) * distance;
          const newY = y + Math.sin(childAngle) * distance;
          traverse(childId, newX, newY, childAngle, spread * 0.7);
        });
      };
      
      traverse(rootId, 300, 200, 0, 0.8);
      return positions;
    };

    const positions = getOrganicPositions();

    // Draw connections
    const renderConnections = () => {
      const lines: React.ReactNode[] = [];
      
      Object.entries(nodes).forEach(([nodeId, node]) => {
        if (node.collapsed) return;
        
        node.childIds.forEach(childId => {
          const fromPos = positions[nodeId];
          const toPos = positions[childId];
          if (!fromPos || !toPos) return;
          
          const childNode = nodes[childId];
          
          lines.push(
            <line
              key={`${nodeId}-${childId}`}
              x1={fromPos.x + 50}
              y1={fromPos.y + 15}
              x2={toPos.x + 50}
              y2={toPos.y + 15}
              stroke={childNode?.color || '#ccc'}
              strokeWidth="2"
              strokeDasharray="4"
              opacity="0.6"
            />
          );
        });
      });
      
      return lines;
    };

    return (
      <div className="relative" style={{ minWidth: '600px', minHeight: '400px' }}>
        <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
          {renderConnections()}
        </svg>
        
        {Object.entries(positions).map(([nodeId, pos]) => {
          const node = nodes[nodeId];
          if (!node) return null;
          
          return (
            <div
              key={nodeId}
              style={{
                position: 'absolute',
                left: pos.x,
                top: pos.y,
              }}
            >
              {renderNodeContent(node, nodeId === rootId, getNodeDepth(nodeId))}
            </div>
          );
        })}
      </div>
    );
  };

  // Render based on layout
  const renderDiagram = () => {
    switch (layout) {
      case 'tree-down':
        return renderTreeDown(rootId);
      case 'radial':
        return renderRadial();
      case 'organic':
        return renderOrganic();
      case 'tree-right':
      default:
        return renderTreeRight(rootId);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Main Render
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="w-full h-full flex flex-col bg-background rounded-lg border border-border overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-panel">
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">مخطط بصري</h3>
        </div>
        
        {selectedNode && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => addChild(selectedNode)}
            >
              <Plus className="h-3 w-3 ml-1" />
              فرع جديد
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => startEditing(selectedNode)}
            >
              <Edit2 className="h-3 w-3 ml-1" />
              تعديل
            </Button>
            {selectedNode !== rootId && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs text-destructive hover:text-destructive"
                onClick={() => deleteNode(selectedNode)}
              >
                <Trash2 className="h-3 w-3 ml-1" />
                حذف
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Layout Selector + Color Picker */}
      <div className="flex items-center justify-between gap-4 p-2 border-b border-border bg-muted/30">
        {/* Layout Options */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">التخطيط:</span>
          <div className="flex gap-1">
            {LAYOUT_OPTIONS.map((option) => (
              <button
                key={option.id}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-all",
                  layout === option.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                )}
                onClick={() => setLayout(option.id)}
                title={option.label}
              >
                {option.icon}
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Color Picker for Selected Node */}
        {selectedNode && nodes[selectedNode] && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">اللون:</span>
            <div className="flex gap-1">
              {NODE_COLORS.map((color) => (
                <button
                  key={color}
                  className={cn(
                    "w-5 h-5 rounded-full border-2 transition-all hover:scale-110",
                    nodes[selectedNode]?.color === color 
                      ? "border-foreground" 
                      : "border-transparent"
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => updateNodeColor(selectedNode, color)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Diagram Canvas */}
      <div className="flex-1 overflow-auto p-4">
        <div className={cn(
          "min-h-full",
          layout === 'tree-right' && "flex items-start justify-start",
          layout === 'tree-down' && "flex items-start justify-center",
          (layout === 'radial' || layout === 'organic') && "flex items-center justify-center"
        )}>
          {renderDiagram()}
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="p-2 text-center text-xs text-muted-foreground border-t border-border bg-muted/20">
        انقر لتحديد • انقر مرتين للتعديل • استخدم الأزرار لإضافة فروع
      </div>
    </div>
  );
};
