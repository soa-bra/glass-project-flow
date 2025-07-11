
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bot, Send, Lightbulb, Zap } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const AIAssistantPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'مرحباً! كيف يمكنني مساعدتك في تصميم وتطوير مشروعك؟',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'شكراً لسؤالك! أعمل على تحليل طلبك وسأقدم لك اقتراحات مفيدة قريباً.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInputText('');
  };

  const suggestions = [
    'إنشاء مخطط تدفق للمشروع',
    'تحسين تصميم الواجهة',
    'إضافة عناصر تفاعلية',
    'تحليل تجربة المستخدم'
  ];

  return (
    <Card className="w-full h-full bg-[#f2f9fb]/95 backdrop-blur-xl shadow-sm border border-white/20 rounded-[32px] overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2 text-black">
          <Bot className="w-5 h-5 text-[#96d8d0]" />
          المساعد الذكي
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col h-[calc(100%-4rem)]">
        {/* Messages Area */}
        <ScrollArea className="flex-1 mb-4">
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-[16px] ${
                  message.isUser 
                    ? 'bg-[#96d8d0] text-black' 
                    : 'bg-white border border-[#d1e1ea] text-black'
                }`}>
                  <p className="text-sm font-arabic">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Separator className="bg-[#d1e1ea] mb-4" />

        {/* Quick Suggestions */}
        <div className="mb-4">
          <h4 className="text-sm font-medium font-arabic mb-2 text-black">اقتراحات سريعة</h4>
          <div className="grid grid-cols-2 gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                onClick={() => setInputText(suggestion)}
                size="sm"
                variant="outline"
                className="text-xs font-arabic h-8 rounded-[12px] border-[#d1e1ea] text-black hover:bg-[#e9eff4]/50"
              >
                <Lightbulb className="w-3 h-3 mr-1" />
                {suggestion}
              </Button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="اكتب سؤالك هنا..."
            className="flex-1 font-arabic text-sm rounded-[16px] border-[#d1e1ea] text-black placeholder:text-black/50"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            size="sm"
            className="rounded-[16px] bg-[#96d8d0] hover:bg-[#96d8d0]/80 text-black border-none"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* AI Status */}
        <div className="mt-2 flex items-center justify-center">
          <div className="flex items-center gap-1 text-xs text-black/60">
            <Zap className="w-3 h-3 text-[#fbe2aa]" />
            <span className="font-arabic">مدعوم بالذكاء الاصطناعي</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
