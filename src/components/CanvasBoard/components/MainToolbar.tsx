import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CANVAS_TOOLS } from '../constants';

interface MainToolbarProps {
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
  toolPanels?: {
    panels: any;
    openPanel: (tool: string, position?: { x: number; y: number }) => void;
    closePanel: (tool: string) => void;
    togglePanel: (tool: string, position?: { x: number; y: number }) => void;
    closeAllPanels: () => void;
    getPanelConfig: (tool: string) => any;
  };
}

const MainToolbar: React.FC<MainToolbarProps> = ({ selectedTool, onToolSelect, toolPanels }) => {
  
  // Tools that have panels
  const toolsWithPanels = ['smart-pen', 'zoom', 'grid', 'layers', 'text', 'shape', 'smart-element'];
  
  const handleToolClick = (toolId: string, event: React.MouseEvent) => {
    if (toolsWithPanels.includes(toolId) && toolPanels) {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      const position = {
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      };
      toolPanels.togglePanel(toolId, position);
    }
    onToolSelect(toolId);
  };
  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50">
      <Card className="bg-white/95 backdrop-blur-md shadow-sm border border-gray-300 rounded-[40px]">
        <CardContent className="flex items-center gap-2 p-3">
          {CANVAS_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Button
                key={tool.id}
                variant={selectedTool === tool.id ? "default" : "ghost"}
                size="sm"
                className={`h-10 px-3 rounded-full ${selectedTool === tool.id ? 'bg-black text-white' : 'text-gray-600 hover:bg-soabra-new-secondary-4'}`}
                onClick={(e) => handleToolClick(tool.id, e)}
                title={tool.label}
              >
                <Icon className="w-4 h-4" />
              </Button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default MainToolbar;