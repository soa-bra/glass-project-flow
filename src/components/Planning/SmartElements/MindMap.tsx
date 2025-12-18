import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, GitBranch, Edit2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MindMapNode {
  id: string;
  text: string;
  color: string;
  children: string[];
  collapsed?: boolean;
}

interface MindMapData {
  nodes: Record<string, MindMapNode>;
  rootId: string;
}

interface MindMapProps {
  data: MindMapData;
  onUpdate: (data: Partial<MindMapData>) => void;
}

const NODE_COLORS = [
  'hsl(var(--accent-green))',
  'hsl(var(--accent-blue))',
  'hsl(var(--accent-yellow))',
  'hsl(var(--accent-red))',
  '#8B5CF6',
  '#EC4899',
  '#F97316',
  '#06B6D4',
];

const generateId = () => Math.random().toString(36).substr(2, 9);

export const MindMap: React.FC<MindMapProps> = ({ data, onUpdate }) => {
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Initialize with default data if empty
  const nodes = data.nodes || {
    root: {
      id: 'root',
      text: 'الفكرة الرئيسية',
      color: 'hsl(var(--accent-blue))',
      children: [],
    }
  };
  const rootId = data.rootId || 'root';

  const updateNodes = useCallback((newNodes: Record<string, MindMapNode>) => {
    onUpdate({ nodes: newNodes, rootId });
  }, [onUpdate, rootId]);

  const addChild = (parentId: string) => {
    const newId = generateId();
    const parent = nodes[parentId];
    const depth = getNodeDepth(parentId);
    
    const newNode: MindMapNode = {
      id: newId,
      text: 'فكرة جديدة',
      color: NODE_COLORS[(depth + 1) % NODE_COLORS.length],
      children: [],
    };

    updateNodes({
      ...nodes,
      [parentId]: { ...parent, children: [...parent.children, newId] },
      [newId]: newNode,
    });
    
    setEditingNode(newId);
    setEditText('فكرة جديدة');
  };

  const deleteNode = (nodeId: string) => {
    if (nodeId === rootId) return;

    const getAllDescendants = (id: string): string[] => {
      const node = nodes[id];
      if (!node) return [];
      return [id, ...node.children.flatMap(getAllDescendants)];
    };

    const toDelete = new Set(getAllDescendants(nodeId));
    const newNodes: Record<string, MindMapNode> = {};

    Object.entries(nodes).forEach(([id, node]) => {
      if (!toDelete.has(id)) {
        newNodes[id] = {
          ...node,
          children: node.children.filter(childId => !toDelete.has(childId))
        };
      }
    });

    updateNodes(newNodes);
    setSelectedNode(null);
  };

  const startEditing = (nodeId: string) => {
    setEditingNode(nodeId);
    setEditText(nodes[nodeId]?.text || '');
  };

  const saveEdit = () => {
    if (!editingNode || !editText.trim()) return;
    
    updateNodes({
      ...nodes,
      [editingNode]: { ...nodes[editingNode], text: editText.trim() }
    });
    setEditingNode(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingNode(null);
    setEditText('');
  };

  const toggleCollapse = (nodeId: string) => {
    updateNodes({
      ...nodes,
      [nodeId]: { ...nodes[nodeId], collapsed: !nodes[nodeId].collapsed }
    });
  };

  const updateNodeColor = (nodeId: string, color: string) => {
    updateNodes({
      ...nodes,
      [nodeId]: { ...nodes[nodeId], color }
    });
  };

  const getNodeDepth = (nodeId: string, depth = 0): number => {
    if (nodeId === rootId) return depth;
    for (const [id, node] of Object.entries(nodes)) {
      if (node.children.includes(nodeId)) {
        return getNodeDepth(id, depth + 1);
      }
    }
    return depth;
  };

  const renderNode = (nodeId: string, level: number = 0) => {
    const node = nodes[nodeId];
    if (!node) return null;

    const isRoot = nodeId === rootId;
    const isEditing = editingNode === nodeId;
    const isSelected = selectedNode === nodeId;
    const hasChildren = node.children.length > 0;

    return (
      <div key={nodeId} className="flex items-start gap-2">
        {/* Node */}
        <div
          className={cn(
            "relative flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all",
            isRoot && "text-lg font-bold",
            isSelected && "ring-2 ring-primary ring-offset-2",
            !isEditing && "hover:scale-105"
          )}
          style={{ 
            backgroundColor: node.color,
            color: '#fff',
            minWidth: isRoot ? '140px' : '100px'
          }}
          onClick={() => setSelectedNode(nodeId)}
          onDoubleClick={() => startEditing(nodeId)}
        >
          {/* Collapse toggle */}
          {hasChildren && (
            <button
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center text-xs hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation();
                toggleCollapse(nodeId);
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
            <span className="text-sm whitespace-nowrap">{node.text}</span>
          )}
        </div>

        {/* Children */}
        {hasChildren && !node.collapsed && (
          <div className="flex flex-col gap-2 border-r-2 border-border pr-3 mr-1">
            {node.children.map(childId => renderNode(childId, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-background rounded-lg border border-border overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-panel">
        <div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">الخريطة الذهنية</h3>
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

      {/* Color Picker for Selected Node */}
      {selectedNode && (
        <div className="flex items-center gap-2 p-2 border-b border-border">
          <span className="text-xs text-muted-foreground">اللون:</span>
          <div className="flex gap-1">
            {NODE_COLORS.map((color) => (
              <button
                key={color}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-all hover:scale-110",
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

      {/* Mind Map Canvas */}
      <div className="flex-1 overflow-auto p-6">
        <div className="min-w-max">
          {renderNode(rootId)}
        </div>
      </div>

      {/* Instructions */}
      <div className="p-2 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground text-center">
          انقر لتحديد • انقر مرتين للتعديل • استخدم الأزرار لإضافة فروع
        </p>
      </div>
    </div>
  );
};
