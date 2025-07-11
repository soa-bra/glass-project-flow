
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, Sparkles, X, Lightbulb } from 'lucide-react';
import { CanvasElement } from '../../types/index';

interface SmartAssistantPanelProps {
  onClose: () => void;
  selectedElementId: string | null;
  elements: CanvasElement[];
}

export const SmartAssistantPanel: React.FC<SmartAssistantPanelProps> = ({
  onClose,
  selectedElementId,
  elements
}) => {
  const [message, setMessage] = useState('');
  const [suggestions] = useState([
    {
      id: '1',
      title: 'تحسين التخطيط',
      description: 'يمكنني ترتيب العناصر بشكل أفضل',
      confidence: 0.9
    },
    {
      id: '2',
      title: 'اقتراح ألوان',
      description: 'ألوان متناسقة للتصميم',
      confidence: 0.85
    },
    {
      id: '3',
      title: 'إضافة نص',
      description: 'نص مناسب للسياق',
      confidence: 0.75
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Simulate AI processing
      setMessage('');
    }
  };

  return (
    <Card className="w-80 max-h-96 shadow-xl border animate-scale-in">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bot className="w-4 h-4 text-blue-600" />
            المساعد الذكي
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* AI Suggestions */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3" />
            اقتراحات ذكية
          </div>
          
          <ScrollArea className="h-32">
            <div className="space-y-2">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-2 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">
                        {suggestion.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {suggestion.description}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      {Math.round(suggestion.confidence * 100)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Context Info */}
        {selectedElementId && (
          <div className="p-2 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lightbulb className="w-3 h-3" />
              عنصر محدد: {selectedElementId}
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="flex gap-2 pt-2 border-t">
          <Input
            placeholder="اسأل المساعد الذكي..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="text-xs"
          />
          <Button size="sm" onClick={handleSendMessage}>
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
