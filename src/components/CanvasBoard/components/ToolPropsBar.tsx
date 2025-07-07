import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ZoomToolProps, SmartElementToolProps, TextToolProps, ShapeToolProps } from './ToolProps';
import { GridTool } from '../tools/GridTool';
import { LayerTool } from '../tools/LayerTool';
import { SelectionTool } from '../tools/SelectionTool';
import { HandTool, FileTool, UploadTool, CommentTool, ConvertToProjectTool, RepeatTool } from '../tools';

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
  // New handlers for additional tools
  onPan?: () => void;
  onResetView?: () => void;
  onSave?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onFileUpload?: (file: File) => void;
  onAddComment?: (text: string, position: { x: number; y: number }) => void;
  onDeleteComment?: (commentId: string) => void;
  onConvertToProject?: (projectData: any) => void;
  onRepeat?: (elementId: string) => void;
  comments?: any[];
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
  onUnlock,
  // New handlers
  onPan = () => console.log('Pan activated'),
  onResetView = () => console.log('Reset view'),
  onSave = () => console.log('Save'),
  onExport = () => console.log('Export'),
  onImport = () => console.log('Import'),
  onFileUpload = () => console.log('File uploaded'),
  onAddComment = () => console.log('Comment added'),
  onDeleteComment = () => console.log('Comment deleted'),
  onConvertToProject = () => console.log('Convert to project'),
  onRepeat = () => console.log('Repeat element'),
  comments = []
}) => {
  const getToolTitle = () => {
    switch (selectedTool) {
      case 'select': return 'أداة التحديد';
      case 'zoom': return 'أداة التكبير والتصغير';
      case 'smart-element': return 'العناصر الذكية';
      case 'text':
      case 'sticky': return 'أدوات النص';
      case 'shape': return 'أدوات الأشكال';
      case 'grid': return 'إعدادات الشبكة والمحاذاة';
      case 'layers': return 'إدارة الطبقات';
      case 'hand': return 'أداة اليد';
      case 'file': return 'إدارة الملفات';
      case 'upload': return 'رفع الملفات';
      case 'comment': return 'التعليقات';
      case 'repeat': return 'أداة التكرار';
      case 'convert-project': return 'تحويل لمشروع';
      default: return 'أدوات الكانفس';
    }
  };
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
      case 'hand':
        return (
          <HandTool
            selectedTool={selectedTool}
            onPan={onPan}
            onResetView={onResetView}
          />
        );
      case 'file':
        return (
          <FileTool
            selectedTool={selectedTool}
            onSave={onSave}
            onExport={onExport}
            onImport={onImport}
          />
        );
      case 'upload':
        return (
          <UploadTool
            selectedTool={selectedTool}
            onFileUpload={onFileUpload}
          />
        );
      case 'comment':
        return (
          <CommentTool
            selectedTool={selectedTool}
            comments={comments}
            onAddComment={onAddComment}
            onDeleteComment={onDeleteComment}
          />
        );
      case 'repeat':
        return (
          <RepeatTool
            selectedTool={selectedTool}
            elementId={selectedElementId}
            onRepeat={(options) => onRepeat && onRepeat(options.elementId)}
          />
        );
      case 'convert-project':
        return (
          <ConvertToProjectTool
            selectedTool={selectedTool}
            onConvert={onConvertToProject}
          />
        );
      default:
        return null;
    }
  };
  return <div className="fixed bottom-4 left-4 z-40 w-80">
      <Card className="bg-white/95 backdrop-blur-md shadow-sm border border-gray-300 rounded-[40px]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-arabic font-medium">{getToolTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderToolProps()}
        </CardContent>
      </Card>
    </div>;
};
export default ToolPropsBar;