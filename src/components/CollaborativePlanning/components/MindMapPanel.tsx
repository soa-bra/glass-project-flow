import React, { useState } from 'react';
import { Brain, Plus, Minus, X, GitBranch, Target } from 'lucide-react';

interface CanvasElement {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: string;
  color: string;
}

interface MindMapPanelProps {
  onClose: () => void;
  elements: CanvasElement[];
  onElementsUpdate: (elements: CanvasElement[]) => void;
}

interface MindMapNode {
  id: string;
  text: string;
  level: number;
  children: string[];
  parent?: string;
}

export const MindMapPanel: React.FC<MindMapPanelProps> = ({
  onClose,
  elements,
  onElementsUpdate
}) => {
  const [mindMapNodes, setMindMapNodes] = useState<MindMapNode[]>([
    { id: 'root', text: 'المشروع الرئيسي', level: 0, children: ['phase1', 'phase2'] },
    { id: 'phase1', text: 'المرحلة الأولى', level: 1, children: ['task1', 'task2'], parent: 'root' },
    { id: 'phase2', text: 'المرحلة الثانية', level: 1, children: ['task3'], parent: 'root' },
    { id: 'task1', text: 'مهمة 1', level: 2, children: [], parent: 'phase1' },
    { id: 'task2', text: 'مهمة 2', level: 2, children: [], parent: 'phase1' },
    { id: 'task3', text: 'مهمة 3', level: 2, children: [], parent: 'phase2' }
  ]);
  
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [newNodeText, setNewNodeText] = useState('');

  const generateMindMapCanvas = () => {
    const newElements: CanvasElement[] = [];
    const nodePositions: { [key: string]: { x: number; y: number } } = {};
    
    // Calculate positions for nodes
    mindMapNodes.forEach((node, index) => {
      const baseX = 200 + (node.level * 200);
      const baseY = 150 + (index * 100);
      nodePositions[node.id] = { x: baseX, y: baseY };
      
      // Create canvas element for each node
      const element: CanvasElement = {
        id: `mindmap-${node.id}`,
        type: 'mindmap-node',
        position: { x: baseX, y: baseY },
        size: { width: 150, height: 60 },
        content: node.text,
        color: node.level === 0 ? '#E0E7FF' : node.level === 1 ? '#F3E8FF' : '#FEF3C7'
      };
      newElements.push(element);
    });

    onElementsUpdate([...elements.filter(el => !el.id.startsWith('mindmap-')), ...newElements]);
  };

  const addNode = (parentId: string) => {
    if (!newNodeText.trim()) return;
    
    const parentNode = mindMapNodes.find(n => n.id === parentId);
    if (!parentNode) return;
    
    const newId = `node-${Date.now()}`;
    const newNode: MindMapNode = {
      id: newId,
      text: newNodeText,
      level: parentNode.level + 1,
      children: [],
      parent: parentId
    };
    
    setMindMapNodes(prev => [
      ...prev.map(n => n.id === parentId ? { ...n, children: [...n.children, newId] } : n),
      newNode
    ]);
    
    setNewNodeText('');
  };

  const deleteNode = (nodeId: string) => {
    if (nodeId === 'root') return; // Can't delete root
    
    const nodeToDelete = mindMapNodes.find(n => n.id === nodeId);
    if (!nodeToDelete) return;
    
    // Remove from parent's children
    setMindMapNodes(prev => prev
      .filter(n => n.id !== nodeId && !isDescendant(n.id, nodeId, prev))
      .map(n => ({
        ...n,
        children: n.children.filter(childId => childId !== nodeId)
      }))
    );
  };

  const isDescendant = (nodeId: string, ancestorId: string, nodes: MindMapNode[]): boolean => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !node.parent) return false;
    if (node.parent === ancestorId) return true;
    return isDescendant(node.parent, ancestorId, nodes);
  };

  const renderNode = (node: MindMapNode, depth = 0) => {
    const isSelected = selectedNodeId === node.id;
    const indentClass = `pl-${depth * 4}`;
    
    return (
      <div key={node.id} className="mb-2">
        <div 
          className={`flex items-center space-x-2 space-x-reverse p-2 rounded-lg cursor-pointer transition-colors ${
            isSelected ? 'bg-blue-50 border-2 border-blue-200' : 'hover:bg-gray-50 border border-gray-200'
          } ${indentClass}`}
          onClick={() => setSelectedNodeId(node.id)}
        >
          <GitBranch size={14} className="text-gray-500" />
          <span className="flex-1 text-sm">{node.text}</span>
          <div className="flex items-center space-x-1 space-x-reverse">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedNodeId(node.id);
              }}
              className="p-1 hover:bg-blue-100 rounded text-blue-600"
              title="إضافة عقدة فرعية"
            >
              <Plus size={12} />
            </button>
            {node.id !== 'root' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNode(node.id);
                }}
                className="p-1 hover:bg-red-100 rounded text-red-600"
                title="حذف العقدة"
              >
                <Minus size={12} />
              </button>
            )}
          </div>
        </div>
        
        {/* Render children */}
        {node.children.map(childId => {
          const childNode = mindMapNodes.find(n => n.id === childId);
          return childNode ? renderNode(childNode, depth + 1) : null;
        })}
      </div>
    );
  };

  return (
    <div className="absolute bottom-6 left-20 glass-section rounded-lg p-4 w-80 h-96 z-40 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 space-x-reverse">
          <Brain size={16} className="text-purple-600" />
          <span className="text-sm font-medium text-gray-700">الخريطة الذهنية</span>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-white/30 rounded"
        >
          <X size={14} className="text-gray-500" />
        </button>
      </div>

      {/* Mind Map Tree */}
      <div className="flex-1 overflow-y-auto mb-3">
        {mindMapNodes.filter(n => n.level === 0).map(rootNode => renderNode(rootNode))}
      </div>

      {/* Add Node Form */}
      {selectedNodeId && (
        <div className="mb-3 p-3 bg-blue-50 rounded-lg">
          <div className="text-xs text-blue-600 font-medium mb-2">
            إضافة عقدة فرعية لـ: {mindMapNodes.find(n => n.id === selectedNodeId)?.text}
          </div>
          <div className="flex space-x-2 space-x-reverse">
            <input
              type="text"
              value={newNodeText}
              onChange={(e) => setNewNodeText(e.target.value)}
              placeholder="نص العقدة الجديدة"
              className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && addNode(selectedNodeId)}
            />
            <button
              onClick={() => addNode(selectedNodeId)}
              disabled={!newNodeText.trim()}
              className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              إضافة
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-2 space-x-reverse pt-3 border-t border-gray-200">
        <button
          onClick={generateMindMapCanvas}
          className="flex-1 flex items-center justify-center space-x-1 space-x-reverse py-2 px-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-600 text-xs font-medium transition-colors"
        >
          <Target size={12} />
          <span>إنشاء في اللوحة</span>
        </button>
        
        <button
          onClick={() => {
            setMindMapNodes([
              { id: 'root', text: 'مشروع جديد', level: 0, children: [] }
            ]);
            setSelectedNodeId(null);
          }}
          className="flex-1 py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600 text-xs font-medium transition-colors"
        >
          إعادة تعيين
        </button>
      </div>

      <div className="mt-2 text-xs text-gray-500 text-center">
        اضغط على العقد لإضافة عقد فرعية
      </div>
    </div>
  );
};