
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Settings, Grid, Move, ZoomIn, ZoomOut, RotateCcw, Maximize } from 'lucide-react';
import { CanvasElement } from '../../types';
import { Layer } from '../CanvasPanelTypes';

interface ToolCustomizationPanelProps {
  selectedTool: string;
  selectedElements: CanvasElement[];
  zoom: number;
  canvasPosition: { x: number; y: number };
  panSpeed: number;
  lineWidth: number;
  lineStyle: string;
  selectedPenMode: string;
  showGrid: boolean;
  snapEnabled: boolean;
  gridSize: number;
  gridShape: string;
  layers: Layer[];
  selectedLayerId: string | null;
  onUpdateElement: (elementId: string, updates: any) => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onGroup: () => void;
  onZoomChange: (zoom: number) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onFitToScreen: () => void;
  onResetView: () => void;
  onPanSpeedChange: (speed: number) => void;
  onLineWidthChange: (width: number) => void;
  onLineStyleChange: (style: string) => void;
  onPenModeSelect: (mode: string) => void;
  onFileUpload: (files: File[]) => void;
  onLayerReorder: (layers: Layer[]) => void;
  onLayerSelect: (layerId: string) => void;
  onGridToggle: () => void;
  onSnapToggle: () => void;
  onGridSizeChange: (size: number) => void;
  onGridShapeChange: (shape: string) => void;
  onAlignToGrid: () => void;
}

