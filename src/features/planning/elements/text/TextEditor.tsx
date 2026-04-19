import React from 'react';
import type { CanvasElement } from '@/types/canvas';
import TextElementHost from './TextElementHost';

interface TextEditorProps {
  element: CanvasElement;
  onUpdate: (content: string) => void;
  onClose: () => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({ element, onUpdate, onClose, onDoubleClick }) => {
  return (
    <TextElementHost
      element={element}
      isEditing
      onUpdate={onUpdate}
      onClose={onClose}
      onDoubleClick={onDoubleClick}
    />
  );
};

export default TextEditor;
