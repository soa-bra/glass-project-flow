import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  Send, 
  Lightbulb, 
  Layout, 
  Palette, 
  Wand2, 
  Sparkles,
  Clock,
  Check,
  X,
  RefreshCw
} from 'lucide-react';
import { SmartSuggestion, AssistantAction } from '../types/index';

interface SmartAssistantPanelProps {
  isVisible: boolean;
  onToggle: () => void;
  suggestions: SmartSuggestion[];
  history: AssistantAction[];
  onApplySuggestion: (suggestion: SmartSuggestion) => void;
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

const SmartAssistantPanel: React.FC<SmartAssistantPanelProps> = ({
  isVisible,
  onToggle,
  suggestions,
  history,
  onApplySuggestion,
  onSendMessage,
  isLoading = false
}) => {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'suggestions' | 'history'>('suggestions');

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'layout': return Layout;
      case 'content': return Bot;
      case 'style': return Palette;
      case 'workflow': return Wand2;
      case 'template': return Sparkles;
      default: return Lightbulb;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-success';
    if (confidence >= 0.6) return 'bg-warning';
    return 'bg-muted';
  };

  if (!isVisible) return null;

  return (
    <Card className="w-80 h-[600px] flex flex-col bg-background/95 backdrop-blur-sm border shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Bot className="w-4 h-4 text-primary" />
          المساعد الذكي
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="ml-auto p-1 h-6 w-6"
          >
            <X className="w-3 h-3" />
          </Button>
        </CardTitle>
        
        <div className="flex gap-1">
          <Button
            variant={activeTab === 'suggestions' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('suggestions')}
            className="text-xs flex-1"
          >
            اقتراحات
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('history')}
            className="text-xs flex-1"
          >
            السجل
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3 p-4 pt-0">
        {/* Chat Input */}
        <div className="flex gap-2">
          <Textarea
            placeholder="اسأل المساعد الذكي..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="resize-none text-sm"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            className="self-end"
          >
            {isLoading ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <Send className="w-3 h-3" />
            )}
          </Button>
        </div>

        <Separator />

        {/* Tab Content */}
        <ScrollArea className="flex-1">
          {activeTab === 'suggestions' ? (
            <div className="space-y-3">
              {suggestions.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-8">
                  <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>لا توجد اقتراحات حاليًا</p>
                  <p className="text-xs mt-1">ابدأ بالعمل لرؤية اقتراحات ذكية</p>
                </div>
              ) : (
                suggestions.map((suggestion) => {
                  const Icon = getSuggestionIcon(suggestion.type);
                  return (
                    <Card key={suggestion.id} className="p-3 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-2 mb-2">
                        <Icon className="w-4 h-4 text-primary mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{suggestion.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {suggestion.description}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`text-xs px-1.5 py-0.5 ${getConfidenceColor(suggestion.confidence)}`}
                        >
                          {Math.round(suggestion.confidence * 100)}%
                        </Badge>
                      </div>
                      
                      {suggestion.preview && (
                        <div className="bg-muted rounded p-2 mb-2">
                          <p className="text-xs text-muted-foreground">{suggestion.preview}</p>
                        </div>
                      )}
                      
                      <Button
                        size="sm"
                        onClick={() => onApplySuggestion(suggestion)}
                        className="w-full text-xs"
                      >
                        تطبيق الاقتراح
                      </Button>
                    </Card>
                  );
                })
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {history.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-8">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>لا يوجد سجل حاليًا</p>
                </div>
              ) : (
                history.map((action) => (
                  <div key={action.id} className="flex items-center gap-2 p-2 rounded border">
                    {action.success ? (
                      <Check className="w-3 h-3 text-success" />
                    ) : (
                      <X className="w-3 h-3 text-destructive" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate">{action.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {action.timestamp.toLocaleTimeString('ar-SA')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </ScrollArea>

        {/* Quick Actions */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">إجراءات سريعة</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => onSendMessage('اقترح تخطيط أفضل للعناصر')}
            >
              <Layout className="w-3 h-3 mr-1" />
              تحسين التخطيط
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => onSendMessage('اقترح ألوان متناسقة')}
            >
              <Palette className="w-3 h-3 mr-1" />
              تنسيق الألوان
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => onSendMessage('أضف محتوى ذكي')}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              محتوى ذكي
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => onSendMessage('اقترح قوالب جاهزة')}
            >
              <Wand2 className="w-3 h-3 mr-1" />
              قوالب جاهزة
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartAssistantPanel;