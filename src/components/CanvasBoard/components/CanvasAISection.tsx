import React from 'react';
import { SmartAssistantPanel } from '../SmartAssistant';

interface CanvasAISectionProps {
  elements?: any[];
  onAddSmartElement?: (type: string, config: any) => void;
  projectContext?: {
    projectId?: string;
    projectName?: string;
    teamMembers?: string[];
  };
}

export const CanvasAISection: React.FC<CanvasAISectionProps> = ({
  elements,
  onAddSmartElement,
  projectContext
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-40 w-96">
      <SmartAssistantPanel 
        elements={elements}
        onAddSmartElement={onAddSmartElement}
        projectContext={projectContext}
      />
    </div>
  );
};