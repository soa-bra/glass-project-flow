import React from 'react';
import { Button } from '@/components/ui/button';
import { useToolsStore } from '../../../store/tools.store';
import { ToolType } from '../../../types/tools.types';
import { 
  MousePointer, 
  PenTool, 
  ZoomIn, 
  Hand, 
  Upload, 
  MessageCircle, 
  Type, 
  Square, 
  Grid3X3,
  Frame
} from 'lucide-react';

const toolIcons: Record<ToolType, React.ComponentType<any>> = {
  selection: MousePointer,
  smart_pen: PenTool,
  zoom: ZoomIn,
  pan: Hand,
  file_uploader: Upload,
  comment: MessageCircle,
  text: Type,
  shapes: Square,
  smart_element: Grid3X3,
  frame: Frame
};

export const Toolbox: React.FC = () => {
  const { activeTool, tools, setActiveTool } = useToolsStore();

  const handleToolSelect = (toolType: ToolType) => {
    setActiveTool(toolType);
  };

  return (
    <div className="flex flex-col w-12 bg-card border-l border-border p-1 gap-1">
      {Object.entries(tools).map(([toolType, tool]) => {
        const IconComponent = toolIcons[toolType as ToolType];
        const isActive = activeTool === toolType;
        
        return (
          <Button
            key={toolType}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            className="h-10 w-10 p-0"
            onClick={() => handleToolSelect(toolType as ToolType)}
            title={`${tool.name} (${tool.shortcut})`}
          >
            <IconComponent className="h-4 w-4" />
          </Button>
        );
      })}
    </div>
  );
};