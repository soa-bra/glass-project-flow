import React from 'react';
import { CanvasElement } from '../types';
import { Layer } from './CanvasPanelTypes';
import { EnhancedLayer } from './panels/EnhancedLayersPanel';
import SmartAssistantPanel from '../panels/SmartAssistantPanel';
import { EnhancedLayersPanel } from './panels/EnhancedLayersPanel';
import { ElementStylePanel } from './panels/ElementStylePanel';
import { EnhancedCollaborationPanel } from './panels/EnhancedCollaborationPanel';
import { AppearancePanel } from './panels/AppearancePanel';
import { ToolPanel } from './ToolPanel';
interface FloatingPanelLayoutProps {
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
  // Additional handlers for ToolPanel
  onUngroup?: () => void;
  onLock?: () => void;
  onUnlock?: () => void;
  onRotate?: () => void;
  onFlipHorizontal?: () => void;
  onFlipVertical?: () => void;
  onAlign?: (direction: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
}
// Utility function to convert Layer to EnhancedLayer
const convertToEnhancedLayers = (layers: Layer[]): EnhancedLayer[] => {
  return layers.map(layer => ({
    ...layer,
    type: 'layer' as const,
    color: '#3b82f6',
    depth: 0
  }));
};

export const FloatingPanelLayout: React.FC<FloatingPanelLayoutProps> = ({
  selectedTool,
  selectedElements,
  elements,
  selectedElementId,
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
  onAlignToGrid,
  onUngroup,
  onLock,
  onUnlock,
  onRotate,
  onFlipHorizontal,
  onFlipVertical,
  onAlign
}) => {
  return <>
      {/* منطقة اللوحات الأولى - First Panels Area */}
      <div className="fixed top-0 bottom-8 right-5 w-60 z-30 pointer-events-auto flex flex-col my-[45px] ">
        {/* Enhanced Collaboration Panel - 30% */}
        <div className="h-[30%] mb-2.5" style={{
        backdropFilter: 'blur(8px)'
      }}>
          <EnhancedCollaborationPanel />
        </div>
        
        {/* Enhanced Layers Panel - 35% */}
        <div className="h-[35%] mb-2.5" style={{
        backdropFilter: 'blur(8px)'
      }}>
          <EnhancedLayersPanel 
            layers={convertToEnhancedLayers(layers)} 
            selectedLayerId={selectedLayerId} 
            elements={elements}
            onLayerUpdate={(enhancedLayers) => {
              const basicLayers = enhancedLayers.map(({type, color, depth, ...layer}) => layer);
              onLayerReorder(basicLayers);
            }} 
            onLayerSelect={onLayerSelect}
          />
        </div>
        
        {/* Smart Assistant Panel - 35% */}
        <div className="h-[35%]" style={{
        backdropFilter: 'blur(8px)'
      }}>
          <SmartAssistantPanel elements={elements} />
        </div>
      </div>

      {/* منطقة اللوحات الثانية - Second Panels Area */}
      <div className="fixed top-0 bottom-12 left-5 w-60 z-30 pointer-events-auto flex flex-col my-8">
        {/* Appearance Panel - 25% */}
        <div className="h-[25%] mb-2.5" style={{
        backdropFilter: 'blur(8px)'
      }}>
          <AppearancePanel />
        </div>

        {/* Element Style Panel - 25% */}
        <div className="h-[25%] mb-2.5" style={{
        backdropFilter: 'blur(8px)'
      }}>
          <ElementStylePanel selectedElement={selectedElementId ? elements.find(el => el.id === selectedElementId) : null} onUpdateElement={onUpdateElement} />
        </div>
        
        {/* Tool Panel - 50% of remaining space */}
        <div className="h-[50%]" style={{
        backdropFilter: 'blur(8px)'
      }}>
          <ToolPanel selectedTool={selectedTool} selectedElements={selectedElements} elements={elements} selectedElementId={selectedElementId} zoom={zoom} canvasPosition={canvasPosition} panSpeed={panSpeed} lineWidth={lineWidth} lineStyle={lineStyle} selectedPenMode={selectedPenMode} showGrid={showGrid} snapEnabled={snapEnabled} gridSize={gridSize} gridShape={gridShape} layers={layers} selectedLayerId={selectedLayerId} onUpdateElement={onUpdateElement} onCopy={onCopy} onCut={onCut} onPaste={onPaste} onDelete={onDelete} onGroup={onGroup} onUngroup={onUngroup || (() => {})} onLock={onLock || (() => {})} onUnlock={onUnlock || (() => {})} onRotate={onRotate || (() => {})} onFlipHorizontal={onFlipHorizontal || (() => {})} onFlipVertical={onFlipVertical || (() => {})} onAlign={onAlign || (() => {})} onZoomChange={onZoomChange} onPositionChange={onPositionChange} onFitToScreen={onFitToScreen} onResetView={onResetView} onPanSpeedChange={onPanSpeedChange} onLineWidthChange={onLineWidthChange} onLineStyleChange={onLineStyleChange} onPenModeSelect={onPenModeSelect} onFileUpload={onFileUpload} onLayerReorder={onLayerReorder} onLayerSelect={onLayerSelect} onGridToggle={onGridToggle} onSnapToggle={onSnapToggle} onGridSizeChange={onGridSizeChange} onGridShapeChange={onGridShapeChange} onAlignToGrid={onAlignToGrid} />
        </div>
      </div>
    </>;
};