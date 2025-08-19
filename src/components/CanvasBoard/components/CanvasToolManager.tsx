import React from 'react';
import { StickyNoteTool, TextTool, RepeatTool, FlowchartTool, AnnotationTool } from '../tools';
import { 
  BrainstormEnginePanel, 
  SmartProjectGenerator, 
  AICommandConsole, 
  MindMapPanel, 
  SmartConnectionsPanel 
} from '../ai-tools';
import { LiveChangeFeed } from '../collaboration';
import { AdvancedCanvasSettings } from '../settings';

interface CanvasToolManagerProps {
  selectedTool: string;
  selectedElementId: string | null;
  projectId: string;
  userId: string;
  elements: any[];
  settings: any;
  onToolAction: (action: string, data: any) => void;
}

export const CanvasToolManager: React.FC<CanvasToolManagerProps> = ({
  selectedTool,
  selectedElementId,
  projectId,
  userId,
  elements,
  settings,
  onToolAction
}) => {
  return (
    <div className="flex flex-col space-y-4">
      {/* أدوات الرسم الأساسية */}
      <StickyNoteTool 
        selectedTool={selectedTool}
        onAddSticky={(data) => onToolAction('add-sticky', data)}
      />
      
      <TextTool 
        selectedTool={selectedTool}
        elementId={selectedElementId}
        onTextUpdate={(elementId, text, style) => onToolAction('text-updated', { elementId, text, style })}
      />
      
      <FlowchartTool 
        selectedTool={selectedTool}
        onAddFlowchartElement={(data) => onToolAction('add-flowchart', data)}
      />
      
      <AnnotationTool 
        selectedTool={selectedTool}
        selectedElementId={selectedElementId}
        onAddAnnotation={(data) => onToolAction('add-annotation', data)}
      />
      
      <RepeatTool 
        selectedTool={selectedTool}
        elementId={selectedElementId}
        onRepeat={(data) => onToolAction('repeat-element', data)}
      />

      {/* أدوات الذكاء الاصطناعي */}
      <BrainstormEnginePanel 
        selectedTool={selectedTool}
        onResult={(ideas) => onToolAction('brainstorm-result', { ideas })}
      />
      
      <SmartProjectGenerator 
        projectId={projectId}
        layers={elements}
        visible={selectedTool === 'smart-project'}
        onGenerated={(preview) => onToolAction('project-generated', { preview })}
      />
      
      <AICommandConsole 
        selectedTool={selectedTool}
        onCommand={(prompt, result) => onToolAction('ai-command', { prompt, result })}
      />
      
      <MindMapPanel 
        selectedTool={selectedTool}
        projectId={projectId}
        onGenerated={(data) => onToolAction('mindmap-generated', data)}
      />
      
      <SmartConnectionsPanel 
        selectedTool={selectedTool}
        elements={elements}
        onCreateConnections={(data) => onToolAction('connections-created', data)}
      />

      {/* أدوات التعاون */}
      <LiveChangeFeed 
        selectedTool={selectedTool}
        projectId={projectId}
        currentUserId={userId}
      />

      {/* الإعدادات */}
      <AdvancedCanvasSettings 
        selectedTool={selectedTool}
        settings={settings}
        onSettingsChange={(data) => onToolAction('settings-changed', data)}
      />
    </div>
  );
};