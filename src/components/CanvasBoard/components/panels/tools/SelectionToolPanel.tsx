import React from 'react';
import { CanvasElement } from '../../../types';
import { EnhancedSelectionTool } from '../../../tools/Selection/EnhancedSelectionTool';

interface SelectionToolPanelProps {
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
  // Additional handlers for enhanced functionality
  onMoveElement?: (elementId: string, direction: 'up' | 'down' | 'left' | 'right', distance: number) => void;
  onRotateElement?: (elementId: string, angle: number) => void;
  onFlipElement?: (elementId: string, direction: 'horizontal' | 'vertical') => void;
  onAlignElements?: (elementIds: string[], direction: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onSelectAll?: () => void;
  onDeselect?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const SelectionToolPanel: React.FC<SelectionToolPanelProps> = (props) => {
  return (
    <EnhancedSelectionTool
      selectedTool="select"
      selectedElements={props.selectedElements}
      onCopy={props.onCopy}
      onCut={props.onCut}
      onPaste={props.onPaste}
      onDelete={props.onDelete}
      onGroup={props.onGroup}
      onUngroup={props.onUngroup}
      onLock={props.onLock}
      onUnlock={props.onUnlock}
      onRotate={props.onRotate}
      onFlipHorizontal={props.onFlipHorizontal}
      onFlipVertical={props.onFlipVertical}
      onAlign={props.onAlign}
      onUpdateElement={props.onUpdateElement}
      onMoveElement={props.onMoveElement || (() => {})}
      onRotateElement={props.onRotateElement || (() => {})}
      onFlipElement={props.onFlipElement || (() => {})}
      onAlignElements={props.onAlignElements || (() => {})}
      onSelectAll={props.onSelectAll || (() => {})}
      onDeselect={props.onDeselect || (() => {})}
      onUndo={props.onUndo || (() => {})}
      onRedo={props.onRedo || (() => {})}
    />
  );
};