import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tool, PlanningMode } from './types';

interface ToolsPanelProps {
  tools: Tool[];
  planningModes: PlanningMode[];
  selectedTool: string;
  selectedPlanningMode: string;
  colors: string[];
  onToolSelect: (toolId: string) => void;
  onPlanningModeSelect: (modeId: string) => void;
}

const ToolsPanel: React.FC<ToolsPanelProps> = ({
  tools,
  planningModes,
  selectedTool,
  selectedPlanningMode,
  colors,
  onToolSelect,
  onPlanningModeSelect
}) => {
  return (
    <Card className="bg-white/95 backdrop-blur-sm border-black/10">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-black mb-4">لوحة التخطيط التفاعلية</h3>
        
        {/* Planning Modes */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-black mb-2">أنماط التخطيط</h4>
          <div className="space-y-1">
            {planningModes.map(mode => {
              const Icon = mode.icon;
              return (
                <Button
                  key={mode.id}
                  variant={selectedPlanningMode === mode.id ? "default" : "ghost"}
                  size="sm"
                  className={`w-full justify-start gap-2 text-xs ${
                    selectedPlanningMode === mode.id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-transparent text-black hover:bg-black/5'
                  }`}
                  onClick={() => onPlanningModeSelect(mode.id)}
                >
                  <Icon className="w-3 h-3" />
                  {mode.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Drawing Tools */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-black mb-2">أدوات الرسم</h4>
          <div className="space-y-1">
            {tools.map(tool => {
              const Icon = tool.icon;
              return (
                <Button
                  key={tool.id}
                  variant={selectedTool === tool.id ? "default" : "outline"}
                  size="sm"
                  className={`w-full justify-start gap-2 text-xs ${
                    selectedTool === tool.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-transparent border-black/20 text-black hover:bg-black/5'
                  }`}
                  onClick={() => onToolSelect(tool.id)}
                >
                  <Icon className="w-3 h-3" />
                  {tool.label}
                </Button>
              );
            })}
          </div>
        </div>
        
        {/* Colors */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-black mb-2">الألوان</h4>
          <div className="grid grid-cols-3 gap-2">
            {colors.map((color, index) => (
              <div
                key={index}
                className={`w-6 h-6 rounded-lg cursor-pointer border-2 border-black/10 ${color}`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToolsPanel;