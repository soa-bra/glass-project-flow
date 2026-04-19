import React from 'react';
import type { CanvasElement } from '@/types/canvas';
import TextElementHost from './TextElementHost';

interface TextRendererProps {
  element: CanvasElement;
  width: number;
  height: number;
  onDoubleClick?: (e: React.MouseEvent) => void;
}

export const TextRenderer: React.FC<TextRendererProps> = ({ element, onDoubleClick }) => {
  return (
    <TextElementHost
      element={element}
      isEditing={false}
      onUpdate={() => {}}
      onClose={() => {}}
      onDoubleClick={onDoubleClick}
    />
  );
};

export default TextRenderer;
