import React from 'react';
import type { CanvasSmartElement } from '@/types/canvas-elements';

interface SmartElementRendererProps {
  element: CanvasSmartElement;
  onUpdate?: (data: any) => void;
}

export const SmartElementRenderer: React.FC<SmartElementRendererProps> = ({ 
  element, 
  onUpdate 
}) => {
  const handleDataUpdate = (newData: any) => {
    if (onUpdate) {
      onUpdate(newData);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-white border border-[hsl(var(--border))] rounded-lg p-4">
      <div className="text-center">
        <div className="text-2xl mb-2">
          {element.smartType === 'thinking_board' && '🧠'}
          {element.smartType === 'kanban' && '📋'}
          {element.smartType === 'voting' && '🗳️'}
          {element.smartType === 'brainstorming' && '💡'}
          {element.smartType === 'timeline' && '📅'}
          {element.smartType === 'decisions_matrix' && '📊'}
          {element.smartType === 'gantt' && '📈'}
          {element.smartType === 'interactive_sheet' && '📑'}
          {element.smartType === 'mind_map' && '🗺️'}
          {element.smartType === 'project_card' && '📁'}
          {element.smartType === 'finance_card' && '💰'}
          {element.smartType === 'csr_card' && '🌱'}
          {element.smartType === 'crm_card' && '👥'}
          {element.smartType === 'root_connector' && '🔗'}
        </div>
        <p className="text-sm text-[hsl(var(--ink))] font-medium mb-1">
          {element.smartType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </p>
        <p className="text-xs text-[hsl(var(--ink-60))]">
          العنصر الذكي جاهز للاستخدام
        </p>
      </div>
    </div>
  );
};
