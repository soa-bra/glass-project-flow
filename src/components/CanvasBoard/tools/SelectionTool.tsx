import React, { useState, useEffect } from 'react';
import { CanvasElement } from '../types';
import { SelectionPanel } from './Selection/SelectionPanel';
import { SelectionKeyboardShortcuts } from './Selection/SelectionKeyboardShortcuts';
import { 
  useSelectionKeyboardShortcuts
} from './Selection/hooks/useSelectionKeyboardShortcuts';

interface SelectionToolProps {
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
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onMoveElement: (elementId: string, direction: 'up' | 'down' | 'left' | 'right', distance: number) => void;
  onRotateElement: (elementId: string, angle: number) => void;
  onFlipElement: (elementId: string, direction: 'horizontal' | 'vertical') => void;
  onAlignElements: (elementIds: string[], direction: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onUpdateElement: (elementId: string, updates: any) => void;
}

export const SelectionTool: React.FC<SelectionToolProps> = ({ 
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
  onSelectAll,
  onDeselectAll,
  onMoveElement,
  onRotateElement,
  onFlipElement,
  onAlignElements,
  onUpdateElement
}) => {
  const isActive = selectedTool === 'select';
  const hasSelection = selectedElements.length > 0;
  const selectedElementIds = selectedElements.map(el => el.id);

  // إعداد اختصارات الكيبورد
  const keyboardActions = {
    copy: onCopy,
    cut: onCut,
    paste: onPaste,
    delete: onDelete,
    undo: () => {}, // سيتم ربطها لاحقاً
    redo: () => {}, // سيتم ربطها لاحقاً
    selectAll: onSelectAll,
    group: onGroup,
    ungroup: onUngroup,
    deselect: onDeselectAll,
    moveUp: () => {
      selectedElementIds.forEach(id => onMoveElement(id, 'up', 1));
    },
    moveDown: () => {
      selectedElementIds.forEach(id => onMoveElement(id, 'down', 1));
    },
    moveLeft: () => {
      selectedElementIds.forEach(id => onMoveElement(id, 'left', 1));
    },
    moveRight: () => {
      selectedElementIds.forEach(id => onMoveElement(id, 'right', 1));
    },
    fastMoveUp: () => {
      selectedElementIds.forEach(id => onMoveElement(id, 'up', 10));
    },
    fastMoveDown: () => {
      selectedElementIds.forEach(id => onMoveElement(id, 'down', 10));
    },
    fastMoveLeft: () => {
      selectedElementIds.forEach(id => onMoveElement(id, 'left', 10));
    },
    fastMoveRight: () => {
      selectedElementIds.forEach(id => onMoveElement(id, 'right', 10));
    }
  };

  // تفعيل اختصارات الكيبورد
  useSelectionKeyboardShortcuts({
    isActive,
    hasSelection,
    actions: keyboardActions
  });

  // معالجات الأحداث المحسنة
  const handleRotate = () => {
    selectedElementIds.forEach(id => onRotateElement(id, 90));
  };

  const handleFlipHorizontal = () => {
    selectedElementIds.forEach(id => onFlipElement(id, 'horizontal'));
  };

  const handleFlipVertical = () => {
    selectedElementIds.forEach(id => onFlipElement(id, 'vertical'));
  };

  const handleAlign = (direction: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (selectedElementIds.length > 1) {
      onAlignElements(selectedElementIds, direction);
    }
  };

  if (!isActive) return null;

  return (
    <div className="space-y-4">
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
        onRotate={handleRotate}
        onFlipHorizontal={handleFlipHorizontal}
        onFlipVertical={handleFlipVertical}
        onAlign={handleAlign}
        onUpdateElement={onUpdateElement}
      />

      <SelectionKeyboardShortcuts />
    </div>
  );
};