import React from 'react';
import { useCanvasStore } from '../../../store/canvas.store';
import { Grid } from '../Grid/Grid';
import { SelectionTool } from '../../tools/SelectionTool/SelectionTool';
import { PanTool } from '../../tools/PanTool/PanTool';
import { ZoomTool } from '../../tools/ZoomTool/ZoomTool';
import { SmartPenTool } from '../../tools/SmartPenTool/SmartPenTool';
import { ThinkingBoard } from '../../smartElements/ThinkingBoard/ThinkingBoard';
import { KanbanBoard } from '../../smartElements/KanbanBoard/KanbanBoard';
import { VotingSystem } from '../../smartElements/VotingSystem/VotingSystem';
import { Timeline } from '../../smartElements/Timeline/Timeline';

export const CanvasSurface: React.FC = () => {
  const { elements, zoom, pan, selectedElementIds, updateElement } = useCanvasStore();

  const renderElement = (element: any) => {
    const isSelected = selectedElementIds.includes(element.id);
    
    switch (element.type) {
      case 'smart_element':
        return renderSmartElement(element, isSelected);
      
      case 'shape':
        return (
          <g key={element.id}>
            <rect
              x={element.position.x}
              y={element.position.y}
              width={element.size.width}
              height={element.size.height}
              fill={element.style?.fill || 'transparent'}
              stroke={element.style?.stroke || 'hsl(var(--border))'}
              strokeWidth={element.style?.strokeWidth || 1}
              rx={element.style?.cornerRadius || 0}
            />
            {isSelected && (
              <rect
                x={element.position.x - 2}
                y={element.position.y - 2}
                width={element.size.width + 4}
                height={element.size.height + 4}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth={2 / zoom}
                strokeDasharray={`${4 / zoom} ${2 / zoom}`}
                rx={(element.style?.cornerRadius || 0) + 2}
              />
            )}
          </g>
        );
      
      case 'drawing':
        return (
          <g key={element.id}>
            {element.data?.path && (
              <path
                d={element.data.path}
                fill="none"
                stroke={element.style?.color || 'hsl(var(--foreground))'}
                strokeWidth={element.style?.strokeWidth || 2}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={
                  element.style?.strokeStyle === 'dashed' ? `${8 / zoom} ${4 / zoom}` :
                  element.style?.strokeStyle === 'dotted' ? `${2 / zoom} ${4 / zoom}` :
                  undefined
                }
              />
            )}
            {isSelected && element.data?.points && (
              <rect
                x={element.position.x - 5}
                y={element.position.y - 5}
                width={element.size.width + 10}
                height={element.size.height + 10}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth={2 / zoom}
                strokeDasharray={`${4 / zoom} ${2 / zoom}`}
              />
            )}
          </g>
        );
      
      default:
        return null;
    }
  };

  const renderSmartElement = (element: any, isSelected: boolean) => {
    const commonProps = {
      element,
      isSelected,
      onUpdate: (updates: any) => updateElement(element.id, updates)
    };

    const style = {
      position: 'absolute' as const,
      left: element.position.x,
      top: element.position.y,
      width: element.size.width,
      height: element.size.height,
      pointerEvents: 'auto' as const
    };

    switch (element.data?.smartType) {
      case 'thinking_board':
        return (
          <div key={element.id} style={style}>
            <ThinkingBoard {...commonProps} />
          </div>
        );
      
      case 'kanban_board':
        return (
          <div key={element.id} style={style}>
            <KanbanBoard {...commonProps} />
          </div>
        );
      
      case 'voting':
        return (
          <div key={element.id} style={style}>
            <VotingSystem {...commonProps} />
          </div>
        );
      
      case 'timeline':
        return (
          <div key={element.id} style={style}>
            <Timeline {...commonProps} />
          </div>
        );
      
      default:
        return (
          <div 
            key={element.id} 
            style={style}
            className={`bg-card border-2 border-dashed border-muted-foreground/50 rounded-lg p-4 ${
              isSelected ? 'border-primary' : ''
            }`}
          >
            <div className="text-center text-muted-foreground">
              <div className="text-sm font-medium">عنصر ذكي</div>
              <div className="text-xs">{element.data?.smartType || 'نوع غير معروف'}</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-background">
      <div 
        className="relative w-full h-full"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0'
        }}
      >
        <Grid />
        
        {/* Canvas Elements (SVG) */}
        <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
          {elements
            .filter(el => el.visible !== false && el.type !== 'smart_element')
            .map(element => renderElement(element))
          }
        </svg>
        
        {/* Smart Elements (HTML) */}
        <div className="absolute inset-0 pointer-events-none">
          {elements
            .filter(el => el.visible !== false && el.type === 'smart_element')
            .map(element => renderElement(element))
          }
        </div>
      </div>
      
      {/* Interactive Tools Layer */}
      <SelectionTool />
      <PanTool />
      <ZoomTool />
      <SmartPenTool />
    </div>
  );
};