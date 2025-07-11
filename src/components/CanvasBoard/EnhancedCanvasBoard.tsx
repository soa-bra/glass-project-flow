import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import FabricCanvasComponent from './core/FabricCanvasComponent';
import SmartAssistantPanel from './panels/SmartAssistantPanel';
import LayersPanel from './panels/LayersPanel';
import AppearancePanel from './panels/AppearancePanel';
import CollaborationPanel from './panels/CollaborationPanel';
import EnhancedToolsPanel from './panels/EnhancedToolsPanel';
import { 
  Bot, 
  Layers, 
  Palette, 
  Users, 
  Wrench,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useEnhancedCanvasState } from './hooks/useEnhancedCanvasState';
import { 
  CanvasLayer, 
  CanvasTheme, 
  SmartSuggestion, 
  AssistantAction,
  CollaborationUser,
  CanvasComment 
} from './types/index';
import { CANVAS_THEMES } from './constants/index';

interface EnhancedCanvasBoardProps {
  projectId?: string;
  userId?: string;
}

const EnhancedCanvasBoard: React.FC<EnhancedCanvasBoardProps> = ({
  projectId = 'default',
  userId = 'user-1'
}) => {
  // Canvas state from enhanced hook
  const canvasState = useEnhancedCanvasState(projectId, userId);

  // Panel visibility states
  const [panels, setPanels] = useState({
    smartAssistant: false,
    layers: true,
    appearance: false,
    collaboration: false,
    tools: true
  });

  // Enhanced state for new features
  const [layers, setLayers] = useState<CanvasLayer[]>([
    {
      id: 'layer-1',
      name: 'الطبقة الأساسية',
      visible: true,
      locked: false,
      opacity: 1,
      elements: [],
      order: 1
    }
  ]);

  const [activeLayerId, setActiveLayerId] = useState('layer-1');
  const [currentTheme, setCurrentTheme] = useState<CanvasTheme>(CANVAS_THEMES[0]);
  
  // Smart Assistant state
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([]);
  const [assistantHistory, setAssistantHistory] = useState<AssistantAction[]>([]);
  
  // Collaboration state
  const [collaborationUsers, setCollaborationUsers] = useState<CollaborationUser[]>([
    {
      id: userId,
      name: 'أنت',
      isOnline: true,
      role: 'admin'
    }
  ]);
  const [comments, setComments] = useState<CanvasComment[]>([]);
  
  // Tools state
  const [recentTools, setRecentTools] = useState<string[]>(['select', 'smart-pen']);
  const [favoriteTools, setFavoriteTools] = useState<string[]>(['select', 'text', 'shape']);

  const togglePanel = (panelName: keyof typeof panels) => {
    setPanels(prev => ({
      ...prev,
      [panelName]: !prev[panelName]
    }));
  };

  // Panel handlers
  const handleLayerCreate = (name: string) => {
    const newLayer: CanvasLayer = {
      id: `layer-${Date.now()}`,
      name,
      visible: true,
      locked: false,
      opacity: 1,
      elements: [],
      order: layers.length + 1
    };
    setLayers([...layers, newLayer]);
  };

  const handleSendMessage = async (message: string) => {
    // Simulate AI response
    const action: AssistantAction = {
      id: `action-${Date.now()}`,
      type: 'message',
      description: `تم إرسال: ${message}`,
      timestamp: new Date(),
      success: true
    };
    setAssistantHistory(prev => [action, ...prev]);

    // Generate mock suggestions
    setTimeout(() => {
      const suggestion: SmartSuggestion = {
        id: `suggestion-${Date.now()}`,
        type: 'layout',
        title: 'تحسين التخطيط',
        description: 'يمكنني تنظيم العناصر بشكل أفضل',
        confidence: 0.85,
        action: () => console.log('Applying layout suggestion')
      };
      setSmartSuggestions(prev => [suggestion, ...prev]);
    }, 1000);
  };

  const handleToolSelect = (toolId: string) => {
    canvasState.setSelectedTool(toolId);
    
    // Update recent tools
    setRecentTools(prev => {
      const filtered = prev.filter(id => id !== toolId);
      return [toolId, ...filtered].slice(0, 5);
    });
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <div className="w-16 bg-card border-r flex flex-col items-center py-4 gap-2">
        <Button
          variant={panels.tools ? "default" : "ghost"}
          size="sm"
          onClick={() => togglePanel('tools')}
          className="w-10 h-10 p-0"
        >
          <Wrench className="w-4 h-4" />
        </Button>
        
        <Button
          variant={panels.layers ? "default" : "ghost"}
          size="sm"
          onClick={() => togglePanel('layers')}
          className="w-10 h-10 p-0"
        >
          <Layers className="w-4 h-4" />
        </Button>
        
        <Button
          variant={panels.appearance ? "default" : "ghost"}
          size="sm"
          onClick={() => togglePanel('appearance')}
          className="w-10 h-10 p-0"
        >
          <Palette className="w-4 h-4" />
        </Button>
        
        <Button
          variant={panels.collaboration ? "default" : "ghost"}
          size="sm"
          onClick={() => togglePanel('collaboration')}
          className="w-10 h-10 p-0"
        >
          <Users className="w-4 h-4" />
        </Button>
        
        <Button
          variant={panels.smartAssistant ? "default" : "ghost"}
          size="sm"
          onClick={() => togglePanel('smartAssistant')}
          className="w-10 h-10 p-0"
        >
          <Bot className="w-4 h-4" />
        </Button>

        <Separator className="my-2" />

        <div className="flex flex-col gap-2 text-xs text-muted-foreground">
          <div className="text-center">
            <span>{canvasState.zoom}%</span>
          </div>
          <div className="text-center">
            <Badge variant="secondary" className="text-xs">
              {canvasState.selectedElementIds.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative">
        <FabricCanvasComponent
          selectedTool={canvasState.selectedTool}
          selectedElementIds={canvasState.selectedElementIds}
          onElementSelect={(elementId) => {
            canvasState.setSelectedElementIds([elementId]);
          }}
          onElementsChange={(elements) => {
            canvasState.setElements(elements);
          }}
          zoom={canvasState.zoom}
          canvasPosition={canvasState.canvasPosition}
          showGrid={canvasState.showGrid}
          snapEnabled={canvasState.snapEnabled}
          theme={currentTheme}
        />

        {/* Floating Panels */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Tools Panel */}
          {panels.tools && (
            <div className="absolute left-20 top-4 pointer-events-auto">
              <EnhancedToolsPanel
                isVisible={panels.tools}
                onToggle={() => togglePanel('tools')}
                selectedTool={canvasState.selectedTool}
                onToolSelect={handleToolSelect}
                recentTools={recentTools}
                favoriteTools={favoriteTools}
                onToggleFavorite={(toolId) => {
                  setFavoriteTools(prev => 
                    prev.includes(toolId) 
                      ? prev.filter(id => id !== toolId)
                      : [...prev, toolId]
                  );
                }}
              />
            </div>
          )}

          {/* Layers Panel */}
          {panels.layers && (
            <div className="absolute right-4 top-4 pointer-events-auto">
              <LayersPanel
                isVisible={panels.layers}
                onToggle={() => togglePanel('layers')}
                layers={layers}
                activeLayerId={activeLayerId}
                onLayerSelect={setActiveLayerId}
                onLayerCreate={handleLayerCreate}
                onLayerDelete={(layerId) => {
                  setLayers(prev => prev.filter(l => l.id !== layerId));
                }}
                onLayerRename={(layerId, name) => {
                  setLayers(prev => prev.map(l => 
                    l.id === layerId ? { ...l, name } : l
                  ));
                }}
                onLayerToggleVisibility={(layerId) => {
                  setLayers(prev => prev.map(l => 
                    l.id === layerId ? { ...l, visible: !l.visible } : l
                  ));
                }}
                onLayerToggleLock={(layerId) => {
                  setLayers(prev => prev.map(l => 
                    l.id === layerId ? { ...l, locked: !l.locked } : l
                  ));
                }}
                onLayerReorder={(layerId, direction) => {
                  // Implement layer reordering logic
                }}
                onLayerDuplicate={(layerId) => {
                  const layer = layers.find(l => l.id === layerId);
                  if (layer) {
                    const newLayer = {
                      ...layer,
                      id: `layer-${Date.now()}`,
                      name: `${layer.name} - نسخة`,
                      order: layers.length + 1
                    };
                    setLayers(prev => [...prev, newLayer]);
                  }
                }}
                onLayerOpacityChange={(layerId, opacity) => {
                  setLayers(prev => prev.map(l => 
                    l.id === layerId ? { ...l, opacity } : l
                  ));
                }}
              />
            </div>
          )}

          {/* Appearance Panel */}
          {panels.appearance && (
            <div className="absolute right-4 bottom-4 pointer-events-auto">
              <AppearancePanel
                isVisible={panels.appearance}
                onToggle={() => togglePanel('appearance')}
                selectedElementIds={canvasState.selectedElementIds}
                theme={currentTheme}
                onThemeChange={setCurrentTheme}
                onElementStyleChange={(elementIds, style) => {
                  // Apply style changes to selected elements
                  console.log('Applying style:', style, 'to elements:', elementIds);
                }}
              />
            </div>
          )}

          {/* Collaboration Panel */}
          {panels.collaboration && (
            <div className="absolute left-20 bottom-4 pointer-events-auto">
              <CollaborationPanel
                isVisible={panels.collaboration}
                onToggle={() => togglePanel('collaboration')}
                users={collaborationUsers}
                comments={comments}
                currentUserId={userId}
                onInviteUser={(email) => {
                  console.log('Inviting user:', email);
                }}
                onAddComment={(content, position) => {
                  const comment: CanvasComment = {
                    id: `comment-${Date.now()}`,
                    content,
                    author: collaborationUsers.find(u => u.id === userId)!,
                    position: position || { x: 100, y: 100 },
                    timestamp: new Date(),
                    resolved: false
                  };
                  setComments(prev => [comment, ...prev]);
                }}
                onResolveComment={(commentId) => {
                  setComments(prev => prev.map(c => 
                    c.id === commentId ? { ...c, resolved: true } : c
                  ));
                }}
                onReplyToComment={(commentId, content) => {
                  // Implement reply logic
                }}
                onShareCanvas={() => {
                  console.log('Sharing canvas');
                }}
              />
            </div>
          )}

          {/* Smart Assistant Panel */}
          {panels.smartAssistant && (
            <div className="absolute right-20 top-1/2 transform -translate-y-1/2 pointer-events-auto">
              <SmartAssistantPanel
                isVisible={panels.smartAssistant}
                onToggle={() => togglePanel('smartAssistant')}
                suggestions={smartSuggestions}
                history={assistantHistory}
                onApplySuggestion={(suggestion) => {
                  suggestion.action();
                  setSmartSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
                }}
                onSendMessage={handleSendMessage}
                isLoading={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedCanvasBoard;