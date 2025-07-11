import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, MousePointer, PenTool, MessageSquare, Type, Square, Lightbulb, ZoomIn, Hand, Upload } from 'lucide-react';
import { CanvasElement } from '../../types';
import { Layer } from '../CanvasPanelTypes';
import { SelectionToolPanel } from './tools/SelectionToolPanel';
import { SmartPenToolPanel } from './tools/SmartPenToolPanel';
import { ZoomToolPanel } from './tools/ZoomToolPanel';
import { HandToolPanel } from './tools/HandToolPanel';
import { UploadToolPanel } from './tools/UploadToolPanel';
import { InteractiveCommentsToolPanel } from './tools/InteractiveCommentsToolPanel';
import { TextToolPanel } from './tools/TextToolPanel';
import { ShapesToolPanel } from './tools/ShapesToolPanel';
import { SmartElementsToolPanel } from './tools/SmartElementsToolPanel';
interface ToolCustomizationPanelProps {
  selectedTool: string;
  selectedElements: CanvasElement[];
  zoom: number;
  canvasPosition: {
    x: number;
    y: number;
  };
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
  onPositionChange: (position: {
    x: number;
    y: number;
  }) => void;
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
  layers,
  selectedLayerId,
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
  onLayerReorder,
  onLayerSelect,
  onGridToggle,
  onSnapToggle,
  onGridSizeChange,
  onGridShapeChange,
  onAlignToGrid
}) => {
  const getToolIcon = (tool: string) => {
    switch (tool) {
      case 'select':
        return MousePointer;
      case 'smart-pen':
        return PenTool;
      case 'zoom':
        return ZoomIn;
      case 'hand':
        return Hand;
      case 'upload':
        return Upload;
      case 'comment':
        return MessageSquare;
      case 'text':
        return Type;
      case 'shape':
        return Square;
      case 'smart-element':
        return Lightbulb;
      default:
        return Settings;
    }
  };
  const getToolTitle = (tool: string) => {
    switch (tool) {
      case 'select':
        return 'أداة التحديد';
      case 'smart-pen':
        return 'القلم الذكي';
      case 'zoom':
        return 'أداة الزوم';
      case 'hand':
        return 'أداة الكف';
      case 'upload':
        return 'رفع المرفقات';
      case 'comment':
        return 'التعليقات التفاعلية';
      case 'text':
        return 'أداة النص';
      case 'shape':
        return 'أداة الأشكال';
      case 'smart-element':
        return 'العناصر الذكية';
      default:
        return 'تخصيص الأدوات';
    }
  };
  const renderToolContent = () => {
    switch (selectedTool) {
      case 'select':
        return <SelectionToolPanel selectedElements={selectedElements} onCopy={onCopy} onCut={onCut} onPaste={onPaste} onDelete={onDelete} onGroup={onGroup} onUpdateElement={onUpdateElement} />;
      case 'smart-pen':
        return <SmartPenToolPanel lineWidth={lineWidth} lineStyle={lineStyle} selectedPenMode={selectedPenMode} onLineWidthChange={onLineWidthChange} onLineStyleChange={onLineStyleChange} onPenModeSelect={onPenModeSelect} />;
      case 'zoom':
        return <ZoomToolPanel zoom={zoom} canvasPosition={canvasPosition} onZoomChange={onZoomChange} onPositionChange={onPositionChange} onFitToScreen={onFitToScreen} onResetView={onResetView} />;
      case 'hand':
        return <HandToolPanel panSpeed={panSpeed} canvasPosition={canvasPosition} onPanSpeedChange={onPanSpeedChange} onPositionChange={onPositionChange} onResetView={onResetView} />;
      case 'upload':
        return <UploadToolPanel onFileUpload={onFileUpload} />;
      case 'comment':
        return <InteractiveCommentsToolPanel />;
      case 'text':
        return <TextToolPanel />;
      case 'shape':
        return <ShapesToolPanel />;
      case 'smart-element':
        return <SmartElementsToolPanel />;
      default:
        return <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Settings className="w-12 h-12 text-[#96d8d0] mx-auto mb-3" />
              <p className="text-sm font-arabic text-black/70">
                اختر أداة لتخصيص إعداداتها
              </p>
            </div>
          </div>;
    }
  };
  const ToolIcon = getToolIcon(selectedTool);
  return <Card className="w-full h-full bg-[#f2f9fb]/95 backdrop-blur-xl shadow-sm border border-white/20 rounded-[32px] overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2 text-black">
          
          {getToolTitle(selectedTool)}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="h-[calc(100%-4rem)] overflow-y-auto">
        {renderToolContent()}
      </CardContent>
    </Card>;
};