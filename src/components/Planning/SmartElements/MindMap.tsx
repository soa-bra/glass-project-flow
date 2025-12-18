import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, GitBranch, Edit2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MindMapData, MindMapNode } from '@/types/smart-elements';
import { migrateMindMapLegacyData } from '@/types/smart-elements';

interface MindMapProps {
  data: MindMapData;
  onUpdate: (data: Partial<MindMapData>) => void;
}

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

const generateId = () => `node-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

export const MindMap: React.FC<MindMapProps> = ({ data: rawData, onUpdate }) => {
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Migrate legacy data if needed
  const data = useMemo(() => {
    const { data: migratedData, migrated } = migrateMindMapLegacyData(rawData);
    if (migrated) {
      // Schedule update with migrated data
      setTimeout(() => onUpdate(migratedData as Partial<MindMapData>), 0);
    }
    return migratedData as MindMapData;
  }, [rawData, onUpdate]);

  // Initialize with default data if empty
  const nodes: Record<string, MindMapNode> = useMemo(() => {
    if (data.nodes && Object.keys(data.nodes).length > 0) {
      return data.nodes;
    }
    return {
      root: {
        id: 'root',
        label: 'الفكرة الرئيسية',
        parentId: null,
        childIds: [],
        collapsed: false,
        order: 0,
        color: '#3DA8F5',
      }
    };
  }, [data.nodes]);

  const rootId = data.rootId || 'root';

  const updateNodes = useCallback((newNodes: Record<string, MindMapNode>) => {
    onUpdate({ nodes: newNodes, rootId });
  }, [onUpdate, rootId]);

  const addChild = useCallback((parentId: string) => {
    const newId = generateId();
    const parent = nodes[parentId];
    if (!parent) return;

    const depth = getNodeDepth(parentId);
    
    const newNode: MindMapNode = {
      id: newId,
      label: 'فكرة جديدة',
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
    setEditText('فكرة جديدة');
  }, [nodes, updateNodes]);

  const deleteNode = useCallback((nodeId: string) => {
    if (nodeId === rootId) return;

    const getAllDescendants = (id: string): string[] => {
      const node = nodes[id];
      if (!node) return [];
      return [id, ...node.childIds.flatMap(getAllDescendants)];
    };

    const toDelete = new Set(getAllDescendants(nodeId));
    const newNodes: Record<string, MindMapNode> = {};
    const nodeToDelete = nodes[nodeId];

    Object.entries(nodes).forEach(([id, node]) => {
      if (!toDelete.has(id)) {
        // Update parent's childIds if this is the parent of deleted node
        if (nodeToDelete && node.childIds.includes(nodeId)) {
          newNodes[id] = {
            ...node,
            childIds: node.childIds.filter(childId => !toDelete.has(childId))
          };
        } else {
          newNodes[id] = {
            ...node,
            childIds: node.childIds.filter(childId => !toDelete.has(childId))
          };
        }
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

  const getNodeDepth = useCallback((nodeId: string, depth = 0): number => {
    if (nodeId === rootId) return depth;
    const node = nodes[nodeId];
    if (!node || !node.parentId) return depth;
    return getNodeDepth(node.parentId, depth + 1);
  }, [nodes, rootId]);

  const renderNode = useCallback((nodeId: string, level: number = 0): React.ReactNode => {
    const node = nodes[nodeId];
    if (!node) return null;

    const isRoot = nodeId === rootId;
    const isEditing = editingNode === nodeId;
    const isSelected = selectedNode === nodeId;
    const hasChildren = node.childIds.length > 0;

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
            backgroundColor: node.color || NODE_COLORS[level % NODE_COLORS.length],
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
            <span className="text-sm whitespace-nowrap">{node.label}</span>
          )}
        </div>

        {/* Children */}
        {hasChildren && !node.collapsed && (
          <div className="flex flex-col gap-2 border-r-2 border-border pr-3 mr-1">
            {node.childIds.map(childId => renderNode(childId, level + 1))}
          </div>
        )}
      </div>
    );
  }, [nodes, rootId, editingNode, editText, selectedNode, startEditing, toggleCollapse, saveEdit, cancelEdit]);

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
      {selectedNode && nodes[selectedNode] && (
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
