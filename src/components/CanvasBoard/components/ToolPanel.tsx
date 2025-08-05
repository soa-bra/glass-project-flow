import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CanvasElement } from '../types';
import { Layer } from './CanvasPanelTypes';

// Enhanced Tool Panels (New)
import { EnhancedFileUploadPanel, EnhancedSmartElementsPanel, EnhancedSelectionPanel, EnhancedTextPanel, EnhancedShapesPanel, EnhancedCommentPanel } from './panels/tools';

// Legacy Tool Panels (Fallback)
import { SelectionToolPanel, SmartPenToolPanel, ZoomToolPanel, HandToolPanel, UploadToolPanel, InteractiveCommentsToolPanel, TextToolPanel, ShapesToolPanel, SmartElementsToolPanel } from './panels';
interface ToolPanelProps {
  selectedTool: string;
  selectedElements: CanvasElement[];
  elements: CanvasElement[];
  selectedElementId: string | null;
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

  // Event handlers
  onUpdateElement: (elementId: string, updates: any) => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onGroup: () => void;
  onUngroup: () => void;
  onLock: () => void;
  onUnlock: () => void;
  onRotate: () => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
  onAlign: (direction: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
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

// Tool to panel mapping based on requirements
const TOOL_PANEL_MAPPING = {
  'select': 'selection_panel',
  'smart-pen': 'smart_pen_panel',
  'zoom': 'zoom_panel',
  'hand': 'pan_panel',
  'upload': 'file_upload_panel',
  'comment': 'comment_panel',
  'text': 'text_panel',
  'shape': 'shapes_panel',
  'smart-element': 'smart_elements_panel'
};
export const ToolPanel: React.FC<ToolPanelProps> = props => {
  const {
    selectedTool
  } = props;

  // Get panel ID from tool mapping
  const panelId = TOOL_PANEL_MAPPING[selectedTool as keyof typeof TOOL_PANEL_MAPPING];

  // Render panel content based on selected tool
  const renderPanelContent = () => {
    switch (selectedTool) {
      case 'select':
        return <EnhancedSelectionPanel selectedElements={props.selectedElements} onCopy={props.onCopy} onCut={props.onCut} onPaste={props.onPaste} onDelete={props.onDelete} onGroup={props.onGroup} onUngroup={props.onUngroup} onLock={props.onLock} onUnlock={props.onUnlock} onRotate={props.onRotate} onFlipHorizontal={props.onFlipHorizontal} onFlipVertical={props.onFlipVertical} onAlign={props.onAlign} onUpdateElement={props.onUpdateElement} onSnapToGrid={props.onAlignToGrid}
        // Enhanced integrations
        onMoveElement={(elementId, direction, distance) => {
          const element = props.elements.find(el => el.id === elementId);
          if (element) {
            const newPosition = {
              ...element.position
            };
            switch (direction) {
              case 'up':
                newPosition.y -= distance;
                break;
              case 'down':
                newPosition.y += distance;
                break;
              case 'left':
                newPosition.x -= distance;
                break;
              case 'right':
                newPosition.x += distance;
                break;
            }
            props.onUpdateElement(elementId, {
              position: newPosition
            });
          }
        }} onRotateElement={(elementId, angle) => {
          const element = props.elements.find(el => el.id === elementId);
          if (element) {
            props.onUpdateElement(elementId, {
              rotation: (element.rotation || 0) + angle
            });
          }
        }} onArrange={arrangement => {
          // Handle layer arrangement
          props.selectedElements.forEach(element => {
            const currentZ = element.style?.zIndex || 0;
            let newZ = currentZ;
            switch (arrangement) {
              case 'front':
                newZ = 1000;
                break;
              case 'back':
                newZ = -1000;
                break;
              case 'forward':
                newZ = currentZ + 1;
                break;
              case 'backward':
                newZ = Math.max(-1000, currentZ - 1);
                break;
            }
            props.onUpdateElement(element.id, {
              style: {
                ...element.style,
                zIndex: newZ
              }
            });
          });
        }} />;
      case 'smart-pen':
        return <SmartPenToolPanel selectedPenMode={props.selectedPenMode} lineWidth={props.lineWidth} lineStyle={props.lineStyle} onPenModeSelect={props.onPenModeSelect} onLineWidthChange={props.onLineWidthChange} onLineStyleChange={props.onLineStyleChange} />;
      case 'zoom':
        return <ZoomToolPanel zoom={props.zoom} canvasPosition={props.canvasPosition} onZoomChange={props.onZoomChange} onPositionChange={props.onPositionChange} onFitToScreen={props.onFitToScreen} onResetView={props.onResetView} />;
      case 'hand':
        return <HandToolPanel panSpeed={props.panSpeed} canvasPosition={props.canvasPosition} onPanSpeedChange={props.onPanSpeedChange} onPositionChange={props.onPositionChange} onResetView={props.onResetView} />;
      case 'upload':
        return <EnhancedFileUploadPanel onFileUpload={props.onFileUpload} />;
      case 'comment':
        return <EnhancedCommentPanel selectedElementId={props.selectedElementId} />;
      case 'text':
        return <EnhancedTextPanel selectedText={props.selectedElements.find(el => el.type === 'text')?.content || ""} textStyle={props.selectedElements.find(el => el.type === 'text')?.style} onTextUpdate={text => {
          // Update selected text elements
          props.selectedElements.filter(el => el.type === 'text').forEach(element => {
            props.onUpdateElement(element.id, {
              content: text
            });
          });
        }} onStyleUpdate={style => {
          // Update selected text elements style
          props.selectedElements.filter(el => el.type === 'text').forEach(element => {
            props.onUpdateElement(element.id, {
              style: {
                ...element.style,
                ...style
              }
            });
          });
        }} onAddText={(text, style) => {
          // Add text element to canvas
          const newElement = {
            id: `text-${Date.now()}`,
            type: 'text' as const,
            position: {
              x: 100,
              y: 100
            },
            size: {
              width: 200,
              height: 100
            },
            content: text,
            style: style
          };
          console.log('Adding text element:', newElement);
        }} />;
      case 'shape':
        return <EnhancedShapesPanel onAddShape={(shapeType, style) => {
          // Add shape element to canvas
          const newElement = {
            id: `shape-${Date.now()}`,
            type: 'shape' as const,
            position: {
              x: 150,
              y: 150
            },
            size: {
              width: 100,
              height: 100
            },
            style: {
              fillColor: style.fillColor,
              borderColor: style.borderColor,
              borderWidth: style.borderWidth,
              ...style
            },
            data: {
              shapeType
            }
          };
          console.log('Adding shape element:', newElement);
        }} />;
      case 'smart-element':
        return <EnhancedSmartElementsPanel selectedElementId={props.selectedElementId} onAddSmartElement={(elementId, config) => {
          // Add smart element to canvas
          const newElement = {
            id: `smart-${elementId}-${Date.now()}`,
            type: 'smart-element' as const,
            position: {
              x: 200,
              y: 200
            },
            size: config.size,
            style: {
              ...config.style,
              fillColor: `hsl(var(--primary))`,
              borderColor: `hsl(var(--border))`,
              borderRadius: `${config.style.borderRadius}px`
            },
            content: config.content.title,
            data: {
              elementType: elementId,
              config: config,
              interactive: config.behavior.interactive,
              animated: config.behavior.animated
            }
          };
          console.log('Adding smart element:', newElement);
        }} />;
      default:
        return <div className="flex items-center justify-center h-32 text-gray-500 text-sm font-arabic">
            اختر أداة لعرض خياراتها
          </div>;
    }
  };

  // Don't render if no tool is selected
  if (!selectedTool || !panelId) {
    return null;
  }
  return <Card className="backdrop-blur-md shadow-sm border border-gray-300 rounded-[20px] h-full bg-[#ffffff]/95 my-[0px] py-0">
      <CardHeader className="pb- my-[5px]">
        <CardTitle className="text-sm font-arabic font-medium">
          لوحة الأدوات
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)] overflow-y-auto px-[5px]">
        {renderPanelContent()}
      </CardContent>
    </Card>;
};