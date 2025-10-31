import React, { useState } from "react";
import { Sparkles, Send, Wand2, Search, Trash2 } from "lucide-react";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="absolute bottom-4 left-1/2 translate-x-32 z-20">
      {/* AI Balloon */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-white/95 backdrop-blur-md border border-[hsl(var(--border))] rounded-2xl shadow-xl p-4 animate-scale-in">
          {/* Chat Messages Area */}
          <div className="h-64 overflow-y-auto mb-4 space-y-2">
            <div className="text-sm text-[hsl(var(--ink-60))] text-center py-4">
              كيف يمكنني مساعدتك في التخطيط؟
            </div>
          </div>

          {/* Input Area */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 px-3 py-2 border border-[hsl(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-green))]"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // Send message logic
                  setMessage("");
                }
              }}
            />
            <button
              className="p-2 bg-[hsl(var(--accent-green))] text-white rounded-lg hover:opacity-90 transition-opacity"
              onClick={() => {
                // Send message logic
                setMessage("");
              }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Smart Action Buttons */}
          <div className="space-y-2">
            <button className="w-full flex items-center gap-2 px-4 py-2 bg-[hsl(var(--panel))] hover:bg-[hsl(var(--ink-30))] rounded-lg transition-colors">
              <Wand2 className="w-4 h-4" />
              <span className="text-sm">مشروع ذكي</span>
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 bg-[hsl(var(--panel))] hover:bg-[hsl(var(--ink-30))] rounded-lg transition-colors">
              <Search className="w-4 h-4" />
              <span className="text-sm">المراجعة والفحص</span>
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 bg-[hsl(var(--panel))] hover:bg-[hsl(var(--ink-30))] rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">التنظيف</span>
            </button>
          </div>
        </div>
      )}

      {/* AI Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          p-3 rounded-full shadow-lg transition-all
          ${isOpen 
            ? 'bg-[hsl(var(--accent-green))] text-white' 
            : 'bg-white/90 hover:bg-white border border-[hsl(var(--border))]'
          }
        `}
        title="مساعد الذكاء الصناعي"
      >
        <Sparkles className="w-5 h-5" />
      </button>
    </div>
  );
}
