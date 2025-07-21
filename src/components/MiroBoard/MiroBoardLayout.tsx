import React, { useState } from 'react';
import { MiroTopToolbar } from './components/MiroTopToolbar';
import { MiroFloatingToolbar } from './components/MiroFloatingToolbar';
import { MiroCanvas } from './components/MiroCanvas';
import { MiroPropertiesPanel } from './components/MiroPropertiesPanel';
import { MiroCollaborators } from './components/MiroCollaborators';
import { MiroMinimap } from './components/MiroMinimap';
import { MiroZoomControls } from './components/MiroZoomControls';

interface MiroBoardLayoutProps {
  projectId?: string;
  userId?: string;
}

const MiroBoardLayout: React.FC<MiroBoardLayoutProps> = ({ 
  projectId = 'default', 
  userId = 'user1' 
}) => {
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });

  return (
    <div className="relative w-full h-full bg-white overflow-hidden">
      {/* Top Navigation Bar */}
      <MiroTopToolbar 
        projectId={projectId}
        onShare={() => {}}
        onExport={() => {}}
        onSettings={() => {}}
      />

      {/* Main Canvas Area */}
      <div className="relative w-full h-[calc(100%-60px)] mt-[60px]">
        <MiroCanvas
          selectedTool={selectedTool}
          selectedElement={selectedElement}
          zoom={zoom}
          canvasPosition={canvasPosition}
          onElementSelect={setSelectedElement}
          onToolSelect={setSelectedTool}
          onCanvasPositionChange={setCanvasPosition}
          onPropertiesPanelToggle={() => setShowPropertiesPanel(!showPropertiesPanel)}
        />

        {/* Floating Left Toolbar */}
        <MiroFloatingToolbar
          selectedTool={selectedTool}
          onToolSelect={setSelectedTool}
        />

        {/* Properties Panel */}
        {showPropertiesPanel && selectedElement && (
          <MiroPropertiesPanel
            selectedElement={selectedElement}
            onClose={() => setShowPropertiesPanel(false)}
          />
        )}

        {/* Collaborators Panel */}
        <MiroCollaborators 
          projectId={projectId}
          users={[
            { id: '1', name: 'أحمد محمد', avatar: '', isOnline: true },
            { id: '2', name: 'سارة أحمد', avatar: '', isOnline: true },
            { id: '3', name: 'محمد علي', avatar: '', isOnline: false }
          ]}
        />

        {/* Minimap */}
        <MiroMinimap
          zoom={zoom}
          canvasPosition={canvasPosition}
          onNavigate={setCanvasPosition}
        />

        {/* Zoom Controls */}
        <MiroZoomControls
          zoom={zoom}
          onZoomChange={setZoom}
          onFitToScreen={() => {
            setZoom(1);
            setCanvasPosition({ x: 0, y: 0 });
          }}
        />
      </div>
    </div>
  );
};

export default MiroBoardLayout;