// Legacy SmartElementsPanel - Replaced with new Smart Elements System
// This file is kept for backward compatibility
// Use src/components/smart-elements/smart-elements-panel.tsx instead

import React from 'react';
import { SmartElementsPanel } from './src/components/smart-elements/smart-elements-panel';

interface LegacySmartElementsPanelProps {
  selectedElementId?: string | null;
  selectedElementType?: string | null;
  selectedElementSettings?: Record<string, any>;
  onElementSelect?: (elementType: string) => void;
  onSettingsChange?: (elementId: string, settings: Record<string, any>) => void;
}

export default function LegacySmartElementsPanel(props: LegacySmartElementsPanelProps = {}) {
  const handleElementSelect = (elementType: string) => {
    console.log('Smart element selected:', elementType);
    props.onElementSelect?.(elementType);
  };

  const handleSettingsChange = (elementId: string, settings: Record<string, any>) => {
    console.log('Smart element settings changed:', { elementId, settings });
    props.onSettingsChange?.(elementId, settings);
  };

  return (
    <SmartElementsPanel
      selectedElementId={props.selectedElementId}
      selectedElementType={props.selectedElementType}
      selectedElementSettings={props.selectedElementSettings || {}}
      onElementSelect={handleElementSelect}
      onSettingsChange={handleSettingsChange}
    />
  );
}
