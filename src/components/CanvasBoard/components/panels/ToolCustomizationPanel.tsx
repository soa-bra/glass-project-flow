import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CanvasElement } from '../../types';
import { Layer } from '../CanvasPanelTypes';
import { 
  Palette, 
  Square, 
  Circle, 
  Type, 
  Move, 
  ZoomIn, 
  Grid3x3, 
  Layers,
  Hand,
  Pen,
  Upload,
  Copy,
  Scissors,
  Trash2,
  Group,
  Lock,
  Unlock
} from 'lucide-react';

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
  onCopy,
  onCut,
  onPaste,
  onDelete,
  onGroup,
  onZoomChange,
  onPositionChange,
  onFitToScreen,
  onResetView,
  onPanSpeedChange,
  onLineWidthChange,
  onLineStyleChange,
  onPenModeSelect,
  onFileUpload,
  onGridToggle,
  onSnapToggle,
  onGridSizeChange,
  onGridShapeChange,
  onAlignToGrid
}) => {
  const getToolIcon = () => {
    switch (selectedTool) {
      case 'select': return <Move className="w-4 h-4" />;
      case 'smart-pen': return <Pen className="w-4 h-4" />;
      case 'shape': return <Square className="w-4 h-4" />;
      case 'text': return <Type className="w-4 h-4" />;
      case 'hand': return <Hand className="w-4 h-4" />;
      case 'zoom': return <ZoomIn className="w-4 h-4" />;
      case 'upload': return <Upload className="w-4 h-4" />;
      default: return <Palette className="w-4 h-4" />;
    }
  };

  const getToolName = () => {
    switch (selectedTool) {
      case 'select': return 'أداة التحديد';
      case 'smart-pen': return 'القلم الذكي';
      case 'shape': return 'الأشكال';
      case 'text': return 'النص';
      case 'hand': return 'اليد';
      case 'zoom': return 'التكبير';
      case 'upload': return 'رفع الملفات';
      default: return 'أداة غير معروفة';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFileUpload(files);
    }
  };

  return (
    <Card className="w-full h-full bg-[#f2f9fb]/95 backdrop-blur-xl shadow-sm border border-white/20 rounded-[32px] overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2 text-black">
          {getToolIcon()}
          تخصيص {getToolName()}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 h-[calc(100%-4rem)] overflow-y-auto">
        {/* Tool-specific controls */}
        {selectedTool === 'smart-pen' && (
          <>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-black">إعدادات القلم</h4>
              
              <div className="space-y-2">
                <Label className="text-xs text-black/70">نمط القلم</Label>
                <Select value={selectedPenMode} onValueChange={onPenModeSelect}>
                  <SelectTrigger className="rounded-[16px] border-[#d1e1ea] text-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[#d1e1ea] rounded-[16px]">
                    <SelectItem value="smart-draw">رسم ذكي</SelectItem>
                    <SelectItem value="free-draw">رسم حر</SelectItem>
                    <SelectItem value="line-draw">خط مستقيم</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-black/70">سُمك الخط: {lineWidth}px</Label>
                <Slider
                  value={[lineWidth]}
                  onValueChange={([value]) => onLineWidthChange(value)}
                  min={1}
                  max={20}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-black/70">نوع الخط</Label>
                <Select value={lineStyle} onValueChange={onLineStyleChange}>
                  <SelectTrigger className="rounded-[16px] border-[#d1e1ea] text-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[#d1e1ea] rounded-[16px]">
                    <SelectItem value="solid">متصل</SelectItem>
                    <SelectItem value="dashed">متقطع</SelectItem>
                    <SelectItem value="dotted">منقط</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Separator className="bg-[#d1e1ea]" />
          </>
        )}

        {selectedTool === 'select' && selectedElements.length > 0 && (
          <>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-black">إجراءات التحديد</h4>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={onCopy}
                  size="sm"
                  className="rounded-[16px] bg-[#96d8d0] hover:bg-[#96d8d0]/80 text-black border-none"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  نسخ
                </Button>
                <Button
                  onClick={onCut}
                  size="sm"
                  className="rounded-[16px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 text-black border-none"
                >
                  <Scissors className="w-4 h-4 mr-1" />
                  قص
                </Button>
                <Button
                  onClick={onDelete}
                  size="sm"
                  className="rounded-[16px] bg-[#fbe2aa] hover:bg-[#fbe2aa]/80 text-black border-none"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  حذف
                </Button>
                <Button
                  onClick={onGroup}
                  size="sm"
                  className="rounded-[16px] bg-[#bdeed3] hover:bg-[#bdeed3]/80 text-black border-none"
                >
                  <Group className="w-4 h-4 mr-1" />
                  تجميع
                </Button>
              </div>
            </div>
            
            <Separator className="bg-[#d1e1ea]" />
          </>
        )}

        {selectedTool === 'upload' && (
          <>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-black">رفع الملفات</h4>
              
              <div className="space-y-2">
                <Label htmlFor="file-upload" className="text-xs text-black/70">
                  اختر ملف لرفعه
                </Label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="block w-full text-xs text-black file:mr-4 file:py-2 file:px-4 file:rounded-[16px] file:border-0 file:text-xs file:font-medium file:bg-[#96d8d0] file:text-black hover:file:bg-[#96d8d0]/80"
                />
              </div>
            </div>
            
            <Separator className="bg-[#d1e1ea]" />
          </>
        )}

        {/* Canvas controls */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-black">عرض اللوحة</h4>
          
          <div className="space-y-2">
            <Label className="text-xs text-black/70">التكبير: {zoom}%</Label>
            <Slider
              value={[zoom]}
              onValueChange={([value]) => onZoomChange(value)}
              min={25}
              max={500}
              step={25}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs text-black/70">إظهار الشبكة</Label>
            <Switch
              checked={showGrid}
              onCheckedChange={onGridToggle}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs text-black/70">المحاذاة للشبكة</Label>
            <Switch
              checked={snapEnabled}
              onCheckedChange={onSnapToggle}
            />
          </div>

          {showGrid && (
            <div className="space-y-2">
              <Label className="text-xs text-black/70">حجم الشبكة: {gridSize}px</Label>
              <Slider
                value={[gridSize]}
                onValueChange={([value]) => onGridSizeChange(value)}
                min={12}
                max={48}
                step={4}
                className="w-full"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={onFitToScreen}
              size="sm"
              className="rounded-[16px] bg-[#e9eff4] hover:bg-[#e9eff4]/80 text-black border-none"
            >
              ملء الشاشة
            </Button>
            <Button
              onClick={onResetView}
              size="sm"
              className="rounded-[16px] bg-[#e9eff4] hover:bg-[#e9eff4]/80 text-black border-none"
            >
              إعادة تعيين
            </Button>
          </div>

          {snapEnabled && (
            <Button
              onClick={onAlignToGrid}
              size="sm"
              className="w-full rounded-[16px] bg-[#fbe2aa] hover:bg-[#fbe2aa]/80 text-black border-none"
            >
              <Grid3x3 className="w-4 h-4 mr-2" />
              محاذاة للشبكة
            </Button>
          )}
        </div>

        <Separator className="bg-[#d1e1ea]" />

        {/* Navigation controls */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-black">التنقل</h4>
          
          <div className="space-y-2">
            <Label className="text-xs text-black/70">سرعة التمرير: {panSpeed}</Label>
            <Slider
              value={[panSpeed]}
              onValueChange={([value]) => onPanSpeedChange(value)}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-black/70">الموضع الحالي</Label>
            <div className="text-xs text-black/60 bg-[#e9eff4] p-2 rounded-[12px]">
              X: {Math.round(canvasPosition.x)}, Y: {Math.round(canvasPosition.y)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};