
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
  // المجموعة الأولى: التحديد والقلم الذكي
  const group1Tools = MAIN_TOOLBAR_TOOLS.filter(tool => 
    ['select', 'smart-pen'].includes(tool.id)
  );
  
  // المجموعة الثانية: الزوم والكف
  const group2Tools = MAIN_TOOLBAR_TOOLS.filter(tool => 
    ['zoom', 'hand'].includes(tool.id)
  );
  
  // المجموعة الثالثة: الرفع والتعليق
  const group3Tools = MAIN_TOOLBAR_TOOLS.filter(tool => 
    ['upload', 'comment'].includes(tool.id)
  );
  
  // المجموعة الرابعة: النص والشكل والعنصر الذكي
  const group4Tools = MAIN_TOOLBAR_TOOLS.filter(tool => 
    ['text', 'shape', 'smart-element'].includes(tool.id)
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
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <Card className="bg-white/95 backdrop-blur-lg shadow-sm border border-gray-200/50 rounded-[24px]">
        <CardContent className="flex items-center justify-center gap-4 px-6 py-3">
          {/* المجموعة الأولى: التحديد والقلم الذكي */}
          {renderToolGroup(group1Tools, 'group1')}
          
          <Separator orientation="vertical" className="h-8 bg-gray-300" />
          
          {/* المجموعة الثانية: الزوم والكف */}
          {renderToolGroup(group2Tools, 'group2')}
          
          <Separator orientation="vertical" className="h-8 bg-gray-300" />
          
          {/* المجموعة الثالثة: الرفع والتعليق */}
          {renderToolGroup(group3Tools, 'group3')}
          
          <Separator orientation="vertical" className="h-8 bg-gray-300" />
          
          {/* المجموعة الرابعة: النص والشكل والعنصر الذكي */}
          {renderToolGroup(group4Tools, 'group4')}
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
