import React from 'react';
import { MainToolbar } from './';

interface CanvasBottomSectionProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  toolPanels?: any;
}

export const CanvasBottomSection: React.FC<CanvasBottomSectionProps> = ({
  selectedTool,
  onToolSelect,
  toolPanels
}) => {
  return (
    <MainToolbar
      selectedTool={selectedTool}
      onToolSelect={onToolSelect}
      toolPanels={toolPanels}
    />
  );
};