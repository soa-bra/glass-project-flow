import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';

interface MiroStyleBottomBarProps {
  zoom: number;
  elementsCount: number;
  selectedElementsCount: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  onResetZoom: () => void;
}

export const MiroStyleBottomBar: React.FC<MiroStyleBottomBarProps> = ({
  zoom,
  elementsCount,
  selectedElementsCount,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onResetZoom
}) => {
  return (
    <div className="absolute bottom-4 right-4 z-50">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex items-center space-x-2 rtl:space-x-reverse px-3 py-2">
        {/* Zoom Controls */}
        <Button variant="ghost" size="sm" onClick={onZoomOut}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onResetZoom}
          className="min-w-16 text-sm"
        >
          {zoom}%
        </Button>
        
        <Button variant="ghost" size="sm" onClick={onZoomIn}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        
        <div className="h-6 w-px bg-gray-200" />
        
        {/* Fit to Screen */}
        <Button variant="ghost" size="sm" onClick={onFitToScreen} title="ملاءمة للشاشة">
          <Maximize2 className="w-4 h-4" />
        </Button>
        
        {/* Reset View */}
        <Button variant="ghost" size="sm" onClick={onResetZoom} title="إعادة تعيين العرض">
          <RotateCcw className="w-4 h-4" />
        </Button>
        
        {/* Info */}
        {selectedElementsCount > 0 && (
          <>
            <div className="h-6 w-px bg-gray-200" />
            <span className="text-sm text-gray-600">
              {selectedElementsCount} محدد من {elementsCount}
            </span>
          </>
        )}
      </div>
    </div>
  );
};