import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { AIAssistantPopover } from './AIAssistantPopover';
export const AIAssistantButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return <div className="fixed bottom-3 left-1/2 -translate-x-1/2 -ml-[320px] z-50">
      <AIAssistantPopover isOpen={isOpen} onOpenChange={setIsOpen}>
        <button onClick={() => setIsOpen(!isOpen)} className="group relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#3DBE8B] to-[#3DA8F5] text-white rounded-full shadow-[0_1px_1px_rgba(0,0,0,0.04),0_12px_28px_rgba(0,0,0,0.10)] hover:shadow-[0_1px_1px_rgba(0,0,0,0.06),0_16px_32px_rgba(0,0,0,0.15)] transition-all duration-200" title="مساعد الذكاء الصناعي (Cmd/Ctrl+K)">
          <Sparkles size={18} className="animate-pulse" />

          {/* Keyboard Shortcut Hint */}
          <span className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 bg-[#0B0F12] text-white text-[11px] font-medium px-2 py-1 rounded-[6px] whitespace-nowrap shadow-[0_8px_24px_rgba(0,0,0,0.24)]">
            Cmd/Ctrl+K
          </span>
        </button>
      </AIAssistantPopover>
    </div>;
};