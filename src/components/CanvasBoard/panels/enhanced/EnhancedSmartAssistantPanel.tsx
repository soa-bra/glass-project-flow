
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Search, Trash2, Send, Loader2 } from 'lucide-react';

interface SmartAssistantPanelProps {
  onSmartFinish?: () => void;
  onSmartReview?: () => void;
  onSmartCleanup?: () => void;
  onSendMessage?: (message: string) => void;
  isProcessing?: boolean;
}

const EnhancedSmartAssistantPanel: React.FC<SmartAssistantPanelProps> = ({
  onSmartFinish,
  onSmartReview,
  onSmartCleanup,
  onSendMessage,
  isProcessing = false
}) => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { type: 'assistant', content: 'مرحباً! كيف يمكنني مساعدتك في تطوير مخططك؟', timestamp: new Date() },
    { type: 'user', content: 'أريد إضافة خطة زمنية للمشروع', timestamp: new Date() },
    { type: 'assistant', content: 'سأساعدك في إنشاء خطة زمنية تفاعلية. هل تريد البدء بالمراحل الأساسية؟', timestamp: new Date() }
  ]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const newMessage = {
      type: 'user' as const,
      content: chatMessage,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, newMessage]);
    setChatMessage('');
    onSendMessage?.(chatMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-80 bg-[#f2f9fb] backdrop-blur-xl shadow-sm border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic text-[#000000]">
          المساعد الذكي
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Smart Action Buttons Row */}
        <div className="flex gap-2">
          <Button
            onClick={onSmartFinish}
            size="sm"
            className="flex-1 rounded-xl bg-[#96d8d0] hover:bg-[#7cc4bc] text-[#000000] font-arabic text-xs"
            disabled={isProcessing}
          >
            <Play className="w-3 h-3 ml-1" />
            إنهاء ذكي
          </Button>
          
          <Button
            onClick={onSmartReview}
            size="sm"
            className="flex-1 rounded-xl bg-[#a4e2f6] hover:bg-[#8dd5f1] text-[#000000] font-arabic text-xs"
            disabled={isProcessing}
          >
            <Search className="w-3 h-3 ml-1" />
            مراجعة ذكية
          </Button>
          
          <Button
            onClick={onSmartCleanup}
            size="sm"
            className="flex-1 rounded-xl bg-[#bdeed3] hover:bg-[#a5e6c7] text-[#000000] font-arabic text-xs"
            disabled={isProcessing}
          >
            <Trash2 className="w-3 h-3 ml-1" />
            تنظيف ذكي
          </Button>
        </div>

        {/* Interactive Chat Box */}
        <div className="bg-white/50 rounded-xl border border-white/30">
          <ScrollArea className="h-40 p-3">
            <div className="space-y-3">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-2 rounded-lg text-sm font-arabic ${
                      message.type === 'user'
                        ? 'bg-[#96d8d0] text-[#000000]'
                        : 'bg-white text-[#000000] border border-gray-200'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-white text-[#000000] border border-gray-200 p-2 rounded-lg">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Chat Input */}
          <div className="p-3 border-t border-white/30">
            <div className="flex gap-2">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="اكتب رسالتك..."
                className="flex-1 rounded-xl border-white/30 bg-white/50 text-[#000000] font-arabic text-sm"
                disabled={isProcessing}
              />
              <Button
                onClick={handleSendMessage}
                size="sm"
                className="rounded-xl bg-[#96d8d0] hover:bg-[#7cc4bc] text-[#000000]"
                disabled={isProcessing || !chatMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* AI Tips */}
        <div className="bg-[#e9eff4] p-3 rounded-xl border border-[#d1e1ea]">
          <div className="text-xs text-[#000000] font-arabic space-y-1">
            <div>💡 استخدم الأوامر الذكية لتسريع عملك</div>
            <div>🔍 المراجعة الذكية تكشف الفجوات والتحسينات</div>
            <div>🧹 التنظيف الذكي ينظم العناصر غير المترابطة</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedSmartAssistantPanel;
