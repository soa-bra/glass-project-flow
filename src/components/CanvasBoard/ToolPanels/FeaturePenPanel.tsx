import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Pen, Brush, Highlighter, Eraser } from 'lucide-react';

interface FeaturePenPanelProps {
  onToolSelect: (tool: string) => void;
  selectedTool: string;
}

export const FeaturePenPanel: React.FC<FeaturePenPanelProps> = ({ onToolSelect, selectedTool }) => {
  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pen className="w-5 h-5" />
          القلم الذكي
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pen tools will be implemented */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant={selectedTool === 'pen' ? 'default' : 'outline'} onClick={() => onToolSelect('pen')}>
            <Pen className="w-4 h-4" />
          </Button>
          <Button variant={selectedTool === 'brush' ? 'default' : 'outline'} onClick={() => onToolSelect('brush')}>
            <Brush className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};