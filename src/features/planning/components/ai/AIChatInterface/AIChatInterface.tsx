import React, { useState, useRef, useEffect } from 'react';
import { useAIStore } from '../../../store/ai.store';
import { AIChatMessage } from '../../../types/ai.types';

export const AIChatInterface: React.FC = () => {
  const { chatHistory, addChatMessage, isProcessing, setProcessing } = useAIStore();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: AIChatMessage = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: inputValue.trim(),
      timestamp: Date.now()
    };

    addChatMessage(userMessage);
    setInputValue('');
    setProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: AIChatMessage = {
        id: `ai_${Date.now()}`,
        type: 'assistant',
        content: `شكرًا لك على رسالتك: "${userMessage.content}". كيف يمكنني مساعدتك في تحسين لوحة التخطيط؟`,
        timestamp: Date.now()
      };
      
      addChatMessage(aiMessage);
      setProcessing(false);
    }, 1000 + Math.random() * 2000);
  };

  const quickActions = [
    { text: '🎯 تحليل اللوحة الحالية', action: 'analyze_board' },
    { text: '✨ اقترح تحسينات', action: 'suggest_improvements' },
    { text: '🔗 ربط العناصر ذكيًا', action: 'smart_connect' },
    { text: '📊 إنشاء مشروع من اللوحة', action: 'generate_project' }
  ];

  const handleQuickAction = (action: string, text: string) => {
    if (isProcessing) return;
    
    const userMessage: AIChatMessage = {
      id: `quick_${Date.now()}`,
      type: 'user',
      content: text,
      timestamp: Date.now()
    };

    addChatMessage(userMessage);
    setProcessing(true);

    // Simulate AI response based on action
    setTimeout(() => {
      let responseContent = '';
      
      switch (action) {
        case 'analyze_board':
          responseContent = '🔍 تحليل اللوحة...\n\nوجدت 5 عناصر في اللوحة الحالية. يمكنني اقتراح تحسينات في التنظيم والروابط بين العناصر.';
          break;
        case 'suggest_improvements':
          responseContent = '💡 اقتراحات التحسين:\n\n• إعادة ترتيب العناصر لتحسين التدفق\n• إضافة روابط بين المهام ذات الصلة\n• تجميع العناصر المتشابهة';
          break;
        case 'smart_connect':
          responseContent = '🔗 ربط ذكي للعناصر...\n\nتم تحديد 3 روابط محتملة بين العناصر. هل تريد تطبيقها؟';
          break;
        case 'generate_project':
          responseContent = '📊 إنشاء مشروع من اللوحة...\n\nيمكنني إنشاء مشروع متكامل مع المهام والجدول الزمني والفريق. هل تريد المتابعة؟';
          break;
        default:
          responseContent = 'كيف يمكنني مساعدتك؟';
      }
      
      const aiMessage: AIChatMessage = {
        id: `ai_quick_${Date.now()}`,
        type: 'assistant',
        content: responseContent,
        timestamp: Date.now()
      };
      
      addChatMessage(aiMessage);
      setProcessing(false);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 && (
          <div className="text-center text-black/60 mt-8">
            <div className="text-4xl mb-2">🤖</div>
            <p className="text-sm">مرحبًا! كيف يمكنني مساعدتك؟</p>
          </div>
        )}

        {chatHistory.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-black'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-60 mt-1">
                {new Date(message.timestamp).toLocaleTimeString('ar-SA', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-black p-3 rounded-2xl">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-black/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-black/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-black/40 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {chatHistory.length === 0 && (
        <div className="p-4 border-t border-black/10">
          <p className="text-xs text-black/60 mb-3">إجراءات سريعة:</p>
          <div className="space-y-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.action, action.text)}
                disabled={isProcessing}
                className="w-full text-right p-2 text-xs bg-transparent border border-black/10 rounded-xl hover:bg-black/5 transition-colors disabled:opacity-50"
              >
                {action.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-black/10">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="اكتب رسالتك..."
            disabled={isProcessing}
            className="flex-1 px-3 py-2 text-sm bg-transparent border border-black/10 rounded-xl focus:outline-none focus:border-black disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isProcessing}
            className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-black/80 transition-colors disabled:opacity-50"
          >
            إرسال
          </button>
        </form>
      </div>
    </div>
  );
};