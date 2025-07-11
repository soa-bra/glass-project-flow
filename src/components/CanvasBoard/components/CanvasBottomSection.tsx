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
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <MainToolbar
        selectedTool={selectedTool}
        onToolSelect={onToolSelect}
      />
    </div>
  );
};