import React from 'react';
import { useCanvasStore } from '../../../store/canvas.store';
import { Grid } from '../Grid/Grid';

export const CanvasSurface: React.FC = () => {
  const { 
    zoom, 
    pan, 
    showGrid, 
    elements, 
    selectedElementIds 
  } = useCanvasStore();

  return (
    <div className="relative w-full h-full overflow-hidden bg-background">
      {/* Canvas Container */}
      <div 
        className="absolute inset-0 origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
        }}
      >
        {/* Grid Layer */}
        {showGrid && <Grid />}
        
        {/* Elements Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {elements.map((element) => {
            const isSelected = selectedElementIds.includes(element.id);
            
            return (
              <g key={element.id}>
                {/* Render based on element type */}
                {element.type === 'rectangle' && (
                  <rect
                    x={element.position.x}
                    y={element.position.y}
                    width={element.size.width}
                    height={element.size.height}
                    fill={element.style.fill || 'hsl(var(--card))'}
                    stroke={isSelected ? 'hsl(var(--primary))' : (element.style.stroke || 'hsl(var(--border))')}
                    strokeWidth={isSelected ? 2 : (element.style.strokeWidth || 1)}
                    rx={element.style.cornerRadius || 0}
                    className="pointer-events-auto cursor-pointer"
                  />
                )}
                
                {element.type === 'text' && (
                  <text
                    x={element.position.x}
                    y={element.position.y + 16}
                    fill={element.style.color || 'hsl(var(--foreground))'}
                    fontSize={element.style.fontSize || 14}
                    fontFamily={element.style.fontFamily || 'IBM Plex Sans Arabic'}
                    className="pointer-events-auto cursor-pointer select-none"
                  >
                    {element.data?.text || 'نص'}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        
        {/* Selection Handles */}
        {selectedElementIds.length > 0 && (
          <div className="absolute pointer-events-none">
            {/* Selection handles will be implemented in Phase 2 */}
          </div>
        )}
      </div>
      
      {/* Canvas Info Overlay */}
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-card/80 backdrop-blur-sm px-2 py-1 rounded">
        التكبير: {Math.round(zoom * 100)}% | العناصر: {elements.length}
      </div>
    </div>
  );
};