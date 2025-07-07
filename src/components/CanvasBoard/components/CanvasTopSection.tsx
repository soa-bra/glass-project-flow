import React from 'react';
import NewTopToolbar from './NewTopToolbar';

interface CanvasTopSectionProps {
  historyIndex: number;
  history: any[];
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onNew: () => void;
  onOpen: () => void;
  handleCopy: () => void;
  showGrid: boolean;
  onGridToggle: () => void;
  snapEnabled: boolean;
  onSnapToggle: () => void;
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  gridShape: string;
  onGridShapeChange: (shape: string) => void;
  onSmartProjectGenerate: () => void;
}

export const CanvasTopSection: React.FC<CanvasTopSectionProps> = ({
  historyIndex,
  history,
  onUndo,
  onRedo,
  onSave,
  onNew,
  onOpen,
  handleCopy,
  showGrid,
  onGridToggle,
  snapEnabled,
  onSnapToggle,
  gridSize,
  onGridSizeChange,
  gridShape,
  onGridShapeChange,
  onSmartProjectGenerate
}) => {
  return (
    <NewTopToolbar
      canUndo={historyIndex > 0}
      canRedo={historyIndex < history.length - 1}
      onUndo={onUndo}
      onRedo={onRedo}
      onSave={onSave}
      onNew={onNew}
      onOpen={onOpen}
      onCopy={handleCopy}
      showGrid={showGrid}
      onGridToggle={onGridToggle}
      snapEnabled={snapEnabled}
      onSnapToggle={onSnapToggle}
      gridSize={gridSize}
      onGridSizeChange={onGridSizeChange}
      gridShape={gridShape}
      onGridShapeChange={onGridShapeChange}
      onSmartProjectGenerate={onSmartProjectGenerate}
    />
  );
};