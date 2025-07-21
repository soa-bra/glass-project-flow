import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';

interface SmartAssistantPanelProps {
  onAddSmartElement?: (type: string, config: any) => void;
  elements?: any[];
}

const SmartAssistantPanel: React.FC<SmartAssistantPanelProps> = () => {
  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot size={16} />
          المساعد الذكي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">المساعد الذكي قيد التطوير</p>
      </CardContent>
    </Card>
  );
};

export default SmartAssistantPanel;