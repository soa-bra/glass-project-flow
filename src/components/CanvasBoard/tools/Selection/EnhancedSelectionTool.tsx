import React, { useCallback } from 'react';
import { CanvasElement } from '../../types';
import { SelectionPanel } from './SelectionPanel';
import { useSelectionKeyboardShortcuts } from './hooks/useSelectionKeyboardShortcuts';

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
  onUpdateElement,
  onMoveElement,
  onRotateElement,
  onFlipElement,
  onAlignElements,
  onSelectAll,
  onDeselect,
  onUndo,
  onRedo
}) => {
  const isActive = selectedTool === 'select';
  const hasSelection = selectedElements.length > 0;

  // Movement functions for keyboard shortcuts
  const moveElementsByDirection = useCallback((direction: 'up' | 'down' | 'left' | 'right', distance: number) => {
    selectedElements.forEach(element => {
      onMoveElement(element.id, direction, distance);
    });
  }, [selectedElements, onMoveElement]);

  // Keyboard shortcut actions
  const keyboardActions = {
    copy: onCopy,
    cut: onCut,
    paste: onPaste,
    delete: onDelete,
    undo: onUndo,
    redo: onRedo,
    selectAll: onSelectAll,
    group: onGroup,
    ungroup: onUngroup,
    deselect: onDeselect,
    moveUp: () => moveElementsByDirection('up', 1),
    moveDown: () => moveElementsByDirection('down', 1),
    moveLeft: () => moveElementsByDirection('left', 1),
    moveRight: () => moveElementsByDirection('right', 1),
    fastMoveUp: () => moveElementsByDirection('up', 10),
    fastMoveDown: () => moveElementsByDirection('down', 10),
    fastMoveLeft: () => moveElementsByDirection('left', 10),
    fastMoveRight: () => moveElementsByDirection('right', 10),
  };

  // Enable keyboard shortcuts
  useSelectionKeyboardShortcuts({
    isActive,
    hasSelection,
    actions: keyboardActions
  });

  // Handle rotate action
  const handleRotate = useCallback(() => {
    selectedElements.forEach(element => {
      onRotateElement(element.id, 90); // Rotate 90 degrees
    });
    onRotate();
  }, [selectedElements, onRotateElement, onRotate]);

  // Handle flip actions
  const handleFlipHorizontal = useCallback(() => {
    selectedElements.forEach(element => {
      onFlipElement(element.id, 'horizontal');
    });
    onFlipHorizontal();
  }, [selectedElements, onFlipElement, onFlipHorizontal]);

  const handleFlipVertical = useCallback(() => {
    selectedElements.forEach(element => {
      onFlipElement(element.id, 'vertical');
    });
    onFlipVertical();
  }, [selectedElements, onFlipElement, onFlipVertical]);

  // Handle align action
  const handleAlign = useCallback((direction: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    const elementIds = selectedElements.map(el => el.id);
    onAlignElements(elementIds, direction);
    onAlign(direction);
  }, [selectedElements, onAlignElements, onAlign]);

  // Don't render if selection tool is not active
  if (!isActive) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Selection Panel */}
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
    </div>
  );
};