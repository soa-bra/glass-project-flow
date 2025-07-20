import React, { useState } from 'react';
import { SmartAssistantPanel, LayersPanel } from '@/components/panels';
import { useCanvasState } from '@/hooks/useCanvasState';

/**
 * Demo component showcasing the SmartAssistantPanel and LayersPanel
 * This demonstrates how to integrate the panels with the existing canvas system
 */
export const PanelsDemo: React.FC = () => {
  const {
    elements,
    layers,
    selectedElementIds,
    selectedLayerIds,
    getCanvasState,
    setLayers,
    setSelectedLayerIds
  } = useCanvasState();

  // Handle AI actions from the Smart Assistant
  const handleAIAction = (action: string, data?: any) => {
    console.log('AI Action:', action, data);
    
    // Example: Handle AI completion results
    if (action === 'complete' && data?.elementsAdded) {
      // In real implementation, this would add elements to canvas
      console.log(`AI added ${data.elementsAdded} elements`);
    }
    
    if (action === 'clean' && data?.elementsRemoved) {
      // In real implementation, this would remove elements from canvas
      console.log(`AI removed ${data.elementsRemoved} elements`);
    }
  };

  // Handle layer updates from the Layers Panel
  const handleLayersUpdate = (updatedLayers: any[]) => {
    setLayers(updatedLayers);
    console.log('Layers updated:', updatedLayers);
  };

  // Handle layer selection changes
  const handleLayerSelect = (layerIds: string[]) => {
    setSelectedLayerIds(layerIds);
    console.log('Selected layers:', layerIds);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Main Canvas Area (placeholder) */}
      <div className="flex-1 p-4 border-r">
        <div className="w-full h-full bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <h3 className="text-lg font-medium mb-2">Canvas Area</h3>
            <p className="text-sm">
              Canvas with {elements.length} elements
              <br />
              Selected: {selectedElementIds.length} elements, {selectedLayerIds.length} layers
            </p>
          </div>
        </div>
      </div>

      {/* Right Panels */}
      <div className="w-96 border-l bg-background/50 flex flex-col">
        {/* Smart Assistant Panel - Top */}
        <div className="h-96 border-b">
          <SmartAssistantPanel
            canvasState={getCanvasState()}
            onAIAction={handleAIAction}
            className="w-full h-full"
          />
        </div>

        {/* Layers Panel - Bottom */}
        <div className="flex-1">
          <LayersPanel
            layers={layers}
            selectedLayerIds={selectedLayerIds}
            onLayersUpdate={handleLayersUpdate}
            onLayerSelect={handleLayerSelect}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default PanelsDemo;