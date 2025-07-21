import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MousePointer, 
  Pen, 
  Square, 
  Circle, 
  Type,
  Shapes,
  Zap,
  Upload,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TOOLS = [
  { id: 'select', icon: MousePointer, label: 'التحديد', shortcut: 'V' },
  { id: 'smart-pen', icon: Pen, label: 'القلم الذكي', shortcut: 'P' },
  { id: 'text', icon: Type, label: 'النص', shortcut: 'T' },
  { id: 'rectangle', icon: Square, label: 'مستطيل', shortcut: 'R' },
  { id: 'circle', icon: Circle, label: 'دائرة', shortcut: 'C' },
  { id: 'shapes', icon: Shapes, label: 'الأشكال', shortcut: 'S' },
  { id: 'smart-element', icon: Zap, label: 'عنصر ذكي', shortcut: 'E' },
  { id: 'upload', icon: Upload, label: 'رفع ملف', shortcut: 'U' },
  { id: 'comment', icon: MessageCircle, label: 'تعليق', shortcut: 'M' }
];

interface AdvancedToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  onCreateElement: (type: string, x: number, y: number) => void;
}

export const AdvancedToolbar: React.FC<AdvancedToolbarProps> = ({
  selectedTool,
  onToolSelect,
  onCreateElement
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['basic']);

  const handleToolClick = useCallback((toolId: string) => {
    onToolSelect(toolId);
    
    // Auto-create element for some tools
    if (['rectangle', 'circle', 'text'].includes(toolId)) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      onCreateElement(toolId, centerX - 50, centerY - 50);
    }
  }, [onToolSelect, onCreateElement]);

  const basicTools = TOOLS.slice(0, 3);
  const shapeTools = TOOLS.slice(3, 6);
  const advancedTools = TOOLS.slice(6);

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <Card className="bg-white/95 backdrop-blur-lg shadow-lg border border-gray-200/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {/* Basic Tools */}
            <div className="flex items-center gap-1">
              {basicTools.map(tool => {
                const Icon = tool.icon;
                const isSelected = selectedTool === tool.id;
                return (
                  <Button
                    key={tool.id}
                    variant={isSelected ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleToolClick(tool.id)}
                    className={cn(
                      "h-12 w-12 rounded-xl transition-all duration-200",
                      isSelected 
                        ? "bg-blue-500 text-white shadow-lg scale-105" 
                        : "text-gray-600 hover:bg-gray-100 hover:text-blue-600 hover:scale-105"
                    )}
                    title={`${tool.label} (${tool.shortcut})`}
                  >
                    <Icon className="w-5 h-5" />
                  </Button>
                );
              })}
            </div>

            <div className="w-px h-8 bg-gray-300" />

            {/* Shape Tools */}
            <div className="flex items-center gap-1">
              {shapeTools.map(tool => {
                const Icon = tool.icon;
                const isSelected = selectedTool === tool.id;
                return (
                  <Button
                    key={tool.id}
                    variant={isSelected ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleToolClick(tool.id)}
                    className={cn(
                      "h-12 w-12 rounded-xl transition-all duration-200",
                      isSelected 
                        ? "bg-green-500 text-white shadow-lg scale-105" 
                        : "text-gray-600 hover:bg-gray-100 hover:text-green-600 hover:scale-105"
                    )}
                    title={`${tool.label} (${tool.shortcut})`}
                  >
                    <Icon className="w-5 h-5" />
                  </Button>
                );
              })}
            </div>

            <div className="w-px h-8 bg-gray-300" />

            {/* Advanced Tools */}
            <div className="flex items-center gap-1">
              {advancedTools.map(tool => {
                const Icon = tool.icon;
                const isSelected = selectedTool === tool.id;
                return (
                  <Button
                    key={tool.id}
                    variant={isSelected ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleToolClick(tool.id)}
                    className={cn(
                      "h-12 w-12 rounded-xl transition-all duration-200",
                      isSelected 
                        ? "bg-purple-500 text-white shadow-lg scale-105" 
                        : "text-gray-600 hover:bg-gray-100 hover:text-purple-600 hover:scale-105"
                    )}
                    title={`${tool.label} (${tool.shortcut})`}
                  >
                    <Icon className="w-5 h-5" />
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Tool Info */}
          {selectedTool && (
            <div className="mt-3 text-center">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                {TOOLS.find(t => t.id === selectedTool)?.label}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};