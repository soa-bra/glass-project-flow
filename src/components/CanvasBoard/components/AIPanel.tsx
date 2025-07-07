import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain,
  Search,
  Sparkles,
  Trash2,
  MessageSquare,
  Send,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface AIPanelProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

interface AIMessage {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export const AIPanel: React.FC<AIPanelProps> = ({
  isExpanded = false,
  onToggle
}) => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'ai',
      text: 'مرحباً! أنا مساعدك الذكي في لوحة التخطيط. يمكنني مساعدتك في تحليل وتطوير أفكارك.',
      timestamp: new Date()
    }
  ]);

  const quickCommands = [
    {
      id: 'complete',
      label: 'أكمل',
      description: 'أداة إنهاء العمل بذكاء',
      icon: <Sparkles className="w-4 h-4" />,
      action: () => handleQuickCommand('complete')
    },
    {
      id: 'analyze',
      label: 'حلل',
      description: 'أداة المراجعة الذكية',
      icon: <Search className="w-4 h-4" />,
      action: () => handleQuickCommand('analyze')
    },
    {
      id: 'cleanup',
      label: 'اختصر',
      description: 'أداة التنظيف الذكية',
      icon: <Trash2 className="w-4 h-4" />,
      action: () => handleQuickCommand('cleanup')
    }
  ];

  const handleQuickCommand = (command: string) => {
    let aiResponse = '';
    
    switch (command) {
      case 'complete':
        aiResponse = 'سأقوم بتحليل ما تم إنجازه حتى الآن وأكمل العمل بناءً على الأنماط والأهداف المحددة.';
        break;
      case 'analyze':
        aiResponse = 'سأقوم بتحليل التماسك بين العناصر واكتشاف الفجوات وتقديم توصيات للتحسين.';
        break;
      case 'cleanup':
        aiResponse = 'سأقوم بتحديد العناصر غير المرتبطة بالخطة الحالية وأقترح عزلها في كانفاس منفصل.';
        break;
    }

    const commandMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: `تنفيذ أمر: ${command}`,
      timestamp: new Date()
    };

    const responseMessage: AIMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      text: aiResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, commandMessage, responseMessage]);
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: chatInput.trim(),
      timestamp: new Date()
    };

    // Simulate AI response
    const aiResponse: AIMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      text: 'شكراً لك على رسالتك. سأقوم بتحليل طلبك وتقديم المساعدة المناسبة.',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
    setChatInput('');
  };

  return (
    <div className="fixed right-4 bottom-4 z-40 w-80">
      <Card className="bg-white/95 backdrop-blur-md shadow-lg border border-gray-300 rounded-[20px] overflow-hidden">
        <CardHeader className="pb-3 cursor-pointer" onClick={onToggle}>
          <CardTitle className="text-base font-arabic flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              حوار الذكاء الاصطناعي
            </div>
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </CardTitle>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="space-y-4">
            {/* Quick Commands */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">الأوامر السريعة</div>
              <div className="grid gap-2">
                {quickCommands.map((command) => (
                  <Button
                    key={command.id}
                    variant="outline"
                    size="sm"
                    onClick={command.action}
                    className="justify-start text-xs h-auto p-2"
                  >
                    <div className="flex items-center gap-2 w-full">
                      {command.icon}
                      <div className="text-right">
                        <div className="font-medium">{command.label}</div>
                        <div className="text-gray-500 text-xs">{command.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">محادثة تفاعلية</div>
              <ScrollArea className="h-40 border rounded p-3">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-2 text-xs ${
                          message.type === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="font-arabic">{message.text}</div>
                        <div className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString('ar-SA', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <Input
                placeholder="اكتب رسالتك للذكاء الاصطناعي..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 text-sm"
              />
              <Button size="sm" onClick={sendMessage} className="rounded-full px-3">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};