import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CANVAS_TOOLS } from '../constants';

interface MainToolbarProps {
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
}

const MainToolbar: React.FC<MainToolbarProps> = ({ selectedTool, onToolSelect }) => {
  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50">
      <Card className="bg-white/95 backdrop-blur-md shadow-sm border border-gray-300 rounded-[40px]">
        <CardContent className="flex items-center gap-2 p-3">
          {CANVAS_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Button
                key={tool.id}
                variant={selectedTool === tool.id ? "default" : "ghost"}
                size="sm"
                className={`h-10 px-3 rounded-full ${selectedTool === tool.id ? 'bg-black text-white' : 'text-gray-600 hover:bg-soabra-new-secondary-4'}`}
                onClick={() => onToolSelect(tool.id)}
                title={tool.label}
              >
                <Icon className="w-4 h-4" />
              </Button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default MainToolbar;