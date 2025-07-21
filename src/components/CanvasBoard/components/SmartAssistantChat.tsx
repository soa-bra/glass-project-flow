import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Send, 
  Lightbulb, 
  Wand2, 
  Sparkles,
  X,
  Bot,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CanvasElement } from '../types';

interface SmartAssistantChatProps {
  elements: CanvasElement[];
  onCreateElement: (type: string, x: number, y: number) => void;
  onClose: () => void;
  className?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export const SmartAssistantChat: React.FC<SmartAssistantChatProps> = ({
  elements,
  onCreateElement,
  onClose,
  className
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'مرحباً! أنا مساعدك الذكي في تخطيط المشاريع. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date(),
      suggestions: [
        'إنشاء خطة مشروع جديدة',
        'تنظيم الأفكار الموجودة',
        'إضافة جدول زمني',
        'تحليل المخاطر'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        {
          content: 'فكرة ممتازة! سأساعدك في إنشاء خطة مشروع منظمة. دعني أضيف بعض العناصر المفيدة للوحة.',
          suggestions: ['إضافة مهام فرعية', 'تحديد المسؤوليات', 'إضافة مواعيد نهائية']
        },
        {
          content: 'أرى أن لديك ' + elements.length + ' عنصر في اللوحة. يمكنني تنظيمها بشكل أفضل أو إضافة عناصر جديدة.',
          suggestions: ['ترتيب العناصر', 'إضافة روابط', 'تجميع العناصر']
        },
        {
          content: 'ممتاز! هذا مشروع واعد. دعني أقترح بعض الخطوات التالية لتطويره.',
          suggestions: ['تحليل الجدوى', 'خطة التسويق', 'تقدير الميزانية']
        }
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: randomResponse.content,
        timestamp: new Date(),
        suggestions: randomResponse.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      // Auto-create elements based on message
      if (message.includes('مهمة') || message.includes('عنصر')) {
        setTimeout(() => {
          onCreateElement('text', 200 + Math.random() * 300, 200 + Math.random() * 300);
        }, 1000);
      }
    }, 2000);
  }, [elements.length, onCreateElement]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    handleSendMessage(suggestion);
  }, [handleSendMessage]);

  return (
    <Card className={cn("w-80 h-96 flex flex-col bg-white/95 backdrop-blur-sm shadow-lg", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-lg">المساعد الذكي</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3 p-4 pt-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={cn(
              "flex gap-2",
              message.type === 'user' ? "justify-end" : "justify-start"
            )}>
              {message.type === 'assistant' && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-3 h-3 text-white" />
                </div>
              )}
              
              <div className={cn(
                "max-w-[80%] rounded-lg p-3 text-sm",
                message.type === 'user' 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-100 text-gray-800"
              )}>
                <p>{message.content}</p>
                
                {message.suggestions && (
                  <div className="mt-2 space-y-1">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="block w-full text-right text-xs bg-white/20 hover:bg-white/30 rounded px-2 py-1 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {message.type === 'user' && (
                <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2 justify-start">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3 text-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="اكتب رسالتك..."
            className="flex-1 text-sm"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(inputMessage);
              }
            }}
          />
          <Button 
            size="sm" 
            onClick={() => handleSendMessage(inputMessage)}
            disabled={!inputMessage.trim() || isTyping}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-1 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => handleSendMessage('نظم العناصر الموجودة')}
          >
            <Wand2 className="w-3 h-3 mr-1" />
            تنظيم
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => handleSendMessage('اقترح أفكار جديدة')}
          >
            <Lightbulb className="w-3 h-3 mr-1" />
            أفكار
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => handleSendMessage('إنشاء جدول زمني')}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            جدولة
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};