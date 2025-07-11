
import React, { memo, useCallback, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  MousePointer2, 
  Hand, 
  Square, 
  Circle, 
  Type, 
  Pen, 
  StickyNote,
  Image,
  Upload,
  Brain,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  recentTools?: string[];
}

const tools = [
  { id: 'select', icon: MousePointer2, label: 'تحديد', shortcut: 'V', category: 'basic' },
  { id: 'hand', icon: Hand, label: 'يد', shortcut: 'H', category: 'basic' },
  { id: 'rectangle', icon: Square, label: 'مستطيل', shortcut: 'R', category: 'shapes' },
  { id: 'circle', icon: Circle, label: 'دائرة', shortcut: 'C', category: 'shapes' },
  { id: 'text', icon: Type, label: 'نص', shortcut: 'T', category: 'content' },
  { id: 'pen', icon: Pen, label: 'قلم', shortcut: 'P', category: 'drawing' },
  { id: 'sticky', icon: StickyNote, label: 'ملصق', shortcut: 'S', category: 'content' },
  { id: 'image', icon: Image, label: 'صورة', shortcut: 'I', category: 'media' },
  { id: 'upload', icon: Upload, label: 'رفع', shortcut: 'U', category: 'media' },
  { id: 'smart', icon: Brain, label: 'ذكي', shortcut: 'AI', category: 'smart' },
  { id: 'brainstorm', icon: Lightbulb, label: 'عصف ذهني', shortcut: 'B', category: 'smart' }
];

export const AnimatedToolbar: React.FC<AnimatedToolbarProps> = memo(({
  selectedTool,
  onToolSelect,
  recentTools = []
}) => {
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const handleToolSelect = useCallback((toolId: string) => {
    onToolSelect(toolId);
  }, [onToolSelect]);

  const handleToolHover = useCallback((toolId: string | null) => {
    setHoveredTool(toolId);
    if (toolId) {
      const timer = setTimeout(() => setShowTooltip(toolId), 500);
      return () => clearTimeout(timer);
    } else {
      setShowTooltip(null);
    }
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'shapes': return 'bg-green-100 text-green-800';
      case 'content': return 'bg-purple-100 text-purple-800';
      case 'drawing': return 'bg-orange-100 text-orange-800';
      case 'media': return 'bg-pink-100 text-pink-800';
      case 'smart': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isRecentTool = (toolId: string) => recentTools.includes(toolId);

  return (
    <div className="relative">
      <div className="flex items-center gap-1 p-3 bg-background/95 backdrop-blur-lg rounded-xl border shadow-lg animate-slide-in-right">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          const isSelected = selectedTool === tool.id;
          const isHovered = hoveredTool === tool.id;
          const isRecent = isRecentTool(tool.id);
          
          return (
            <div key={tool.id} className="relative flex items-center gap-1">
              <div className="relative group">
                <Button
                  variant={isSelected ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleToolSelect(tool.id)}
                  onMouseEnter={() => handleToolHover(tool.id)}
                  onMouseLeave={() => handleToolHover(null)}
                  className={cn(
                    "w-12 h-12 transition-all duration-300 hover:scale-110 hover-scale relative",
                    isSelected && "bg-primary text-primary-foreground shadow-lg animate-scale-in",
                    isHovered && !isSelected && "bg-secondary shadow-md transform scale-105",
                    "group-hover:z-10"
                  )}
                  title={`${tool.label} (${tool.shortcut})`}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-all duration-200",
                    isSelected && "animate-pulse",
                    isHovered && "scale-110"
                  )} />
                  
                  {/* Recent tool indicator */}
                  {isRecent && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse">
                      <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
                    </div>
                  )}
                  
                  {/* Smart tool indicator */}
                  {tool.category === 'smart' && (
                    <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-500 animate-pulse" />
                  )}
                </Button>

                {/* Enhanced tooltip */}
                {showTooltip === tool.id && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg animate-fade-in z-20">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{tool.label}</span>
                      <Badge className={`text-xs ${getCategoryColor(tool.category)}`}>
                        {tool.shortcut}
                      </Badge>
                    </div>
                    {isRecent && (
                      <div className="text-green-400 text-xs mt-1">مستخدم حديثاً</div>
                    )}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
              
              {/* Separators with animation */}
              {(index === 1 || index === 5 || index === 8) && (
                <Separator 
                  orientation="vertical" 
                  className={cn(
                    "h-8 mx-2 transition-all duration-300",
                    "bg-gradient-to-b from-transparent via-border to-transparent"
                  )} 
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Tool category indicator */}
      {selectedTool && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <Badge className={cn(
            "animate-fade-in transition-all duration-300",
            getCategoryColor(tools.find(t => t.id === selectedTool)?.category || 'basic')
          )}>
            {tools.find(t => t.id === selectedTool)?.label}
          </Badge>
        </div>
      )}
    </div>
  );
});

AnimatedToolbar.displayName = 'AnimatedToolbar';
