import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface MiroZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onFitToScreen: () => void;
}

export const MiroZoomControls: React.FC<MiroZoomControlsProps> = ({
  zoom,
  onZoomChange,
  onFitToScreen
}) => {
  const handleZoomIn = () => {
    onZoomChange(Math.min(zoom * 1.2, 5));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoom / 1.2, 0.1));
  };

  const zoomPercentage = Math.round(zoom * 100);

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 bg-white rounded-lg shadow-md border border-border flex items-center gap-1 p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleZoomOut}
        disabled={zoom <= 0.1}
        className="h-8 w-8 p-0"
      >
        <ZoomOut className="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onFitToScreen}
        className="px-3 h-8 text-sm font-medium min-w-[60px]"
      >
        {zoomPercentage}%
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleZoomIn}
        disabled={zoom >= 5}
        className="h-8 w-8 p-0"
      >
        <ZoomIn className="w-4 h-4" />
      </Button>
      
      <div className="w-px h-6 bg-border mx-1" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onFitToScreen}
        className="h-8 w-8 p-0"
        title="ملء الشاشة"
      >
        <Maximize2 className="w-4 h-4" />
      </Button>
    </div>
  );
};