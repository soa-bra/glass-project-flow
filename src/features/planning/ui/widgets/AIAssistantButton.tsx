import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { AIAssistantPopover } from './AIAssistantPopover';
import {
  BOTTOM_TOOLBAR_BUTTON_SIZE_PX,
  BOTTOM_TOOLBAR_GAP_PX,
  getBottomToolbarLayoutStyle,
  getBottomToolbarWidthPx,
} from '@/features/planning/ui/toolbars/bottomToolbarLayout';
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
 * - يستخدم متغيرات شريط الأدوات لحساب موضع مجاور بدون تعويضات يدوية
 * - Tooltip يشرح الوظيفة + الاختصار Cmd/Ctrl+K
 */
const FALLBACK_BOTTOM_TOOLBAR_ITEM_COUNT = 11;

export const AIAssistantButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="fixed bottom-3 z-50 -translate-x-1/2"
      style={{
        ...getBottomToolbarLayoutStyle(FALLBACK_BOTTOM_TOOLBAR_ITEM_COUNT),
        // محاذاة عمودية مع البار السفلي ووضعه ملاصقًا ليسار الـDock باستخدام نفس قياسات التول بار.
        left: `calc(50% - (var(--planning-bottom-toolbar-width, ${getBottomToolbarWidthPx(FALLBACK_BOTTOM_TOOLBAR_ITEM_COUNT)}px) / 2) - var(--planning-bottom-toolbar-adjacent-gap, ${BOTTOM_TOOLBAR_GAP_PX}px) - (var(--planning-bottom-toolbar-button-size, ${BOTTOM_TOOLBAR_BUTTON_SIZE_PX}px) / 2))`,
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
                className="group relative flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#3DBE8B] to-[#3DA8F5] text-white rounded-full shadow-[0_1px_1px_rgba(0,0,0,0.04),0_12px_28px_rgba(0,0,0,0.10)] hover:shadow-[0_1px_1px_rgba(0,0,0,0.06),0_16px_32px_rgba(0,0,0,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3DA8F5] focus-visible:ring-offset-2 transition-all duration-200"
              >
                <Sparkles size={16} className="animate-pulse" />
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
