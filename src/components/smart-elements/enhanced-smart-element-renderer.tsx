import React from 'react';
import { CanvasNode } from '@/lib/canvas/types';

interface EnhancedSmartElementRendererProps {
  nodes: CanvasNode[];
  selectedIds: string[];
  onNodeSelect: (id: string, multiSelect?: boolean) => void;
  zoom: number;
  canvasPosition: { x: number; y: number };
}

export function EnhancedSmartElementRenderer({
  nodes,
  selectedIds,
  onNodeSelect,
  zoom,
  canvasPosition
}: EnhancedSmartElementRendererProps) {
  const worldToScreen = (point: { x: number; y: number }) => ({
    x: point.x * zoom + canvasPosition.x,
    y: point.y * zoom + canvasPosition.y
  });

  const renderNode = (node: CanvasNode) => {
    const screenPos = worldToScreen(node.transform.position);
    const isSelected = selectedIds.includes(node.id);
    
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: screenPos.x,
      top: screenPos.y,
      width: node.size.width * zoom,
      height: node.size.height * zoom,
      cursor: 'pointer',
      border: isSelected ? '2px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
      backgroundColor: node.style.fill || '#ffffff',
      pointerEvents: 'all'
    };

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onNodeSelect(node.id, e.ctrlKey);
    };

    return (
      <div key={node.id} style={baseStyle} onClick={handleClick} data-node-id={node.id}>
        {node.type === 'sticky' && (
          <div style={{ padding: '8px', fontSize: '12px' }}>
            {(node as any).content || 'ملاحظة'}
          </div>
        )}
        {node.type === 'text' && (
          <div style={{ padding: '4px', fontSize: '14px' }}>
            {(node as any).content || 'نص'}
          </div>
        )}
        {node.type === 'frame' && (
          <div style={{ padding: '8px', border: '2px dashed #ccc', height: '100%' }}>
            {(node as any).title || 'إطار'}
          </div>
        )}
      </div>
    );
  };

  return <div style={{ position: 'relative', width: '100%', height: '100%' }}>
    {nodes.map(renderNode)}
  </div>;
}