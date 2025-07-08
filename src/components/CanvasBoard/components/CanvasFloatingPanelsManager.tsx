
import React from 'react';
import { 
  EnhancedSmartAssistantPanel,
  EnhancedLayersPanel,
  EnhancedElementCustomizationPanel,
  EnhancedCollaborationPanel,
  EnhancedToolCustomizationPanel
} from '../panels/enhanced';

interface FloatingPanelsManagerProps {
  selectedTool: string;
  selectedElementId: string | null;
  elements: any[];
  layers: any[];
  selectedLayerId: string | null;
  onLayerUpdate: (layers: any[]) => void;
  onLayerSelect: (layerId: string) => void;
  onUpdateElement: (elementId: string, updates: any) => void;
}

const CanvasFloatingPanelsManager: React.FC<FloatingPanelsManagerProps> = ({
  selectedTool,
  selectedElementId,
  elements,
  layers,
  selectedLayerId,
  onLayerUpdate,
  onLayerSelect,
  onUpdateElement
}) => {
  const selectedElement = selectedElementId 
    ? elements.find(el => el.id === selectedElementId)
    : null;

  return (
    <>
      {/* Smart Assistant Panel - Bottom Right (25%) */}
      <div className="fixed bottom-4 right-4 z-40">
        <EnhancedSmartAssistantPanel
          onSmartFinish={() => console.log('Smart finish')}
          onSmartReview={() => console.log('Smart review')}
          onSmartCleanup={() => console.log('Smart cleanup')}
          onSendMessage={(message) => console.log('Send message:', message)}
        />
      </div>

      {/* Layers Panel - Above Smart Assistant (50%) */}
      <div className="fixed bottom-80 right-4 z-40">
        <EnhancedLayersPanel
          layers={layers}
          selectedLayerId={selectedLayerId}
          onLayerUpdate={onLayerUpdate}
          onLayerSelect={onLayerSelect}
        />
      </div>

      {/* Element Customization Panel - Top Right (25%) */}
      <div className="fixed top-20 right-4 z-40">
        <EnhancedElementCustomizationPanel
          selectedElement={selectedElement}
          onUpdateElement={onUpdateElement}
        />
      </div>

      {/* Collaboration Panel - Top Left (25%) */}
      <div className="fixed top-20 left-4 z-40">
        <EnhancedCollaborationPanel
          onInviteUser={() => console.log('Invite user')}
          onSendMessage={(message) => console.log('Send chat message:', message)}
          onToggleAudio={() => console.log('Toggle audio')}
          onToggleVideo={() => console.log('Toggle video')}
        />
      </div>

      {/* Tool Customization Panel - Left Side (75%) */}
      <div className="fixed top-40 left-4 z-40" style={{ height: '75%' }}>
        <EnhancedToolCustomizationPanel
          selectedTool={selectedTool}
          onToolSettingChange={(setting, value) => console.log('Tool setting:', setting, value)}
        />
      </div>
    </>
  );
};

export default CanvasFloatingPanelsManager;
