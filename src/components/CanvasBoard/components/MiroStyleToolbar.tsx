import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  MousePointer2, 
  Type, 
  Square, 
  Pen, 
  StickyNote, 
  MessageCircle, 
  Image, 
  Hand, 
  ZoomIn,
  Grid3X3,
  Layers,
  Upload,
  Circle,
  Triangle,
  Diamond,
  ArrowRight,
  Minus
} from 'lucide-react';

interface MiroStyleToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

const toolGroups = [
  {
    id: 'basic',
    tools: [
      { id: 'select', icon: MousePointer2, label: 'تحديد', shortcut: 'V' },
      { id: 'hand', icon: Hand, label: 'يد', shortcut: 'H' },
    ]
  },
  {
    id: 'content',
    tools: [
      { id: 'text', icon: Type, label: 'نص', shortcut: 'T' },
      { id: 'sticky', icon: StickyNote, label: 'ملاحظة لاصقة', shortcut: 'S' },
      { id: 'comment', icon: MessageCircle, label: 'تعليق', shortcut: 'C' },
    ]
  },
  {
    id: 'shapes',
    tools: [
      { id: 'rectangle', icon: Square, label: 'مستطيل', shortcut: 'R' },
      { id: 'circle', icon: Circle, label: 'دائرة', shortcut: 'O' },
      { id: 'triangle', icon: Triangle, label: 'مثلث' },
      { id: 'diamond', icon: Diamond, label: 'معين' },
      { id: 'line', icon: Minus, label: 'خط', shortcut: 'L' },
      { id: 'arrow', icon: ArrowRight, label: 'سهم' },
    ]
  },
  {
    id: 'drawing',
    tools: [
      { id: 'pen', icon: Pen, label: 'قلم', shortcut: 'P' },
    ]
  },
  {
    id: 'media',
    tools: [
      { id: 'upload', icon: Upload, label: 'تحميل', shortcut: 'U' },
      { id: 'image', icon: Image, label: 'صورة' },
    ]
  },
  {
    id: 'view',
    tools: [
      { id: 'zoom', icon: ZoomIn, label: 'تكبير', shortcut: 'Z' },
      { id: 'grid', icon: Grid3X3, label: 'شبكة', shortcut: 'G' },
      { id: 'layers', icon: Layers, label: 'طبقات' },
    ]
  }
];

export const MiroStyleToolbar: React.FC<MiroStyleToolbarProps> = ({
  selectedTool,
  onToolSelect
}) => {
  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-50">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2 space-y-1">
        {toolGroups.map((group, groupIndex) => (
          <div key={group.id}>
            {groupIndex > 0 && (
              <div className="h-px bg-gray-200 mx-2 my-2" />
            )}
            <div className="space-y-1">
              {group.tools.map((tool) => {
                const Icon = tool.icon;
                const isSelected = selectedTool === tool.id;
                
                return (
                  <Button
                    key={tool.id}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-10 h-10 p-0 hover:bg-blue-50 relative group",
                      isSelected && "bg-blue-100 border border-blue-300"
                    )}
                    onClick={() => onToolSelect(tool.id)}
                    title={`${tool.label} ${tool.shortcut ? `(${tool.shortcut})` : ''}`}
                  >
                    <Icon 
                      className={cn(
                        "w-5 h-5",
                        isSelected ? "text-blue-600" : "text-gray-600"
                      )} 
                    />
                    
                    {/* Tooltip */}
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                                  pointer-events-none whitespace-nowrap z-50">
                      {tool.label}
                      {tool.shortcut && (
                        <span className="text-gray-300 ml-1">({tool.shortcut})</span>
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};