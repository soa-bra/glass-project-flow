
import React from 'react';
import { CanvasLayer, CanvasElement } from '../types/index';
import { SmartAssistantPanel } from './panels/SmartAssistantPanel';
import { LayersPanel } from './panels/LayersPanel';
import { AppearancePanel } from './panels/AppearancePanel';
import { CollaborationPanel } from './panels/CollaborationPanel';
import { ToolsPanel } from './panels/ToolsPanel';

interface FloatingPanelsProps {
  showSmartAssistant: boolean;
  showLayers: boolean;
  showAppearance: boolean;
  showCollaboration: boolean;
  showTools: boolean;
  onTogglePanel: (panel: string) => void;
  layers: CanvasLayer[];
  selectedLayerId: string;
  onLayerSelect: (layerId: string) => void;
  selectedElementId: string | null;
  elements: CanvasElement[];
}

export const FloatingPanels: React.FC<FloatingPanelsProps> = ({
  showSmartAssistant,
  showLayers,
  showAppearance,
  showCollaboration,
  showTools,
  onTogglePanel,
  layers,
  selectedLayerId,
  onLayerSelect,
  selectedElementId,
  elements
}) => {
  return (
    <>
      {/* Smart Assistant Panel */}
      {showSmartAssistant && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 animate-slide-in-right">
          <SmartAssistantPanel
            onClose={() => onTogglePanel('smartAssistant')}
            selectedElementId={selectedElementId}
            elements={elements}
          />
        </div>
      )}

      {/* Layers Panel */}
      {showLayers && (
        <div className="fixed right-4 top-20 z-50 animate-slide-in-right">
          <LayersPanel
            layers={layers}
            selectedLayerId={selectedLayerId}
            onLayerSelect={onLayerSelect}
            onClose={() => onTogglePanel('layers')}
          />
        </div>
      )}

      {/* Appearance Panel */}
      {showAppearance && (
        <div className="fixed right-4 bottom-20 z-50 animate-slide-in-right">
          <AppearancePanel
            selectedElementId={selectedElementId}
            onClose={() => onTogglePanel('appearance')}
          />
        </div>
      )}

      {/* Collaboration Panel */}
      {showCollaboration && (
        <div className="fixed left-4 top-20 z-50 animate-slide-in-right">
          <CollaborationPanel
            onClose={() => onTogglePanel('collaboration')}
          />
        </div>
      )}

      {/* Tools Panel */}
      {showTools && (
        <div className="fixed left-4 bottom-20 z-50 animate-slide-in-right">
          <ToolsPanel
            onClose={() => onTogglePanel('tools')}
          />
        </div>
      )}
    </>
  );
};
