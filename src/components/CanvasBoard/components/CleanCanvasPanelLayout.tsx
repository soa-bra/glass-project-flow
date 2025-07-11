import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Undo2, 
  Redo2, 
  Save, 
  Download, 
  Settings,
  ZoomIn,
  ZoomOut,
  Grid3x3,
  MousePointer,
  Type,
  Square,
  Circle,
  StickyNote,
  Hand,
  Wand2
} from 'lucide-react';
import { CanvasElement, CanvasLayer } from '../types/index';

interface CleanCanvasPanelLayoutProps {
  // History
  historyIndex: number;
  history: any[];
  onUndo: () => void;
  onRedo: () => void;
  
  // File operations
  onSave: () => void;
  onExport: () => void;
  onSettings: () => void;
  
  // Tool state
  selectedTool: string;
  setSelectedTool: (tool: string) => void;
  
  // Selection
  selectedElementId: string | null;
  selectedElements: string[];
  selectedSmartElement: any;
  
  // Canvas state
  zoom: number;
  setZoom: (zoom: number) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  snapEnabled: boolean;
  setSnapEnabled: (enabled: boolean) => void;
  gridSize: number;
  gridShape: string;
  
  // Data
  layers: CanvasLayer[];
  selectedLayerId: string;
  elements: CanvasElement[];
  canvasPosition: { x: number; y: number };
  panSpeed: number;
  lineWidth: number;
  lineStyle: string;
  selectedPenMode: string;
  
  // Handlers
  handleSmartElementSelect: (element: any) => void;
  handleGridSizeChange: (size: number) => void;
  handleGridShapeChange: (shape: string) => void;
  handleAlignToGrid: () => void;
  handleLayerUpdate: (layerId: string, updates: Partial<CanvasLayer>) => void;
  handleLayerSelect: (layerId: string) => void;
  handleCopy: () => void;
  handleCut: () => void;
  handlePaste: () => void;
  handleDeleteSelected: () => void;
  handleGroup: () => void;
  handleUngroup: () => void;
  handleLock: () => void;
  handleUnlock: () => void;
  updateElement: (elementId: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (elementId: string) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onFitToScreen: () => void;
  onResetView: () => void;
  onPanSpeedChange: (speed: number) => void;
  onLineWidthChange: (width: number) => void;
  onLineStyleChange: (style: string) => void;
  onPenModeSelect: (mode: string) => void;
  onFileUpload: (files: FileList) => void;
  onNew: () => void;
  onOpen: () => void;
  onSmartProjectGenerate: () => void;
}

export const CleanCanvasPanelLayout: React.FC<CleanCanvasPanelLayoutProps> = ({
  historyIndex,
  history,
  onUndo,
  onRedo,
  onSave,
  onExport,
  onSettings,
  selectedTool,
  setSelectedTool,
  zoom,
  setZoom,
  showGrid,
  setShowGrid,
  snapEnabled,
  setSnapEnabled
}) => {
  
  const tools = [
    { id: 'select', icon: MousePointer, label: 'تحديد' },
    { id: 'hand', icon: Hand, label: 'يد' },
    { id: 'text', icon: Type, label: 'نص' },
    { id: 'rectangle', icon: Square, label: 'مستطيل' },
    { id: 'circle', icon: Circle, label: 'دائرة' },
    { id: 'sticky', icon: StickyNote, label: 'ملاحظة' },
    { id: 'smart-pen', icon: Wand2, label: 'قلم ذكي' },
  ];
  
  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 25, 500));
  };
  
  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 25, 25));
  };
  
  return (
    <>
      {/* Top Toolbar */}
      <Card className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-background/95 backdrop-blur-sm border shadow-lg z-10">
        <div className="flex items-center gap-2 p-2">
          {/* History */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onUndo}
              disabled={historyIndex <= 0}
              className="p-2 h-8 w-8"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 h-8 w-8"
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* Tools */}
          <div className="flex items-center gap-1">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Button
                  key={tool.id}
                  variant={selectedTool === tool.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedTool(tool.id)}
                  className="p-2 h-8 w-8"
                  title={tool.label}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              );
            })}
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* View Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant={showGrid ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
              className="p-2 h-8 w-8"
              title="إظهار الشبكة"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="p-2 h-8 w-8"
              title="تصغير"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            
            <span className="text-xs text-muted-foreground min-w-[3rem] text-center">
              {zoom}%
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="p-2 h-8 w-8"
              title="تكبير"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* File Operations */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSave}
              className="p-2 h-8 w-8"
              title="حفظ"
            >
              <Save className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onExport}
              className="p-2 h-8 w-8"
              title="تصدير"
            >
              <Download className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettings}
              className="p-2 h-8 w-8"
              title="الإعدادات"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Status Bar */}
      <Card className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/95 backdrop-blur-sm border shadow-lg z-10">
        <div className="flex items-center gap-4 px-4 py-2 text-xs text-muted-foreground">
          <span>الأداة: {tools.find(t => t.id === selectedTool)?.label || selectedTool}</span>
          <Separator orientation="vertical" className="h-4" />
          <span>التكبير: {zoom}%</span>
          <Separator orientation="vertical" className="h-4" />
          <span className={showGrid ? 'text-primary' : ''}>
            الشبكة: {showGrid ? 'مفعلة' : 'معطلة'}
          </span>
        </div>
      </Card>
    </>
  );
};