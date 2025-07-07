import React from 'react';
import AIAssistantPanel from '../AIAssistantPanel';

export const CanvasAISection: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 z-40 w-80">
      <AIAssistantPanel />
    </div>
  );
};