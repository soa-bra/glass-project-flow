import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { EnhancedCanvasElement } from '../types/enhanced';

interface MiniMapProps {
  elements: EnhancedCanvasElement[];
  viewportBounds: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  zoom: number;
  canvasPosition: { x: number; y: number };
  onViewportChange: (position: { x: number; y: number }) => void;
  className?: string;
}

export const MiniMap: React.FC<MiniMapProps> = ({
  elements,
  viewportBounds,
  zoom,
  canvasPosition,
  onViewportChange,
  className
}) => {
  const MINIMAP_WIDTH = 200;
  const MINIMAP_HEIGHT = 150;
  const SCALE_FACTOR = 0.1;

  // Calculate bounds of all elements
  const elementsBounds = React.useMemo(() => {
    if (elements.length === 0) {
      return { left: 0, top: 0, right: 1000, bottom: 1000 };
    }

    let left = Infinity;
    let top = Infinity;
    let right = -Infinity;
    let bottom = -Infinity;

    elements.forEach(element => {
      left = Math.min(left, element.position.x);
      top = Math.min(top, element.position.y);
      right = Math.max(right, element.position.x + element.size.width);
      bottom = Math.max(bottom, element.position.y + element.size.height);
    });

    // Add some padding
    const padding = 100;
    return {
      left: left - padding,
      top: top - padding,
      right: right + padding,
      bottom: bottom + padding
    };
  }, [elements]);

  const boundsWidth = elementsBounds.right - elementsBounds.left;
  const boundsHeight = elementsBounds.bottom - elementsBounds.top;

  // Calculate scale to fit content in minimap
  const scaleX = MINIMAP_WIDTH / boundsWidth;
  const scaleY = MINIMAP_HEIGHT / boundsHeight;
  const minimapScale = Math.min(scaleX, scaleY, SCALE_FACTOR);

  // Transform coordinates to minimap space
  const transformToMinimap = (x: number, y: number) => ({
    x: (x - elementsBounds.left) * minimapScale,
    y: (y - elementsBounds.top) * minimapScale
  });

  // Transform viewport bounds to minimap
  const viewportInMinimap = {
    x: (viewportBounds.left - elementsBounds.left) * minimapScale,
    y: (viewportBounds.top - elementsBounds.top) * minimapScale,
    width: (viewportBounds.right - viewportBounds.left) * minimapScale,
    height: (viewportBounds.bottom - viewportBounds.top) * minimapScale
  };

  const handleMinimapClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Transform click coordinates back to canvas space
    const canvasX = (clickX / minimapScale) + elementsBounds.left;
    const canvasY = (clickY / minimapScale) + elementsBounds.top;

    onViewportChange({ x: canvasX, y: canvasY });
  };

  return (
    <Card className={cn("bg-white/95 backdrop-blur-lg shadow-sm border border-gray-200/50", className)}>
      <CardContent className="p-2">
        <div className="text-xs text-gray-600 mb-2 text-center">الخريطة المصغرة</div>
        
        <div 
          className="relative bg-gray-50 border border-gray-200 cursor-pointer"
          style={{ 
            width: MINIMAP_WIDTH, 
            height: MINIMAP_HEIGHT 
          }}
          onClick={handleMinimapClick}
        >
          {/* Elements */}
          {elements.map((element) => {
            const pos = transformToMinimap(element.position.x, element.position.y);
            const size = {
              width: element.size.width * minimapScale,
              height: element.size.height * minimapScale
            };

            return (
              <div
                key={element.id}
                className={cn(
                  "absolute border",
                  element.type === 'text' && "bg-blue-100 border-blue-300",
                  element.type === 'shape' && "bg-green-100 border-green-300",
                  element.type === 'sticky' && "bg-yellow-100 border-yellow-300",
                  element.type === 'comment' && "bg-purple-100 border-purple-300",
                  !['text', 'shape', 'sticky', 'comment'].includes(element.type) && "bg-gray-100 border-gray-300"
                )}
                style={{
                  left: pos.x,
                  top: pos.y,
                  width: Math.max(size.width, 2),
                  height: Math.max(size.height, 2),
                  opacity: element.opacity || 1
                }}
              />
            );
          })}

          {/* Viewport indicator */}
          <div
            className="absolute border-2 border-blue-500 bg-blue-500/20"
            style={{
              left: Math.max(0, viewportInMinimap.x),
              top: Math.max(0, viewportInMinimap.y),
              width: Math.min(MINIMAP_WIDTH - Math.max(0, viewportInMinimap.x), viewportInMinimap.width),
              height: Math.min(MINIMAP_HEIGHT - Math.max(0, viewportInMinimap.y), viewportInMinimap.height)
            }}
          />

          {/* Scale indicator */}
          <div className="absolute bottom-1 left-1 text-xs text-gray-500 bg-white/80 px-1 rounded">
            {Math.round(zoom)}%
          </div>
        </div>

        {/* Navigation hints */}
        <div className="text-xs text-gray-500 mt-1 text-center">
          انقر للتنقل
        </div>
      </CardContent>
    </Card>
  );
};