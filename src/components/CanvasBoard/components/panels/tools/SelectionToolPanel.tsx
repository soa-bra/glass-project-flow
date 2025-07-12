import React from 'react';
import { CanvasElement } from '../../../types';
import { SelectionPanel } from '../../../tools/Selection/SelectionPanel';

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
}

export const SelectionToolPanel: React.FC<SelectionToolPanelProps> = (props) => {
  return <SelectionPanel {...props} />;
};