
import React from 'react';
import { CanvasElement } from '../../types';
import { SelectionPanel } from './SelectionPanel';

interface EnhancedSelectionToolProps {
  selectedTool: string;
  selectedElements: CanvasElement[];
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
  onUpdateElement: (elementId: string, updates: any) => void;
  onMoveElement: (elementId: string, direction: 'up' | 'down' | 'left' | 'right', distance: number) => void;
  onRotateElement: (elementId: string, angle: number) => void;
  onFlipElement: (elementId: string, direction: 'horizontal' | 'vertical') => void;
  onAlignElements: (elementIds: string[], direction: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onSelectAll: () => void;
  onDeselect: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

export const EnhancedSelectionTool: React.FC<EnhancedSelectionToolProps> = ({
  selectedTool,
  selectedElements,
  onCopy,
  onCut,
  onPaste,
  onDelete,
  onGroup,
  onUngroup,
  onLock,
  onUnlock,
  onRotate,
  onFlipHorizontal,
  onFlipVertical,
  onAlign,
  onUpdateElement
}) => {
  const isActive = selectedTool === 'select';

  if (!isActive) return null;

  return (
    <SelectionPanel
      selectedElements={selectedElements}
      onCopy={onCopy}
      onCut={onCut}
      onPaste={onPaste}
      onDelete={onDelete}
      onGroup={onGroup}
      onUngroup={onUngroup}
      onLock={onLock}
      onUnlock={onUnlock}
      onRotate={onRotate}
      onFlipHorizontal={onFlipHorizontal}
      onFlipVertical={onFlipVertical}
      onAlign={onAlign}
      onUpdateElement={onUpdateElement}
    />
  );
};
