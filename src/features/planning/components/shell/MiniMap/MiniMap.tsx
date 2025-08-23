import React from 'react';
import { useCanvasStore } from '../../../store/canvas.store';

export const MiniMap: React.FC = () => {
  const { elements, zoom, pan, frames } = useCanvasStore();
  
  const miniMapScale = 0.1; // Scale down to 10% for minimap
  const miniMapWidth = 200;
  const miniMapHeight = 150;

  return (
    <div className="absolute bottom-4 left-4 w-50 h-38 bg-card/90 backdrop-blur-sm border border-border rounded-lg overflow-hidden">
      <div className="p-2">
        <div className="text-xs text-muted-foreground mb-2">خريطة مصغرة</div>
        
        <div className="relative bg-background rounded border border-border/50" style={{ width: miniMapWidth, height: miniMapHeight }}>
          {/* Canvas bounds indicator */}
          <div 
            className="absolute border-2 border-primary/50 pointer-events-none"
            style={{
              left: `${-pan.x * miniMapScale}px`,
              top: `${-pan.y * miniMapScale}px`,
              width: `${(window.innerWidth / zoom) * miniMapScale}px`,
              height: `${(window.innerHeight / zoom) * miniMapScale}px`,
              transform: `scale(${miniMapScale})`
            }}
          />
          
          {/* Frames */}
          {frames.map((frame) => (
            <div
              key={frame.id}
              className="absolute border border-primary/30 bg-primary/10"
              style={{
                left: `${frame.bounds.x * miniMapScale}px`,
                top: `${frame.bounds.y * miniMapScale}px`,
                width: `${frame.bounds.width * miniMapScale}px`,
                height: `${frame.bounds.height * miniMapScale}px`
              }}
            />
          ))}
          
          {/* Elements (simplified representation) */}
          {elements.map((element) => (
            <div
              key={element.id}
              className="absolute bg-foreground/40 rounded-sm"
              style={{
                left: `${element.position.x * miniMapScale}px`,
                top: `${element.position.y * miniMapScale}px`,
                width: `${Math.max(element.size.width * miniMapScale, 2)}px`,
                height: `${Math.max(element.size.height * miniMapScale, 2)}px`
              }}
            />
          ))}
          
          {/* Viewport indicator */}
          <div 
            className="absolute border-2 border-primary bg-primary/20 cursor-move"
            style={{
              left: `${(-pan.x) * miniMapScale}px`,
              top: `${(-pan.y) * miniMapScale}px`,
              width: `${(window.innerWidth / zoom) * miniMapScale}px`,
              height: `${(window.innerHeight / zoom) * miniMapScale}px`
            }}
          />
        </div>
      </div>
    </div>
  );
};