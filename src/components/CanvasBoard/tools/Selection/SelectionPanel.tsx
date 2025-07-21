import React from 'react';
import { Separator } from '@/components/ui/separator';
import { CanvasElement } from '../../types';

console.log('Loading SelectionPanel...');

import {
  SelectionPanelBasicActions,
  SelectionPanelGroupActions,
  SelectionPanelLockActions,
  SelectionPanelTransformActions,
  SelectionPanelAlignmentActions
} from './components';

console.log('SelectionPanel imports loaded successfully');

interface SelectionPanelProps {
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

export const SelectionPanel: React.FC<SelectionPanelProps> = ({
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
  const hasSelection = selectedElements.length > 0;
  const multipleSelection = selectedElements.length > 1;

  // التعامل مع القفل المحسن
  const handleLock = () => {
    selectedElements.forEach(element => {
      onUpdateElement(element.id, { locked: true });
    });
    onLock();
  };

  const handleUnlock = () => {
    selectedElements.forEach(element => {
      onUpdateElement(element.id, { locked: false });
    });
    onUnlock();
  };

  return (
    <div className="space-y-4">
      {/* الإجراءات الأساسية */}
      <SelectionPanelBasicActions
        hasSelection={hasSelection}
        onCopy={onCopy}
        onCut={onCut}
        onPaste={onPaste}
        onDelete={onDelete}
      />

      <Separator className="bg-[#d1e1ea]" />

      {/* التجميع */}
      <SelectionPanelGroupActions
        hasSelection={hasSelection}
        multipleSelection={multipleSelection}
        onGroup={onGroup}
        onUngroup={onUngroup}
      />

      <Separator className="bg-[#d1e1ea]" />

      {/* القفل والحماية */}
      <SelectionPanelLockActions
        hasSelection={hasSelection}
        onLock={handleLock}
        onUnlock={handleUnlock}
      />

      <Separator className="bg-[#d1e1ea]" />

      {/* التحويل */}
      <SelectionPanelTransformActions
        hasSelection={hasSelection}
        onRotate={onRotate}
        onFlipHorizontal={onFlipHorizontal}
        onFlipVertical={onFlipVertical}
      />

      <Separator className="bg-[#d1e1ea]" />

      {/* المحاذاة */}
      <SelectionPanelAlignmentActions
        hasSelection={hasSelection}
        multipleSelection={multipleSelection}
        onAlign={onAlign}
      />
    </div>
  );
};