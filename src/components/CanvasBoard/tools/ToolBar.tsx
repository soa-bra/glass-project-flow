import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  MousePointer2, 
  Pen, 
  Type, 
  Square, 
  Hand, 
  ZoomIn, 
  Upload, 
  MessageCircle,
  Sparkles,
  Users,
  Layers,
  Palette,
  Settings
} from 'lucide-react';
import { PanelType } from '@/types/canvas';

interface ToolBarProps {
  activeTool: string;
  onToolChange: (toolId: string) => void;
  onPanelToggle: (panelType: PanelType) => void;
}

interface Tool {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  shortcut?: string;
  type: 'tool' | 'panel';
  panelType?: PanelType;
}

const tools: Tool[] = [
  { id: 'selection', name: 'أداة التحديد', icon: MousePointer2, shortcut: 'V', type: 'tool' },
  { id: 'smart-pen', name: 'القلم الذكي', icon: Pen, shortcut: 'P', type: 'tool' },
  { id: 'text', name: 'النص', icon: Type, shortcut: 'T', type: 'tool' },
  { id: 'shapes', name: 'الأشكال', icon: Square, shortcut: 'R', type: 'tool' },
  { id: 'hand', name: 'أداة التحريك', icon: Hand, shortcut: 'H', type: 'tool' },
  { id: 'zoom', name: 'التكبير', icon: ZoomIn, shortcut: 'Z', type: 'tool' },
  { id: 'upload', name: 'رفع الملفات', icon: Upload, type: 'tool' },
  { id: 'comment', name: 'التعليقات', icon: MessageCircle, shortcut: 'C', type: 'tool' },
  { id: 'smart-elements', name: 'العناصر الذكية', icon: Sparkles, type: 'tool' },
];

const panels: Tool[] = [
  { id: 'layers', name: 'الطبقات', icon: Layers, type: 'panel', panelType: 'layers' },
  { id: 'appearance', name: 'المظهر', icon: Palette, type: 'panel', panelType: 'appearance' },
  { id: 'collaboration', name: 'التعاون', icon: Users, type: 'panel', panelType: 'collaboration' },
  { id: 'tool-customization', name: 'تخصيص الأدوات', icon: Settings, type: 'panel', panelType: 'tool-customization' },
];

export const ToolBar: React.FC<ToolBarProps> = ({
  activeTool,
  onToolChange,
  onPanelToggle
}) => {
  const handleItemClick = (item: Tool) => {
    if (item.type === 'tool') {
      onToolChange(item.id);
    } else if (item.type === 'panel' && item.panelType) {
      onPanelToggle(item.panelType);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full py-4">
        {/* Main Tools */}
        <div className="flex flex-col gap-2 px-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            
            return (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleItemClick(tool)}
                    className="w-12 h-12 p-0"
                  >
                    <Icon className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div className="text-center">
                    <div>{tool.name}</div>
                    {tool.shortcut && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {tool.shortcut}
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Separator */}
        <div className="border-t border-border my-4 mx-2" />

        {/* Panel Toggles */}
        <div className="flex flex-col gap-2 px-2 mt-auto">
          {panels.map((panel) => {
            const Icon = panel.icon;
            
            return (
              <Tooltip key={panel.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleItemClick(panel)}
                    className="w-12 h-12 p-0"
                  >
                    <Icon className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div>{panel.name}</div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};