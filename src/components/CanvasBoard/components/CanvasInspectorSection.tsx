import React from 'react';
import { Inspector } from './';
import { CanvasElement } from '../types';

interface CanvasInspectorSectionProps {
  selectedElementId: string | null;
  elements: CanvasElement[];
  onUpdateElement: (elementId: string, updates: any) => void;
  onDeleteElement: (elementId: string) => void;
}

export const CanvasInspectorSection: React.FC<CanvasInspectorSectionProps> = ({
  selectedElementId,
  elements,
  onUpdateElement,
  onDeleteElement
}) => {
  return (
    <Inspector 
      selectedElementId={selectedElementId}
      elements={elements}
      onUpdateElement={onUpdateElement}
      onDeleteElement={onDeleteElement}
    />
  );
};