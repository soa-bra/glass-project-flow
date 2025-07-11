
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wrench, X, MousePointer, Pen, Square, Circle, Type, StickyNote } from 'lucide-react';

interface ToolsPanelProps {
  onClose: () => void;
}

export const ToolsPanel: React.FC<ToolsPanelProps> = ({
  onClose
}) => {
  const tools = [
    { id: 'select', name: 'تحديد', icon: MousePointer, shortcut: 'V' },
    { id: 'pen', name: 'قلم', icon: Pen, shortcut: 'P' },
    { id: 'rectangle', name: 'مستطيل', icon: Square, shortcut: 'R' },
    { id: 'circle', name: 'دائرة', icon: Circle, shortcut: 'C' },
    { id: 'text', name: 'نص', icon: Type, shortcut: 'T' },
    { id: 'sticky', name: 'ملصق', icon: StickyNote, shortcut: 'S' }
  ];

  return (
    <Card className="w-48 shadow-xl border animate-scale-in">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Wrench className="w-4 h-4 text-orange-600" />
            الأدوات
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Button
              key={tool.id}
              variant="ghost"
              className="w-full justify-between hover:bg-muted"
              size="sm"
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="text-xs">{tool.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs px-1 py-0">
                {tool.shortcut}
              </Badge>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};
