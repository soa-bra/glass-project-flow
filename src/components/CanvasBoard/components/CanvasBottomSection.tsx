import React from 'react';
import { MainToolbar } from './';

interface CanvasBottomSectionProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

export const CanvasBottomSection: React.FC<CanvasBottomSectionProps> = ({
  selectedTool,
  onToolSelect
}) => {
  return (
    <MainToolbar
      selectedTool={selectedTool}
      onToolSelect={onToolSelect}
    />
  );
};