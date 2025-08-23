import React from 'react';
import { CanvasElement } from '../../types/canvas';

interface ElementsLayerProps {
  elements: CanvasElement[];
}

export const ElementsLayer: React.FC<ElementsLayerProps> = ({ elements }) => {
  return <div className="absolute inset-0">العناصر</div>;
};