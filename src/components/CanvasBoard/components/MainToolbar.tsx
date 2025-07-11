
import React, { memo } from 'react';
import { CanvasBottomSection } from './CanvasBottomSection';

interface MainToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

export const MainToolbar: React.FC<MainToolbarProps> = memo(({
  selectedTool,
  onToolSelect
}) => {
  return (
    <CanvasBottomSection
      selectedTool={selectedTool}
      onToolSelect={onToolSelect}
    />
  );
});
