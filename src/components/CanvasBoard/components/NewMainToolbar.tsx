import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  MousePointer, 
  Pen, 
  ZoomIn, 
  Hand, 
  Upload, 
  MessageSquare, 
  Type, 
  Shapes, 
  Sparkles 
} from 'lucide-react';

interface NewMainToolbarProps {
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
}

const NewMainToolbar: React.FC<NewMainToolbarProps> = ({ 
  selectedTool, 
  onToolSelect 
}) => {
  // تعريف الأدوات مع الأيقونات والتسميات
  const getToolConfig = (toolId: string) => {
    switch (toolId) {
      case 'select': return { icon: MousePointer, label: 'تحديد' };
      case 'smart-pen': return { icon: Pen, label: 'القلم الذكي' };
      case 'zoom': return { icon: ZoomIn, label: 'زوم' };
      case 'hand': return { icon: Hand, label: 'كف' };
      case 'upload': return { icon: Upload, label: 'رفع مرفق' };
      case 'comment': return { icon: MessageSquare, label: 'تعليق' };
      case 'text': return { icon: Type, label: 'نص' };
      case 'shape': return { icon: Shapes, label: 'شكل' };
      case 'smart-element': return { icon: Sparkles, label: 'عنصر ذكي' };
      default: return { icon: MousePointer, label: toolId };
    }
  };

  // المجموعة الأولى: التحديد والقلم الذكي
  const group1Tools = ['select', 'smart-pen'];
  
  // المجموعة الثانية: الزوم والكف
  const group2Tools = ['zoom', 'hand'];
  
  // المجموعة الثالثة: الرفع والتعليق
  const group3Tools = ['upload', 'comment'];
  
  // المجموعة الرابعة: النص والشكل والعنصر الذكي
  const group4Tools = ['text', 'shape', 'smart-element'];

  const renderToolGroup = (tools: string[], groupName: string) => (
    <div className="flex items-center gap-1">
      {tools.map((toolId) => {
        const toolConfig = getToolConfig(toolId);
        const Icon = toolConfig.icon;
        const isSelected = selectedTool === toolId;
        return (
          <Button
            key={toolId}
            variant={isSelected ? "default" : "ghost"}
            size="sm"
            className={`h-12 w-12 rounded-xl transition-all duration-200 ${
              isSelected 
                ? 'bg-black text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-black'
            }`}
            onClick={() => onToolSelect(toolId)}
            title={toolConfig.label}
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
            {getToolConfig(selectedTool).label}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewMainToolbar;