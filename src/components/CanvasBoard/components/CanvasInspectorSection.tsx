import React from 'react';
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
    <div className="fixed top-24 left-6 z-40">
      {/* سيتم إضافة لوحة الخصائص هنا لاحقاً */}
    </div>
  );
};