export const ToolCustomizationPanel: React.FC<ToolCustomizationPanelProps> = ({
  selectedTool,
  selectedElements,
  zoom,
  canvasPosition,
  panSpeed,
  lineWidth,
  lineStyle,
  selectedPenMode,
  showGrid,
  snapEnabled,
  gridSize,
  gridShape,
  onZoomChange,
  onPositionChange,
  onFitToScreen,
  onResetView,
  onPanSpeedChange,
  onLineWidthChange,
  onLineStyleChange,
  onPenModeSelect,
  onGridToggle,
  onSnapToggle,
  onGridSizeChange,
  onGridShapeChange,
  onAlignToGrid
}) => {
  const lineStyles = [
    { value: 'solid', label: 'مصمت' },
    { value: 'dashed', label: 'متقطع' },
    { value: 'dotted', label: 'نقاط' }
  ];

  const penModes = [
    { value: 'smart-draw', label: 'رسم ذكي' },
    { value: 'freehand', label: 'رسم حر' },
    { value: 'geometric', label: 'هندسي' }
  ];

  const gridShapes = [
    { value: 'dots', label: 'نقاط' },
    { value: 'lines', label: 'خطوط' },
    { value: 'grid', label: 'شبكة' }
  ];

  return (
    <Card className="w-full h-full bg-[#f2f9fb]/95 backdrop-blur-xl shadow-sm border border-white/20 rounded-[32px] overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2 text-black">
          <Settings className="w-5 h-5 text-[#96d8d0]" />
          تخصيص الأدوات
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 h-[calc(100%-4rem)] overflow-y-auto">
        {/* Canvas Controls */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-3 text-black">التحكم في اللوحة</h4>
          
          {/* Zoom Controls */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-arabic text-black/70">التكبير: {zoom}%</span>
              <div className="flex gap-1">
                <Button
                  onClick={() => onZoomChange(Math.max(25, zoom - 25))}
                  size="sm"
                  variant="outline"
                  className="w-8 h-8 p-0 rounded-[8px] border-[#d1e1ea]"
                >
                  <ZoomOut className="w-3 h-3" />
                </Button>
                <Button
                  onClick={() => onZoomChange(Math.min(400, zoom + 25))}
                  size="sm"
                  variant="outline"
                  className="w-8 h-8 p-0 rounded-[8px] border-[#d1e1ea]"
                >
                  <ZoomIn className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <Slider
              value={[zoom]}
              onValueChange={(value) => onZoomChange(value[0])}
              max={400}
              min={25}
              step={25}
              className="w-full"
            />
          </div>

          {/* Position Controls */}
          <div className="space-y-2 mb-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={onFitToScreen}
                size="sm"
                className="rounded-[12px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 text-black border-none"
              >
                <Maximize className="w-3 h-3 mr-1" />
                ملء الشاشة
              </Button>
              <Button
                onClick={onResetView}
                size="sm"
                className="rounded-[12px] bg-[#f1b5b9] hover:bg-[#f1b5b9]/80 text-black border-none"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                إعادة تعيين
              </Button>
            </div>
          </div>

          {/* Pan Speed */}
          <div className="mb-4">
            <label className="text-xs font-arabic text-black/70 mb-2 block">سرعة التحريك: {panSpeed}</label>
            <Slider
              value={[panSpeed]}
              onValueChange={(value) => onPanSpeedChange(value[0])}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        <Separator className="bg-[#d1e1ea]" />

        {/* Grid Settings */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-3 text-black">إعدادات الشبكة</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-arabic text-black">إظهار الشبكة</span>
              <Switch checked={showGrid} onCheckedChange={onGridToggle} />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-arabic text-black">المحاذاة التلقائية</span>
              <Switch checked={snapEnabled} onCheckedChange={onSnapToggle} />
            </div>

            {showGrid && (
              <>
                <div>
                  <label className="text-xs font-arabic text-black/70 mb-2 block">حجم الشبكة: {gridSize}px</label>
                  <Slider
                    value={[gridSize]}
                    onValueChange={(value) => onGridSizeChange(value[0])}
                    max={50}
                    min={10}
                    step={2}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-xs font-arabic text-black/70 mb-2 block">شكل الشبكة</label>
                  <div className="grid grid-cols-3 gap-1">
                    {gridShapes.map((shape) => (
                      <Button
                        key={shape.value}
                        onClick={() => onGridShapeChange(shape.value)}
                        variant={gridShape === shape.value ? "default" : "outline"}
                        size="sm"
                        className={`text-xs font-arabic rounded-[8px] ${
                          gridShape === shape.value 
                            ? 'bg-[#96d8d0] text-black hover:bg-[#96d8d0]/80' 
                            : 'border-[#d1e1ea] text-black hover:bg-[#e9eff4]/50'
                        }`}
                      >
                        {shape.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={onAlignToGrid}
                  size="sm"
                  className="w-full rounded-[12px] bg-[#bdeed3] hover:bg-[#bdeed3]/80 text-black border-none"
                >
                  <Grid className="w-3 h-3 mr-2" />
                  محاذاة العناصر للشبكة
                </Button>
              </>
            )}
          </div>
        </div>

        <Separator className="bg-[#d1e1ea]" />

        {/* Tool-specific Settings */}
        {selectedTool === 'smart-pen' && (
          <div>
            <h4 className="text-sm font-medium font-arabic mb-3 text-black">إعدادات القلم الذكي</h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-arabic text-black/70 mb-2 block">سمك الخط: {lineWidth}px</label>
                <Slider
                  value={[lineWidth]}
                  onValueChange={(value) => onLineWidthChange(value[0])}
                  max={20}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-xs font-arabic text-black/70 mb-2 block">نمط الخط</label>
                <div className="grid grid-cols-3 gap-1">
                  {lineStyles.map((style) => (
                    <Button
                      key={style.value}
                      onClick={() => onLineStyleChange(style.value)}
                      variant={lineStyle === style.value ? "default" : "outline"}
                      size="sm"
                      className={`text-xs font-arabic rounded-[8px] ${
                        lineStyle === style.value 
                          ? 'bg-[#96d8d0] text-black hover:bg-[#96d8d0]/80' 
                          : 'border-[#d1e1ea] text-black hover:bg-[#e9eff4]/50'
                      }`}
                    >
                      {style.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-arabic text-black/70 mb-2 block">وضع القلم</label>
                <div className="space-y-1">
                  {penModes.map((mode) => (
                    <Button
                      key={mode.value}
                      onClick={() => onPenModeSelect(mode.value)}
                      variant={selectedPenMode === mode.value ? "default" : "outline"}
                      size="sm"
                      className={`w-full text-xs font-arabic rounded-[8px] ${
                        selectedPenMode === mode.value 
                          ? 'bg-[#96d8d0] text-black hover:bg-[#96d8d0]/80' 
                          : 'border-[#d1e1ea] text-black hover:bg-[#e9eff4]/50'
                      }`}
                    >
                      {mode.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selection Info */}
        {selectedElements.length > 0 && (
          <>
            <Separator className="bg-[#d1e1ea]" />
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2 text-black">العناصر المحددة</h4>
              <div className="text-xs font-arabic text-black/70">
                تم تحديد {selectedElements.length} عنصر
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
