
import React, { memo } from 'react';
import { AnimatedToolbar } from './AnimatedToolbar';

interface MainToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

export const MainToolbar: React.FC<MainToolbarProps> = memo(({
  selectedTool,
  onToolSelect
}) => {
  return (
    <AnimatedToolbar
      selectedTool={selectedTool}
      onToolSelect={onToolSelect}
      recentTools={[]} // This will be managed by the parent component
    />
  );
});
