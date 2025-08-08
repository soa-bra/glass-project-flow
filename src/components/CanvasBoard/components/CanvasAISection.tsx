import React from 'react';
// import { SmartAssistantPanel } from '../SmartAssistant'; // Removed

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
      <div className="p-4 bg-white rounded-lg shadow-lg">
        <p className="text-sm text-gray-600">المساعد الذكي قريباً</p>
      </div>
    </div>
  );
};