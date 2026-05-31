import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, FileText, Search, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface AIAssistantPopoverProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const AIAssistantPopover: React.FC<AIAssistantPopoverProps> = ({
  isOpen,
  onOpenChange,
  children
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Placeholder for AI integration
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'سيتم ربط هذه الوظيفة بنموذج الذكاء الصناعي قريبًا.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
    }, 1000);
  };

  const handleSmartAction = async (action: string) => {
    setIsProcessing(true);
    
    const systemMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `جاري تنفيذ: ${action}...`,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, systemMessage]);

    // Placeholder for AI integration
    setTimeout(() => {
      const resultMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `تم تجهيز البنية التحتية لـ "${action}". سيتم ربطها بالذكاء الصناعي لاحقًا.`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, resultMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        sideOffset={16}
        className="w-[420px] h-[560px] p-0 bg-white/90 backdrop-blur-[18px] rounded-[18px] border border-[#DADCE0] shadow-[0_1px_1px_rgba(0,0,0,0.04),0_12px_28px_rgba(0,0,0,0.10)] overflow-hidden"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#DADCE0]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3DBE8B] to-[#3DA8F5] flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-[#0B0F12]">مساعد الذكاء الصناعي</h3>
                <p className="text-[12px] text-[#0B0F12]/60">اسأل أو اختر إجراءً ذكيًا</p>
              </div>
            </div>
          </div>

          {/* Smart Action Buttons */}
          <div className="px-4 py-3 border-b border-[#DADCE0] bg-[#d9e7ed]/30">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSmartAction('مشروع ذكي')}
                disabled={isProcessing}
                className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-[#0B0F12] bg-white rounded-[10px] border border-[#DADCE0] hover:bg-[#d9e7ed]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Sparkles size={14} className="text-[#3DBE8B]" />
                مشروع ذكي
              </button>
              <button
                onClick={() => handleSmartAction('المراجعة والفحص')}
                disabled={isProcessing}
                className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-[#0B0F12] bg-white rounded-[10px] border border-[#DADCE0] hover:bg-[#d9e7ed]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Search size={14} className="text-[#3DA8F5]" />
                المراجعة والفحص
              </button>
              <button
                onClick={() => handleSmartAction('التنظيف')}
                disabled={isProcessing}
                className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-[#0B0F12] bg-white rounded-[10px] border border-[#DADCE0] hover:bg-[#d9e7ed]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Trash2 size={14} className="text-[#F6C445]" />
                التنظيف
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 rounded-full bg-[#d9e7ed]/50 flex items-center justify-center mb-4">
                  <Sparkles size={28} className="text-[#3DBE8B]" />
                </div>
                <h4 className="text-[14px] font-semibold text-[#0B0F12] mb-2">
                  مرحبًا بك في مساعد الذكاء الصناعي
                </h4>
                <p className="text-[12px] text-[#0B0F12]/60 leading-relaxed">
                  اسأل أي سؤال أو استخدم الأزرار الذكية أعلاه لتنفيذ إجراءات سريعة على مشروعك.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-[12px] ${
                        msg.role === 'user'
                          ? 'bg-[#3DBE8B] text-white'
                          : 'bg-[#d9e7ed] text-[#0B0F12]'
                      }`}
                    >
                      <p className="text-[13px] leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                      <p
                        className={`text-[10px] mt-1 ${
                          msg.role === 'user' ? 'text-white/70' : 'text-[#0B0F12]/60'
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString('ar-SA', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-[#d9e7ed] px-4 py-3 rounded-[12px]">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#3DBE8B] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-[#3DBE8B] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-[#3DBE8B] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-4 py-4 border-t border-[#DADCE0]">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="اكتب رسالتك هنا..."
                disabled={isProcessing}
                className="flex-1 resize-none px-4 py-3 text-[13px] text-[#0B0F12] bg-[#d9e7ed]/30 border border-[#DADCE0] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#3DBE8B]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                rows={2}
                style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isProcessing}
                className="w-11 h-11 flex items-center justify-center bg-[#3DBE8B] text-white rounded-[12px] hover:bg-[#3DBE8B]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
