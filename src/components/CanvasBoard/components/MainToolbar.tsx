import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MAIN_TOOLBAR_TOOLS } from '../constants';

interface MainToolbarProps {
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
}

const MainToolbar: React.FC<MainToolbarProps> = ({
  selectedTool, 
  onToolSelect 
}) => {
  // المجموعة الأولى: الأدوات الأساسية
  const basicTools = MAIN_TOOLBAR_TOOLS.filter(tool => 
    ['select', 'smart-pen'].includes(tool.id)
  );
  
  // المجموعة الثانية: أدوات التنقل
  const navigationTools = MAIN_TOOLBAR_TOOLS.filter(tool => 
    ['zoom', 'hand'].includes(tool.id)
  );
  
  // المجموعة الثالثة: أدوات التعاون والملفات
  const collaborationTools = MAIN_TOOLBAR_TOOLS.filter(tool => 
    ['upload', 'comment'].includes(tool.id)
  );
  
  // المجموعة الرابعة: أدوات المحتوى الذكي
  const contentTools = MAIN_TOOLBAR_TOOLS.filter(tool => 
    ['text', 'shape', 'smart-element'].includes(tool.id)
  );

  const renderToolGroup = (tools: typeof MAIN_TOOLBAR_TOOLS, groupName: string) => (
    <div className="flex items-center gap-1">
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isSelected = selectedTool === tool.id;
        const tooltipContent = `${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ''}`;
        
        return (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <Button
                variant={isSelected ? "default" : "ghost"}
                size="sm"
                className={`h-12 w-12 rounded-xl transition-all duration-200 ${
                  isSelected 
                    ? 'bg-black text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
                onClick={() => onToolSelect(tool.id)}
              >
                <Icon className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-black text-white">
              <p className="text-sm">{tooltipContent}</p>
              {tool.description && (
                <p className="text-xs text-gray-300 mt-1 max-w-60">{tool.description}</p>
              )}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <Card className="bg-white/95 backdrop-blur-lg shadow-sm border border-gray-200/50 rounded-[24px]">
          <CardContent className="flex items-center gap-3 p-4">
            {renderToolGroup(basicTools, 'أساسي')}
            {basicTools.length > 0 && navigationTools.length > 0 && <Separator orientation="vertical" className="h-6" />}
            {renderToolGroup(navigationTools, 'تنقل')}
            {navigationTools.length > 0 && collaborationTools.length > 0 && <Separator orientation="vertical" className="h-6" />}
            {renderToolGroup(collaborationTools, 'تعاون')}
            {collaborationTools.length > 0 && contentTools.length > 0 && <Separator orientation="vertical" className="h-6" />}
            {renderToolGroup(contentTools, 'محتوى')}
          </CardContent>
        </Card>
        
        {/* عرض اسم الأداة المحددة مع تأثير */}
        {selectedTool && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 animate-fade-in">
            <div className="bg-black text-white px-4 py-2 rounded-lg text-sm font-arabic whitespace-nowrap shadow-lg">
              {MAIN_TOOLBAR_TOOLS.find(t => t.id === selectedTool)?.label}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default MainToolbar;