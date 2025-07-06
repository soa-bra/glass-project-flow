import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SelectToolProps, ZoomToolProps, SmartElementToolProps, TextToolProps, ShapeToolProps } from './ToolProps';
interface ToolPropsBarProps {
  selectedTool: string;
  selectedElementId: string | null;
  zoom: number;
  selectedSmartElement: string;
  onZoomChange: (zoom: number) => void;
  onSmartElementSelect: (elementId: string) => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
}
const ToolPropsBar: React.FC<ToolPropsBarProps> = ({
  selectedTool,
  selectedElementId,
  zoom,
  selectedSmartElement,
  onZoomChange,
  onSmartElementSelect,
  onCopy,
  onCut,
  onPaste,
  onDelete
}) => {
  const renderToolProps = () => {
    switch (selectedTool) {
      case 'select':
        return <SelectToolProps selectedElementId={selectedElementId} onCopy={onCopy} onCut={onCut} onPaste={onPaste} onDelete={onDelete} />;
      case 'zoom':
        return <ZoomToolProps zoom={zoom} onZoomChange={onZoomChange} />;
      case 'smart-element':
        return <SmartElementToolProps selectedSmartElement={selectedSmartElement} onSmartElementSelect={onSmartElementSelect} />;
      case 'text':
      case 'sticky':
        return <TextToolProps />;
      case 'shape':
        return <ShapeToolProps />;
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