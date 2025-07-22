/**
 * @fileoverview Panel toggle controls component
 * @author AI Assistant
 * @version 1.0.0
 */

import React from 'react';

interface PanelToggleControlsProps {
  onTogglePanel: (panelName: string) => void;
}

const panelControls = [
  { id: 'smartAssistant', icon: '🤖', title: 'تبديل المساعد الذكي' },
  { id: 'tools', icon: '🔧', title: 'تبديل الأدوات' },
  { id: 'collaboration', icon: '👥', title: 'تبديل التعاون' },
  { id: 'layers', icon: '📋', title: 'تبديل الطبقات' },
  { id: 'appearance', icon: '🎨', title: 'تبديل المظهر' }
];

export const PanelToggleControls: React.FC<PanelToggleControlsProps> = ({
  onTogglePanel
}) => {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2">
      {panelControls.map(control => (
        <button
          key={control.id}
          onClick={() => onTogglePanel(control.id)}
          className="p-2 bg-primary text-white rounded shadow hover:bg-primary/90 transition-colors"
          title={control.title}
        >
          {control.icon}
        </button>
      ))}
    </div>
  );
};