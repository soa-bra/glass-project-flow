
import React from 'react';
import NewMainToolbar from './NewMainToolbar';

interface CanvasBottomSectionProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

export const CanvasBottomSection: React.FC<CanvasBottomSectionProps> = ({
  selectedTool,
  onToolSelect
}) => {
  return (
    <NewMainToolbar
      selectedTool={selectedTool}
      onToolSelect={onToolSelect}
    />
  );
};
