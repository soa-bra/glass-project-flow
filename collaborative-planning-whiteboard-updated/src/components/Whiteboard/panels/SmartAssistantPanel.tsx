import React, { useState } from 'react';
import { useWhiteboardStore } from '../../../store/whiteboard';

const SmartAssistantPanel: React.FC = () => {
  const { chat, addChatMessage } = useWhiteboardStore((state) => ({
    chat: state.chat,
    addChatMessage: state.addChatMessage,
  }));
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const content = input.trim();
    if (!content) return;
    setInput('');
    const id = Date.now().toString();
    addChatMessage({ id, content, role: 'user' });
    try {
      setLoading(true);
      const resp = await fetch('/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });
      const data = await resp.json();
      addChatMessage({
        id: Date.now().toString() + Math.random().toString(36).substring(2),
        content: data.reply ?? data.message ?? JSON.stringify(data),
        role: 'assistant',
      });
    } catch (err) {
      addChatMessage({
        id: Date.now().toString() + Math.random().toString(36).substring(2),
        content: 'حدث خطأ أثناء الاتصال بالمساعد.',
        role: 'assistant',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full w-full text-sm">
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {chat.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">ابدأ المحادثة مع المساعد الذكي.</p>
        )}
        {chat.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg max-w-[90%] ${msg.role === 'user' ? 'ml-auto bg-blue-500 text-white' : 'mr-auto bg-gray-200 dark:bg-gray-700 dark:text-gray-100'}`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="mr-auto p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
            جاري الكتابة...
          </div>
        )}
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 p-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          className="w-full resize-none p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
          placeholder="اكتب رسالتك هنا..."
        />
        <div className="flex justify-end mt-1">
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-3 py-1 rounded"
          >
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartAssistantPanel;