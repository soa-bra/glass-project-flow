import React from 'react';
import { smartElementsRegistry, RenderContext } from '@/apps/brain/plugins/smart-elements/smart-elements-registry';
import { CanvasNode } from '../../lib/canvas/types';

interface SmartElementCanvasRendererProps {
  node: CanvasNode;
  isSelected?: boolean;
  isHovered?: boolean;
  zoom?: number;
  isEditing?: boolean;
  onDoubleClick?: (event: React.MouseEvent) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  className?: string;
}

export function SmartElementCanvasRenderer({
  node,
  isSelected = false,
  isHovered = false,
  zoom = 1,
  isEditing = false,
  onDoubleClick,
  onContextMenu,
  className = ''
}: SmartElementCanvasRendererProps) {
  const smartElementType = node.metadata?.smartElementType;
  
  if (!smartElementType) {
    // Not a smart element, render as normal canvas element
    return (
      <div 
        className={`canvas-element ${className}`}
        style={{
          width: node.size.width,
          height: node.size.height,
          ...node.style
        }}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
      >
        <div className="text-xs text-muted-foreground p-2">
          عنصر عادي: {node.type}
        </div>
      </div>
    );
  }

  const definition = smartElementsRegistry.getSmartElement(smartElementType);
  
  if (!definition) {
    // Smart element not found in registry
    return (
      <div 
        className={`canvas-element error ${className}`}
        style={{
          width: node.size.width,
          height: node.size.height,
          backgroundColor: 'hsl(var(--destructive) / 0.1)',
          border: '1px dashed hsl(var(--destructive))',
          borderRadius: '4px'
        }}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
      >
        <div className="flex flex-col items-center justify-center h-full text-destructive text-xs p-2">
          <div className="font-medium">عنصر ذكي غير موجود</div>
          <div className="text-center">النوع: {smartElementType}</div>
        </div>
      </div>
    );
  }

  const renderContext: RenderContext = {
    isSelected,
    isHovered,
    zoom,
    isEditing
  };

  const handleDoubleClick = (event: React.MouseEvent) => {
    // Check if element has custom double-click behavior
    if (definition.behaviors?.onDoubleClick) {
      definition.behaviors.onDoubleClick(node);
    } else if (onDoubleClick) {
      onDoubleClick(event);
    }
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    // Check if element has custom context menu behavior
    if (definition.behaviors?.onContextMenu) {
      definition.behaviors.onContextMenu(node, event.nativeEvent as MouseEvent);
    } else if (onContextMenu) {
      onContextMenu(event);
    }
  };

  return (
    <div
      className={`smart-element-canvas ${className} ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
      style={{
        width: node.size.width,
        height: node.size.height,
        position: 'relative',
        overflow: 'hidden',
        cursor: definition.behaviors?.onDoubleClick ? 'pointer' : 'default'
      }}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-primary bg-primary/5 rounded-md pointer-events-none z-10" />
      )}
      
      {/* Hover indicator */}
      {isHovered && !isSelected && (
        <div className="absolute inset-0 border border-primary/50 bg-primary/10 rounded-md pointer-events-none z-10" />
      )}
      
      {/* Smart element content */}
      <div className="smart-element-content w-full h-full relative">
        {definition.renderer(node, renderContext)}
      </div>
      
      {/* Edit mode overlay */}
      {isEditing && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-20 rounded-md">
          <div className="text-xs text-muted-foreground bg-background border rounded px-2 py-1">
            جاري التحرير...
          </div>
        </div>
      )}
    </div>
  );
}