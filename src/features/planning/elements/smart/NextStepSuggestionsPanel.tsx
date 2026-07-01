/**
 * NextStepSuggestionsPanel
 *
 * لوحة عائمة تُفتح عند إفلات الأنكر في مساحة فارغة على الكانفاس.
 * توفّر:
 *   1) اقتراحات جاهزة للخطوة التالية (مهمة/قرار/مرحلة/تحقق/ملاحظة).
 *   2) صندوق "كتابة أمر" — يفتح محادثة صغيرة يكتب فيها المستخدم وصف الأداة
 *      المخصّصة فيولّدها الذكاء الاصطناعي داخل فريم واحد يحوي عناصر متكاملة.
 *   3) إلغاء.
 *
 * التصميم يتّبع design tokens الرسمية:
 *   - Glass modal (sb-modal-shell) للأسطح العائمة.
 *   - RTL-first مع dir="rtl".
 *   - ألوان AI = gradient from #3DBE8B to #3DA8F5 (نفس ألوان زر الذكاء الاصطناعي).
 *
 * @specRef planning.smart.next-step-suggestions
 */
import React, { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Sparkles, X, Send, CheckSquare, GitBranch, Milestone, StickyNote, HelpCircle } from 'lucide-react';

export type NextStepPreset =
  | 'task'
  | 'decision'
  | 'milestone'
  | 'note'
  | 'question';

export interface NextStepChoice {
  preset: NextStepPreset;
  label: string;
  description: string;
}

export interface NextStepSuggestionsPanelProps {
  /** إحداثيات الشاشة (viewport) لموقع الإفلات — يستخدم لتموضع اللوحة. */
  clientX: number;
  clientY: number;
  /** معرّف العنصر المصدر (الجذر). */
  sourceElementId: string;
  /** يُستدعى عند اختيار أحد الاقتراحات الجاهزة. */
  onPickPreset: (choice: NextStepChoice) => void;
  /** يُستدعى عند إرسال أمر مخصّص من صندوق المحادثة. */
  onSubmitCustomPrompt: (prompt: string) => void;
  /** يُستدعى عند الإغلاق / الإلغاء. */
  onClose: () => void;
}

const PRESETS: NextStepChoice[] = [
  { preset: 'task', label: 'مهمة', description: 'خطوة عمل تنفيذية' },
  { preset: 'decision', label: 'قرار', description: 'نقطة اختيار مسار' },
  { preset: 'milestone', label: 'مرحلة', description: 'معلَم مهم' },
  { preset: 'question', label: 'تحقّق', description: 'سؤال يحتاج إجابة' },
  { preset: 'note', label: 'ملاحظة', description: 'تعليق أو تنبيه' },
];

const PRESET_ICON: Record<NextStepPreset, React.ComponentType<{ size?: number; className?: string }>> = {
  task: CheckSquare,
  decision: GitBranch,
  milestone: Milestone,
  question: HelpCircle,
  note: StickyNote,
};

const PANEL_WIDTH = 320;
const PANEL_MAX_HEIGHT = 460;

export const NextStepSuggestionsPanel: React.FC<NextStepSuggestionsPanelProps> = ({
  clientX,
  clientY,
  onPickPreset,
  onSubmitCustomPrompt,
  onClose,
}) => {
  const [mode, setMode] = useState<'menu' | 'compose'>('menu');
  const [prompt, setPrompt] = useState('');
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Focus input when switching to compose
  useEffect(() => {
    if (mode === 'compose') inputRef.current?.focus();
  }, [mode]);

  // إغلاق على Escape أو نقرة خارج اللوحة
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onDown);
    };
  }, [onClose]);

  // تموضع مع مراعاة حواف النافذة
  const style: React.CSSProperties = React.useMemo(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 768;
    const left = Math.min(Math.max(8, clientX + 12), vw - PANEL_WIDTH - 8);
    const top = Math.min(Math.max(8, clientY + 12), vh - PANEL_MAX_HEIGHT - 8);
    return {
      position: 'fixed',
      left,
      top,
      width: PANEL_WIDTH,
      maxHeight: PANEL_MAX_HEIGHT,
      zIndex: 9999,
    };
  }, [clientX, clientY]);

  const handleSubmit = () => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    onSubmitCustomPrompt(trimmed);
  };

  return (
    <div
      ref={rootRef}
      dir="rtl"
      data-testid="next-step-panel"
      className="sb-modal-shell overflow-hidden flex flex-col"
      style={style}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/40">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center justify-center h-7 w-7 rounded-full text-white"
            style={{ backgroundImage: 'linear-gradient(135deg, #3DBE8B, #3DA8F5)' }}
          >
            <Sparkles size={14} />
          </span>
          <span className="text-[13px] font-semibold text-[#0B0F12]">الخطوة التالية</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md hover:bg-black/5 text-[#0B0F12]/70"
          aria-label="إغلاق"
        >
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      {mode === 'menu' && (
        <div className="p-2 overflow-y-auto">
          <ul className="flex flex-col gap-1">
            {PRESETS.map((choice) => {
              const Icon = PRESET_ICON[choice.preset];
              return (
                <li key={choice.preset}>
                  <button
                    type="button"
                    onClick={() => onPickPreset(choice)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/5 text-right transition-colors"
                  >
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white border border-[#DADCE0] text-[#0B0F12]">
                      <Icon size={16} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[13px] font-semibold text-[#0B0F12]">{choice.label}</span>
                      <span className="block text-[11px] text-[#0B0F12]/60">{choice.description}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-2 pt-2 border-t border-white/40">
            <button
              type="button"
              onClick={() => setMode('compose')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-full text-white text-[12px] font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundImage: 'linear-gradient(90deg, #3DBE8B, #3DA8F5)' }}
            >
              <Sparkles size={14} />
              كتابة أمر مخصّص
            </button>
          </div>
        </div>
      )}

      {mode === 'compose' && (
        <div className="p-3 flex flex-col gap-2">
          <label className="text-[11px] text-[#0B0F12]/70">
            صِف الأداة أو المجموعة التي تريد توليدها — سيتم إنشاؤها داخل فريم واحد كأداة موحّدة.
          </label>
          <textarea
            ref={inputRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            rows={4}
            placeholder="مثال: أداة مراجعة اسبوعية تتضمن هدف، قائمة مهام، وقرار مضي/إيقاف"
            className="w-full text-[12px] rounded-lg border border-[#DADCE0] bg-white/80 p-2 outline-none focus:ring-2 focus:ring-[#3DA8F5]/40 resize-none"
          />
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setMode('menu')}
              className="text-[12px] text-[#0B0F12]/70 hover:text-[#0B0F12]"
            >
              ← عودة
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!prompt.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[12px] font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
              style={{ backgroundImage: 'linear-gradient(90deg, #3DBE8B, #3DA8F5)' }}
            >
              <Send size={12} />
              توليد
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NextStepSuggestionsPanel;
