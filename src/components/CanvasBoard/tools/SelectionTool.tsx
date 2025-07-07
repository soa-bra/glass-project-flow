import React, { useState } from 'react';
import {
  SelectionInfo,
  SelectionModeToggle,
  SelectionActions,
  SelectionGroupActions,
  SelectionKeyboardShortcuts,
  SelectionTips
} from './Selection';

interface SelectionToolProps {
  selectedTool: string;
  selectedElements: string[];
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onGroup: () => void;
  onUngroup: () => void;
  onLock: () => void;
  onUnlock: () => void;
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
  onUnlock
}) => {
  const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>('single');

  if (selectedTool !== 'select') return null;

  const hasSelection = selectedElements.length > 0;
  const multipleSelection = selectedElements.length > 1;

  return (
    <div className="space-y-4">
      <SelectionInfo selectedElementsCount={selectedElements.length} />
      
      <SelectionModeToggle 
        selectionMode={selectionMode}
        onSelectionModeChange={setSelectionMode}
      />

      <SelectionActions
        hasSelection={hasSelection}
        onCopy={onCopy}
        onCut={onCut}
        onPaste={onPaste}
        onDelete={onDelete}
      />

      <SelectionGroupActions
        hasSelection={hasSelection}
        multipleSelection={multipleSelection}
        onGroup={onGroup}
        onUngroup={onUngroup}
        onLock={onLock}
        onUnlock={onUnlock}
      />

      <SelectionKeyboardShortcuts />

      <SelectionTips />
    </div>
  );
};