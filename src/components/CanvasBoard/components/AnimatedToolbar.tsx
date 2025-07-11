
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MousePointer, 
  Pen, 
  Square, 
  Circle, 
  Type, 
  Hand, 
  StickyNote,
  Zap
} from 'lucide-react';

interface AnimatedToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  recentTools: string[];
}

export const AnimatedToolbar: React.FC<AnimatedToolbarProps> = ({
  selectedTool,
  onToolSelect,
  recentTools
}) => {
  const tools = [
    { id: 'select', name: 'تحديد', icon: MousePointer, shortcut: 'V' },
    { id: 'pen', name: 'قلم', icon: Pen, shortcut: 'P' },
    { id: 'smart-pen', name: 'قلم ذكي', icon: Zap, shortcut: 'Shift+P' },
    { id: 'rectangle', name: 'مستطيل', icon: Square, shortcut: 'R' },
    { id: 'circle', name: 'دائرة', icon: Circle, shortcut: 'C' },
    { id: 'text', name: 'نص', icon: Type, shortcut: 'T' },
    { id: 'sticky', name: 'ملصق', icon: StickyNote, shortcut: 'S' },
    { id: 'hand', name: 'يد', icon: Hand, shortcut: 'H' }
  ];

  return (
    <Card className="bg-background/95 backdrop-blur-lg shadow-xl border animate-fade-in">
      <div className="flex items-center gap-1 p-2">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          const isSelected = selectedTool === tool.id;
          const isRecent = recentTools.includes(tool.id);
          
          return (
            <React.Fragment key={tool.id}>
              <div className="relative group">
                <Button
                  variant={isSelected ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onToolSelect(tool.id)}
                  className={`w-10 h-10 p-0 transition-all duration-200 ${
                    isSelected 
                      ? 'shadow-md scale-105' 
                      : 'hover:scale-105 hover:bg-muted'
                  }`}
                  title={`${tool.name} (${tool.shortcut})`}
                >
                  <Icon className={`w-4 h-4 ${
                    isSelected ? 'text-primary-foreground' : 'text-foreground'
                  }`} />
                  {isRecent && !isSelected && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-1 -right-1 w-2 h-2 p-0 rounded-full animate-pulse"
                    />
                  )}
                </Button>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {tool.name} ({tool.shortcut})
                </div>
              </div>
              
              {/* Separator after smart-pen */}
              {tool.id === 'smart-pen' && (
                <Separator orientation="vertical" className="h-6 mx-1" />
              )}
              
              {/* Separator after text */}
              {tool.id === 'text' && (
                <Separator orientation="vertical" className="h-6 mx-1" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </Card>
  );
};
