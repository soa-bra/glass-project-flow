import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { AIAssistantPopover } from './AIAssistantPopover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

/**
 * AIAssistantButton
 * زر الذكاء الصناعي العائم
 * - مثبّت أسفل الشاشة بمحاذاة بار الأدوات السفلي (bottom-3 مطابق للـDock)
 * - يحافظ على مسافة آمنة عبر `clamp` وهامش ديناميكي حتى لا يتداخل مع البار
 * - Tooltip يشرح الوظيفة + الاختصار Cmd/Ctrl+K
 */
export const AIAssistantButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="fixed bottom-3 left-1/2 z-50"
      style={{
        // محاذاة عمودية مع البار السفلي + مسافة آمنة ديناميكية على يساره
        transform: 'translateX(-50%)',
        marginLeft: 'clamp(-260px, -22vw, -180px)',
      }}
    >
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <AIAssistantPopover isOpen={isOpen} onOpenChange={setIsOpen}>
            <TooltipTrigger asChild>
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="مساعد الذكاء الصناعي"
                aria-keyshortcuts="Meta+K Control+K"
                className="group relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#3DBE8B] to-[#3DA8F5] text-white rounded-full shadow-[0_1px_1px_rgba(0,0,0,0.04),0_12px_28px_rgba(0,0,0,0.10)] hover:shadow-[0_1px_1px_rgba(0,0,0,0.06),0_16px_32px_rgba(0,0,0,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3DA8F5] focus-visible:ring-offset-2 transition-all duration-200"
              >
                <Sparkles size={18} className="animate-pulse" />
              </button>
            </TooltipTrigger>
          </AIAssistantPopover>

          <TooltipContent
            side="top"
            sideOffset={10}
            className="bg-[#0B0F12] text-white border-0 font-arabic"
            style={{ direction: 'rtl' }}
          >
            <div className="flex flex-col items-end gap-1">
              <span className="text-[13px] font-semibold leading-tight">
                مساعد الذكاء الصناعي
              </span>
              <span className="text-[11px] text-white/70 leading-tight">
                اطرح سؤالًا أو نفّذ إجراءً سريعًا
              </span>
              <span className="mt-1 text-[10px] font-medium text-white/80 bg-white/10 px-1.5 py-0.5 rounded-[4px]">
                Cmd / Ctrl + K
              </span>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
