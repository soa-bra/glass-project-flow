
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Palette, 
  Move, 
  ZoomIn, 
  Grid, 
  Type, 
  Pen,
  Square,
  MousePointer,
  Upload,
  MessageSquare,
  Sparkles
} from 'lucide-react';
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
  
  // Handlers
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
  onUpdateElement,
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
  const getToolIcon = (tool: string) => {
    switch (tool) {
      case 'select': return MousePointer;
      case 'smart-pen': return Pen;
      case 'text': return Type;
      case 'shape': return Square;
      case 'smart-element': return Sparkles;
      case 'zoom': return ZoomIn;
      case 'hand': return Move;
      case 'grid': return Grid;
      case 'upload': return Upload;
      case 'comment': return MessageSquare;
      default: return Settings;
    }
  };

  const getToolLabel = (tool: string) => {
    switch (tool) {
      case 'select': return 'أداة التحديد';
      case 'smart-pen': return 'القلم الذكي';
      case 'text': return 'النص';
      case 'shape': return 'الأشكال';
      case 'smart-element': return 'العناصر الذكية';
      case 'zoom': return 'التكبير';
      case 'hand': return 'التحريك';
      case 'grid': return 'الشبكة';
      case 'upload': return 'الرفع';
      case 'comment': return 'التعليقات';
      default: return 'الإعدادات';
    }
  };

  const renderToolContent = () => {
    switch (selectedTool) {
      case 'select':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-[#96d8d0] text-black border-none">
                {selectedElements.length} عنصر محدد
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={onCopy}
                size="sm" 
                className="rounded-[12px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 text-black border-none"
              >
                نسخ
              </Button>
              <Button 
                onClick={onCut}
                size="sm" 
                className="rounded-[12px] bg-[#bdeed3] hover:bg-[#bdeed3]/80 text-black border-none"
              >
                قص
              </Button>
              <Button 
                onClick={onPaste}
                size="sm" 
                className="rounded-[12px] bg-[#fbe2aa] hover:bg-[#fbe2aa]/80 text-black border-none"
              >
                لصق
              </Button>
              <Button 
                onClick={onDelete}
                size="sm" 
                className="rounded-[12px] bg-[#f1b5b9] hover:bg-[#f1b5b9]/80 text-black border-none"
              >
                حذف
              </Button>
            </div>
            
            <Button 
              onClick={onGroup}
              size="sm" 
              className="w-full rounded-[12px] bg-black text-white"
            >
              تجميع العناصر
            </Button>
          </div>
        );

      case 'smart-pen':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-arabic text-black mb-2 block">نمط القلم</label>
              <Select value={selectedPenMode} onValueChange={onPenModeSelect}>
                <SelectTrigger className="rounded-[12px] border-[#d1e1ea] text-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">عادي</SelectItem>
                  <SelectItem value="smart">ذكي</SelectItem>
                  <SelectItem value="smooth">ناعم</SelectItem>
                  <SelectItem value="pressure">حساس للضغط</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-arabic text-black mb-2 block">سمك الخط: {lineWidth}px</label>
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
              <label className="text-sm font-arabic text-black mb-2 block">نمط الخط</label>
              <Select value={lineStyle} onValueChange={onLineStyleChange}>
                <SelectTrigger className="rounded-[12px] border-[#d1e1ea] text-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">مستمر</SelectItem>
                  <SelectItem value="dashed">متقطع</SelectItem>
                  <SelectItem value="dotted">منقط</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'zoom':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-arabic text-black mb-2 block">مستوى التكبير: {Math.round(zoom * 100)}%</label>
              <Slider
                value={[zoom]}
                onValueChange={(value) => onZoomChange(value[0])}
                max={3}
                min={0.1}
                step={0.1}
                className="w-full"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={onFitToScreen}
                size="sm" 
                className="rounded-[12px] bg-[#96d8d0] hover:bg-[#96d8d0]/80 text-black border-none"
              >
                ملء الشاشة
              </Button>
              <Button 
                onClick={onResetView}
                size="sm" 
                className="rounded-[12px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 text-black border-none"
              >
                إعادة تعيين
              </Button>
            </div>
            
            <div>
              <label className="text-sm font-arabic text-black mb-2 block">سرعة التحريك: {panSpeed}</label>
              <Slider
                value={[panSpeed]}
                onValueChange={(value) => onPanSpeedChange(value[0])}
                max={5}
                min={0.5}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        );

      case 'grid':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-arabic text-black">إظهار الشبكة</label>
              <Button 
                onClick={onGridToggle}
                size="sm" 
                className={`rounded-[12px] ${showGrid ? 'bg-[#96d8d0] hover:bg-[#96d8d0]/80' : 'bg-[#d1e1ea] hover:bg-[#d1e1ea]/80'} text-black border-none`}
              >
                {showGrid ? 'مفعل' : 'معطل'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-arabic text-black">الالتصاق</label>
              <Button 
                onClick={onSnapToggle}
                size="sm" 
                className={`rounded-[12px] ${snapEnabled ? 'bg-[#96d8d0] hover:bg-[#96d8d0]/80' : 'bg-[#d1e1ea] hover:bg-[#d1e1ea]/80'} text-black border-none`}
              >
                {snapEnabled ? 'مفعل' : 'معطل'}
              </Button>
            </div>
            
            <div>
              <label className="text-sm font-arabic text-black mb-2 block">حجم الشبكة: {gridSize}px</label>
              <Slider
                value={[gridSize]}
                onValueChange={(value) => onGridSizeChange(value[0])}
                max={50}
                min={10}
                step={5}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-arabic text-black mb-2 block">شكل الشبكة</label>
              <Select value={gridShape} onValueChange={onGridShapeChange}>
                <SelectTrigger className="rounded-[12px] border-[#d1e1ea] text-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">مربع</SelectItem>
                  <SelectItem value="dots">نقاط</SelectItem>
                  <SelectItem value="lines">خطوط</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={onAlignToGrid}
              size="sm" 
              className="w-full rounded-[12px] bg-black text-white"
            >
              محاذاة للشبكة
            </Button>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div className="text-sm font-arabic text-black/70">
              انقر في أي مكان على اللوحة لإضافة نص
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" className="rounded-[12px] bg-[#96d8d0] hover:bg-[#96d8d0]/80 text-black border-none">
                عنوان
              </Button>
              <Button size="sm" className="rounded-[12px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 text-black border-none">
                نص عادي
              </Button>
              <Button size="sm" className="rounded-[12px] bg-[#bdeed3] hover:bg-[#bdeed3]/80 text-black border-none">
                قائمة
              </Button>
              <Button size="sm" className="rounded-[12px] bg-[#fbe2aa] hover:bg-[#fbe2aa]/80 text-black border-none">
                اقتباس
              </Button>
            </div>
          </div>
        );

      case 'shape':
        return (
          <div className="space-y-4">
            <div className="text-sm font-arabic text-black/70">
              اختر شكل واسحب لإضافته
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Button size="sm" className="rounded-[12px] bg-[#96d8d0] hover:bg-[#96d8d0]/80 text-black border-none">
                مربع
              </Button>
              <Button size="sm" className="rounded-[12px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 text-black border-none">
                دائرة
              </Button>
              <Button size="sm" className="rounded-[12px] bg-[#bdeed3] hover:bg-[#bdeed3]/80 text-black border-none">
                مثلث
              </Button>
              <Button size="sm" className="rounded-[12px] bg-[#fbe2aa] hover:bg-[#fbe2aa]/80 text-black border-none">
                خط
              </Button>
              <Button size="sm" className="rounded-[12px] bg-[#f1b5b9] hover:bg-[#f1b5b9]/80 text-black border-none">
                سهم
              </Button>
              <Button size="sm" className="rounded-[12px] bg-[#e1d4f1] hover:bg-[#e1d4f1]/80 text-black border-none">
                نجمة
              </Button>
            </div>
          </div>
        );

      case 'upload':
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-[#d1e1ea] rounded-[16px] p-4 text-center">
              <Input 
                type="file" 
                multiple 
                accept="image/*,video/*,audio/*,.pdf"
                className="hidden"
                id="file-upload"
                onChange={(e) => e.target.files && onFileUpload(Array.from(e.target.files))}
              />
              <label 
                htmlFor="file-upload" 
                className="cursor-pointer flex flex-col items-center gap-2 text-black"
              >
                <Upload className="w-6 h-6" />
                <span className="text-sm font-arabic">اسحب الملفات هنا أو انقر للتحديد</span>
              </label>
            </div>
            
            <div className="text-xs text-black/70 font-arabic">
              يدعم: الصور، الفيديو، الصوت، PDF
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div className="text-sm font-arabic text-black/70">
              لا توجد إعدادات متاحة لهذه الأداة
            </div>
          </div>
        );
    }
  };

  const ToolIcon = getToolIcon(selectedTool);

  return (
    <Card className="w-full h-full bg-[#f2f9fb]/95 backdrop-blur-xl shadow-sm border border-white/20 rounded-[32px] overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2 text-black">
          <ToolIcon className="w-5 h-5" />
          {getToolLabel(selectedTool)}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="h-[calc(100%-4rem)] overflow-y-auto">
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-transparent p-1">
            <TabsTrigger 
              value="settings" 
              className="rounded-[12px] text-xs font-arabic data-[state=active]:bg-[#96d8d0] data-[state=active]:text-black"
            >
              إعدادات
            </TabsTrigger>
            <TabsTrigger 
              value="style" 
              className="rounded-[12px] text-xs font-arabic data-[state=active]:bg-[#96d8d0] data-[state=active]:text-black"
            >
              التنسيق
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="mt-4">
            {renderToolContent()}
          </TabsContent>
          
          <TabsContent value="style" className="mt-4">
            <div className="space-y-4">
              <div className="text-sm font-arabic text-black/70">
                خيارات التنسيق العامة
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                <Button size="sm" className="rounded-[12px] bg-[#96d8d0] hover:bg-[#96d8d0]/80 text-black border-none aspect-square">
                  <Palette className="w-4 h-4" />
                </Button>
                <Button size="sm" className="rounded-[12px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 text-black border-none aspect-square">
                  <Type className="w-4 h-4" />
                </Button>
                <Button size="sm" className="rounded-[12px] bg-[#bdeed3] hover:bg-[#bdeed3]/80 text-black border-none aspect-square">
                  <Square className="w-4 h-4" />
                </Button>
                <Button size="sm" className="rounded-[12px] bg-[#fbe2aa] hover:bg-[#fbe2aa]/80 text-black border-none aspect-square">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
