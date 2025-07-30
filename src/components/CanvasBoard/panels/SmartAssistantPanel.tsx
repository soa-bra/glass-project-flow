import React from 'react';
import { SmartElementsPanel } from '../ToolPanels/SmartElementsPanel';

interface SmartAssistantPanelProps {
  onAddSmartElement?: (elementConfig: any) => void;
}

export const SmartAssistantPanel: React.FC<SmartAssistantPanelProps> = ({
  onAddSmartElement = () => {}
}) => {
  return (
    <div className="p-4">
      <SmartElementsPanel onAddSmartElement={onAddSmartElement} />
    </div>
  );
};