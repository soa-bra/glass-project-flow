import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import AIService, { AIAnalysisResponse, SmartAction } from '@/services/aiService';

/**
 * Interface for Smart Assistant Panel Props
 */
interface SmartAssistantPanelProps {
  /** معرف المشروع الحالي - Current project ID */
  projectId?: string;
  /** العقد المحددة في الكانفاس - Selected nodes in canvas */
  selectedNodes?: string[];
  /** عناصر الكانفاس - Canvas elements */
  canvasElements?: any[];
  /** دالة استدعاء عند تنفيذ إجراء ذكي - Callback when smart action is executed */
  onSmartAction?: (action: SmartAction, response: AIAnalysisResponse) => void;
}

/**
 * Interface for chat message
 */
interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  suggestions?: string[];
}

/**
 * لوحة المساعد الذكي - Smart Assistant Panel
 * 
 * توفر واجهة للتفاعل مع الذكاء الاصطناعي لتحليل وإكمال المشاريع
 * Provides interface for AI interaction to analyze and complete projects
 * 
 * @param props - SmartAssistantPanelProps
 */
export const SmartAssistantPanel: React.FC<SmartAssistantPanelProps> = ({
  projectId = 'default',
  selectedNodes = [],
  canvasElements = [],
  onSmartAction
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'مرحباً! أنا المساعد الذكي لسوبرا. كيف يمكنني مساعدتك في تطوير مشروعك؟',
      isUser: false,
      timestamp: new Date().toISOString(),
      suggestions: ['تحليل المشروع', 'إضافة عناصر ذكية', 'مراجعة التماسك']
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * الإجراءات الذكية المتاحة - Available smart actions
   */
  const smartActions: SmartAction[] = [
    {
      id: 'smart_finish',
      icon: '⏩',
      label: 'إنهاء ذكي',
      description: 'تحليل تلقائي للخطة وإكمال المشروع حتى النهاية'
    },
    {
      id: 'smart_review',
      icon: '🔍',
      label: 'مراجعة ذكية',
      description: 'تحليل التماسك والفجوات وتوليد توصيات جديدة'
    },
    {
      id: 'smart_clean',
      icon: '🧹',
      label: 'تنظيف ذكي',
      description: 'إخفاء وتجميع العناصر غير المرتبطة بالخطة النشطة'
    }
  ];

  /**
   * تنفيذ إجراء ذكي - Execute smart action
   */
  const handleSmartAction = async (action: SmartAction) => {
    setIsLoading(true);
    
    try {
      const context = {
        projectId,
        selectedNodes,
        canvasElements,
        userAction: action.id
      };

      const response = await AIService.processSmartAction(action, context);
      
      // إضافة رسالة المستخدم
      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        content: `تنفيذ: ${action.label}`,
        isUser: true,
        timestamp: new Date().toISOString()
      };

      // إضافة رد الذكاء الاصطناعي
      const aiMessage: ChatMessage = {
        id: response.id,
        content: response.message,
        isUser: false,
        timestamp: response.timestamp,
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, userMessage, aiMessage]);
      
      // استدعاء دالة معالجة الإجراء
      onSmartAction?.(action, response);
      
    } catch (error) {
      console.error('Error executing smart action:', error);
      
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        content: 'عذراً، حدث خطأ أثناء تنفيذ الإجراء. يرجى المحاولة مرة أخرى.',
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * إرسال رسالة نصية - Send text message
   */
  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent) return;

    setInputValue('');
    setIsLoading(true);

    // إضافة رسالة المستخدم
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      content: messageContent,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const context = {
        projectId,
        selectedNodes,
        canvasElements
      };

      const response = await AIService.getChatResponse(messageContent, context);
      
      const aiMessage: ChatMessage = {
        id: response.id,
        content: response.message,
        isUser: false,
        timestamp: response.timestamp,
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        content: 'عذراً، حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.',
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * التعامل مع ضغط Enter في حقل الإدخال
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * تنسيق الوقت للعرض
   */
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="h-full flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border/40">
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          المساعد الذكي
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3 min-h-0 p-3 pt-0">
        {/* شريط الإجراءات الذكية - Smart Actions Bar */}
        <div className="flex gap-1">
          {smartActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              size="sm"
              onClick={() => handleSmartAction(action)}
              disabled={isLoading}
              className="flex-1 text-xs px-2 py-1 h-8"
              title={action.description}
            >
              <span className="mr-1">{action.icon}</span>
              <span className="hidden sm:inline">{action.label.split(' ')[0]}</span>
            </Button>
          ))}
        </div>

        {/* صندوق المحادثة - Chat Box */}
        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1 pr-3">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex flex-col gap-1",
                    message.isUser ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2 text-xs leading-relaxed",
                      message.isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.content}
                  </div>
                  
                  {/* اقتراحات الذكاء الاصطناعي */}
                  {!message.isUser && message.suggestions && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSendMessage(suggestion)}
                          className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  <span className="text-xs text-muted-foreground">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              ))}
              
              {/* مؤشر التحميل */}
              {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-xs">المساعد يفكر...</span>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* حقل الإدخال - Input Field */}
          <div className="flex gap-2 pt-3 border-t">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب رسالتك هنا..."
              disabled={isLoading}
              className="flex-1 text-xs h-8"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputValue.trim()}
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartAssistantPanel;