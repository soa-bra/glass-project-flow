import React from 'react';
import { Card } from '@/components/ui/card';
import { Bot, Lightbulb } from 'lucide-react';

interface AIAssistantPanelProps {
  selectedPlanId: string | null;
}

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = () => {
  return (
    <div className="h-full flex flex-col bg-background p-6">
      <div className="flex items-center gap-2 mb-6">
        <Bot className="w-6 h-6" />
        <h1 className="text-2xl font-bold">مساعد الذكاء الاصطناعي</h1>
      </div>
      
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <span className="font-medium">اقتراحات ذكية</span>
        </div>
        <p className="text-muted-foreground">سيتم عرض الاقتراحات الذكية هنا</p>
      </Card>
    </div>
  );
};