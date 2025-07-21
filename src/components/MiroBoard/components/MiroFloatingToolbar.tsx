import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MousePointer, 
  Hand, 
  Type, 
  Square, 
  Circle, 
  Triangle,
  Pen,
  Image,
  StickyNote,
  MessageSquare,
  ArrowRight,
  Shapes,
  Frame,
  Component
} from 'lucide-react';

interface MiroFloatingToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

const tools = [
  { id: 'select', icon: MousePointer, name: 'تحديد', shortcut: 'V' },
  { id: 'hand', icon: Hand, name: 'يد', shortcut: 'H' },
  { id: 'pen', icon: Pen, name: 'قلم', shortcut: 'P' },
  { id: 'text', icon: Type, name: 'نص', shortcut: 'T' },
  { id: 'sticky', icon: StickyNote, name: 'ملاحظة', shortcut: 'S' },
  { id: 'shapes', icon: Shapes, name: 'أشكال', shortcut: 'R' },
  { id: 'arrow', icon: ArrowRight, name: 'سهم', shortcut: 'L' },
  { id: 'frame', icon: Frame, name: 'إطار', shortcut: 'F' },
  { id: 'image', icon: Image, name: 'صورة', shortcut: 'I' },
  { id: 'comment', icon: MessageSquare, name: 'تعليق', shortcut: 'C' }
];

export const MiroFloatingToolbar: React.FC<MiroFloatingToolbarProps> = ({
  selectedTool,
  onToolSelect
}) => {
  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 bg-white rounded-lg shadow-lg border border-border p-2 w-12">
      <div className="flex flex-col gap-1">
        {tools.map((tool, index) => (
          <div key={tool.id}>
            <Button
              variant={selectedTool === tool.id ? "default" : "ghost"}
              size="sm"
              className="w-8 h-8 p-0 flex items-center justify-center relative group"
              onClick={() => onToolSelect(tool.id)}
              title={`${tool.name} (${tool.shortcut})`}
            >
              <tool.icon className="w-4 h-4" />
              
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {tool.name} ({tool.shortcut})
              </div>
            </Button>
            
            {/* Add separator after certain tools */}
            {(index === 1 || index === 4 || index === 7) && (
              <Separator className="my-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};