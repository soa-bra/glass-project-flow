import React, { memo } from 'react';
import { MainToolbar } from './';

interface CanvasBottomSectionProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

export const CanvasBottomSection: React.FC<CanvasBottomSectionProps> = memo(({
  selectedTool,
  onToolSelect
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <MainToolbar
        selectedTool={selectedTool}
        onToolSelect={onToolSelect}
      />
    </div>
  );
});