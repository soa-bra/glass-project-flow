import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MAIN_TOOLBAR_TOOLS } from '../constants';

interface NewMainToolbarProps {
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
}

const NewMainToolbar: React.FC<NewMainToolbarProps> = ({ 
  selectedTool, 
  onToolSelect 
}) => {
  const basicTools = MAIN_TOOLBAR_TOOLS.filter(tool => 
    ['select', 'smart-pen', 'zoom', 'hand'].includes(tool.id)
  );
  
  const fileTools = MAIN_TOOLBAR_TOOLS.filter(tool => 
    ['upload'].includes(tool.id)
  );
  
  const contentTools = MAIN_TOOLBAR_TOOLS.filter(tool => 
    ['comment', 'text', 'shape', 'smart-element'].includes(tool.id)
  );

  const renderToolGroup = (tools: typeof MAIN_TOOLBAR_TOOLS, groupName: string) => (
    <div className="flex items-center gap-1">
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isSelected = selectedTool === tool.id;
        return (
          <Button
            key={tool.id}
            variant={isSelected ? "default" : "ghost"}
            size="sm"
            className={`h-12 w-12 rounded-xl transition-all duration-200 ${
              isSelected 
                ? 'bg-black text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-black'
            }`}
            onClick={() => onToolSelect(tool.id)}
            title={tool.label}
          >
            <Icon className="w-5 h-5" />
          </Button>
        );
      })}
    </div>
  );

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50" style={{ width: '70%' }}>
      <Card className="bg-white/95 backdrop-blur-lg shadow-xl border border-gray-200/50 rounded-[24px]">
        <CardContent className="flex items-center justify-center gap-6 p-4">
          {/* الأدوات الأساسية */}
          {renderToolGroup(basicTools, 'basic')}
          
          <Separator orientation="vertical" className="h-8 bg-gray-300" />
          
          {/* أدوات الملفات */}
          {renderToolGroup(fileTools, 'file')}
          
          <Separator orientation="vertical" className="h-8 bg-gray-300" />
          
          {/* أدوات المحتوى */}
          {renderToolGroup(contentTools, 'content')}
        </CardContent>
      </Card>
      
      {/* عرض اسم الأداة المحددة */}
      {selectedTool && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="bg-black text-white px-4 py-2 rounded-lg text-sm font-arabic whitespace-nowrap">
            {MAIN_TOOLBAR_TOOLS.find(t => t.id === selectedTool)?.label}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewMainToolbar;