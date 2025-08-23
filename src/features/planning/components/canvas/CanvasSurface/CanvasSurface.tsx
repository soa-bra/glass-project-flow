import React from 'react';
import { useCanvasStore } from '../../../store/canvas.store';
import { Grid } from '../Grid/Grid';
import { SelectionTool } from '../../tools/SelectionTool/SelectionTool';
import { PanTool } from '../../tools/PanTool/PanTool';
import { ZoomTool } from '../../tools/ZoomTool/ZoomTool';
import { SmartPenTool } from '../../tools/SmartPenTool/SmartPenTool';

export const CanvasSurface: React.FC = () => {
  const { elements, zoom, pan, selectedElementIds } = useCanvasStore();

  const renderElement = (element: any) => {
    const isSelected = selectedElementIds.includes(element.id);
    
    switch (element.type) {
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
        
        {/* Canvas Elements */}
        <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
          {elements
            .filter(el => el.visible !== false)
            .map(element => renderElement(element))
          }
        </svg>
      </div>
      
      {/* Interactive Tools Layer */}
      <SelectionTool />
      <PanTool />
      <ZoomTool />
      <SmartPenTool />
    </div>
  );
};