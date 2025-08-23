import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useCanvasStore } from '../../../store/canvas.store';
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react';

export const BottomBar: React.FC = () => {
  const { zoom, setZoom, fitToScreen } = useCanvasStore();
  
  const handleZoomChange = (value: number[]) => {
    setZoom(value[0] / 100);
  };
  
  const handleZoomIn = () => {
    setZoom(Math.min(zoom * 1.2, 5));
  };
  
  const handleZoomOut = () => {
    setZoom(Math.max(zoom / 1.2, 0.1));
  };

  return (
    <div className="flex items-center justify-between p-2 border-t border-border bg-card">
      <div className="flex items-center gap-4">
        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2 min-w-32">
            <Slider
              value={[zoom * 100]}
              onValueChange={handleZoomChange}
              min={10}
              max={500}
              step={10}
              className="w-20"
            />
            <span className="text-xs text-muted-foreground w-10">
              {Math.round(zoom * 100)}%
            </span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Fit Controls */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-xs"
            onClick={fitToScreen}
          >
            <Maximize className="h-3 w-3 ml-1" />
            ملاءمة الشاشة
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-xs"
          >
            <RotateCcw className="h-3 w-3 ml-1" />
            إعادة تعيين
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Shortcuts Hint */}
        <div className="text-xs text-muted-foreground">
          اضغط Space للتحريك | V للتحديد | T للنص
        </div>
        
        {/* Timer/Voting (for collaboration sessions) */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {/* Will be implemented in Phase 5 */}
        </div>
      </div>
    </div>
  );
};