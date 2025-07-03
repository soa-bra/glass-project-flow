import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Button } from '@/components/ui/button';

interface MainToolbarProps {
  selectedTool: string;
  onSelectTool: (tool: string) => void;
  projectId: string;
}

export const MainToolbar: React.FC<MainToolbarProps> = ({ selectedTool, onSelectTool, projectId }) => {
  const tools = [
    { id: 'select', name: 'تحديد', icon: '👆' },
    { id: 'draw', name: 'رسم', icon: '✏️' },
    { id: 'text', name: 'نص', icon: '📝' },
    { id: 'shape', name: 'شكل', icon: '🔷' },
  ];

  return (
    <BaseCard variant="operations" className="p-2">
      <div className="flex gap-2">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant={selectedTool === tool.id ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectTool(tool.id)}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <span className="text-lg">{tool.icon}</span>
            <span className="text-xs">{tool.name}</span>
          </Button>
        ))}
      </div>
    </BaseCard>
  );
};