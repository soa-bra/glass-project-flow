import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid, Move, Settings } from 'lucide-react';
import { CanvasElement } from '../types';
import { CANVAS_TOOLS } from '../constants';

interface CanvasStatusBarProps {
  elements?: CanvasElement[];
  selectedElementId?: string | null;
  zoom: number;
  position?: { x: number; y: number };
  selectedCount?: number;
  totalElements?: number;
  selectedTool?: string;
  showGrid?: boolean;
  snapEnabled?: boolean;
  gridEnabled?: boolean;
  onToggleGrid?: () => void;
  onToggleSnap?: () => void;
}

export const CanvasStatusBar: React.FC<CanvasStatusBarProps> = ({
  elements = [],
  selectedElementId,
  zoom,
  position,
  selectedCount = 0,
  totalElements = 0,
  selectedTool = 'select',
  showGrid = false,
  snapEnabled = false,
  gridEnabled = false,
  onToggleGrid,
  onToggleSnap
}) => {
  const elementCount = elements?.length || totalElements;
  const selectedCountDisplay = selectedElementId ? 1 : selectedCount;
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-300 p-2 rounded-t-2xl shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-600 font-arabic">
          <span>العناصر: {elementCount}</span>
          <span>المحددة: {selectedCountDisplay}</span>
          <span>الزوم: {zoom}%</span>
          {position && <span>الموضع: {Math.round(position.x)}, {Math.round(position.y)}</span>}
          <span>الأداة: {CANVAS_TOOLS.find(t => t.id === selectedTool)?.label || selectedTool}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onToggleGrid}
            className={`rounded-full border-gray-300 ${(showGrid || gridEnabled) ? 'bg-blue-100 text-blue-600 border-blue-300' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onToggleSnap}
            className={`rounded-full border-gray-300 ${snapEnabled ? 'bg-blue-100 text-blue-600 border-blue-300' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Move className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="rounded-full border-gray-300 text-gray-600 hover:bg-gray-100">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};