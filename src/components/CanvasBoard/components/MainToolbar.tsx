import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MainToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

const tools = [
  { id: 'select', icon: MousePointer2, label: 'تحديد' },
  { id: 'hand', icon: Hand, label: 'يد' },
  { id: 'rectangle', icon: Square, label: 'مستطيل' },
  { id: 'circle', icon: Circle, label: 'دائرة' },
  { id: 'text', icon: Type, label: 'نص' },
  { id: 'pen', icon: Pen, label: 'قلم' },
  { id: 'sticky', icon: StickyNote, label: 'ملصق' },
  { id: 'image', icon: Image, label: 'صورة' },
  { id: 'upload', icon: Upload, label: 'رفع' },
  { id: 'smart', icon: Brain, label: 'ذكي' },
  { id: 'brainstorm', icon: Lightbulb, label: 'عصف ذهني' }
];

export const MainToolbar: React.FC<MainToolbarProps> = ({
  selectedTool,
  onToolSelect
}) => {
  return (
    <div className="flex items-center gap-1 p-2 bg-background/95 backdrop-blur-lg rounded-lg border shadow-lg animate-fade-in">
      {tools.map((tool, index) => (
        <div key={tool.id} className="flex items-center gap-1">
          <Button
            variant={selectedTool === tool.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onToolSelect(tool.id)}
            className={cn(
              "w-10 h-10 transition-all duration-200 hover:scale-105",
              selectedTool === tool.id && "bg-primary text-primary-foreground shadow-md"
            )}
            title={tool.label}
          >
            <tool.icon className="h-4 w-4" />
          </Button>
          {index === 1 || index === 5 ? <Separator orientation="vertical" className="h-6 mx-1" /> : null}
        </div>
      ))}
    </div>
  );
};