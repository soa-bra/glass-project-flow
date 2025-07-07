import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SelectToolProps, ZoomToolProps, SmartElementToolProps, TextToolProps, ShapeToolProps } from './ToolProps';
import { GridTool } from '../tools/GridTool';
import { LayerTool } from '../tools/LayerTool';
import { SelectionTool } from '../tools/SelectionTool';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  elements: string[];
}

interface ToolPropsBarProps {
  selectedTool: string;
  selectedElementId: string | null;
  selectedElements: string[];
  zoom: number;
  selectedSmartElement: string;
  showGrid: boolean;
  snapEnabled: boolean;
  gridSize: number;
  layers: Layer[];
  selectedLayerId: string | null;
  onZoomChange: (zoom: number) => void;
  onSmartElementSelect: (elementId: string) => void;
  onGridToggle: () => void;
  onSnapToggle: () => void;
  onGridSizeChange: (size: number) => void;
  onAlignToGrid: () => void;
  onLayerUpdate: (layers: Layer[]) => void;
  onLayerSelect: (layerId: string) => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onGroup: () => void;
  onUngroup: () => void;
  onLock: () => void;
  onUnlock: () => void;
}
const ToolPropsBar: React.FC<ToolPropsBarProps> = ({
  selectedTool,
  selectedElementId,
  selectedElements,
  zoom,
  selectedSmartElement,
  showGrid,
  snapEnabled,
  gridSize,
  layers,
  selectedLayerId,
  onZoomChange,
  onSmartElementSelect,
  onGridToggle,
  onSnapToggle,
  onGridSizeChange,
  onAlignToGrid,
  onLayerUpdate,
  onLayerSelect,
  onCopy,
  onCut,
  onPaste,
  onDelete,
  onGroup,
  onUngroup,
  onLock,
  onUnlock
}) => {
  const renderToolProps = () => {
    switch (selectedTool) {
      case 'select':
        return (
          <SelectionTool
            selectedTool={selectedTool}
            selectedElements={selectedElements}
            onCopy={onCopy}
            onCut={onCut}
            onPaste={onPaste}
            onDelete={onDelete}
            onGroup={onGroup}
            onUngroup={onUngroup}
            onLock={onLock}
            onUnlock={onUnlock}
          />
        );
      case 'zoom':
        return <ZoomToolProps zoom={zoom} onZoomChange={onZoomChange} />;
      case 'smart-element':
        return <SmartElementToolProps selectedSmartElement={selectedSmartElement} onSmartElementSelect={onSmartElementSelect} />;
      case 'text':
      case 'sticky':
        return <TextToolProps />;
      case 'shape':
        return <ShapeToolProps />;
      case 'grid':
        return (
          <GridTool
            selectedTool={selectedTool}
            showGrid={showGrid}
            snapEnabled={snapEnabled}
            gridSize={gridSize}
            onGridToggle={onGridToggle}
            onSnapToggle={onSnapToggle}
            onGridSizeChange={onGridSizeChange}
            onAlignToGrid={onAlignToGrid}
          />
        );
      case 'layers':
        return (
          <LayerTool
            selectedTool={selectedTool}
            layers={layers}
            onLayerUpdate={onLayerUpdate}
            onLayerSelect={onLayerSelect}
            selectedLayerId={selectedLayerId}
          />
        );
      default:
        return null;
    }
  };
  return <div className="fixed bottom-24 left-4 z-40 w-80">
      <Card className="bg-white/95 backdrop-blur-md shadow-sm border border-gray-300 rounded-[40px]">
        <CardHeader className="pb-3">
          
        </CardHeader>
        <CardContent>
          {renderToolProps()}
        </CardContent>
      </Card>
    </div>;
};
export default ToolPropsBar;