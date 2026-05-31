/**
 * AIMenuDropdown - قائمة الذكاء الاصطناعي
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, LayoutGrid, Network, Calendar, Table2, Zap } from "lucide-react";
import type { SmartElementType } from "@/types/smart-elements";

// خيارات التحويل للعناصر الذكية
const TRANSFORM_OPTIONS = [
  { type: "kanban" as SmartElementType, label: "لوحة كانبان", icon: LayoutGrid, description: "تحويل إلى أعمدة ومهام" },
  { type: "mind_map" as SmartElementType, label: "خريطة ذهنية", icon: Network, description: "تنظيم كخريطة مترابطة" },
  { type: "timeline" as SmartElementType, label: "خط زمني", icon: Calendar, description: "ترتيب على محور زمني" },
  {
    type: "decisions_matrix" as SmartElementType,
    label: "مصفوفة قرارات",
    icon: Table2,
    description: "تقييم ومقارنة الخيارات",
  },
  { type: "brainstorming" as SmartElementType, label: "عصف ذهني", icon: Zap, description: "تجميع كأفكار للنقاش" },
];

interface AIMenuDropdownProps {
  isLoading: boolean;
  onQuickGenerate: () => void;
  onTransform: (type: SmartElementType) => void;
  onCustomTransform: (prompt: string) => void;
  selectedCount: number;
}

export const AIMenuDropdown: React.FC<AIMenuDropdownProps> = React.memo(({
  isLoading,
  onQuickGenerate,
  onTransform,
  onCustomTransform,
  selectedCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localPrompt, setLocalPrompt] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSubmit = () => {
    if (localPrompt.trim()) {
      onCustomTransform(localPrompt);
      setLocalPrompt("");
      setIsOpen(false);
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#3DBE8B] to-[#3DA8F5] hover:opacity-90 transition-opacity"
        title="الذكاء الاصطناعي"
      >
        {isLoading ? (
          <Loader2 size={16} className="text-white animate-spin" />
        ) : (
          <Sparkles size={16} className="text-white" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-[hsl(var(--border))] overflow-hidden z-[var(--z-popover)]"
          >
            <div className="p-2 border-b border-[hsl(var(--border))]">
              <button
                type="button"
                onClick={() => {
                  onQuickGenerate();
                  setIsOpen(false);
                }}
                disabled={isLoading}
                className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-white bg-gradient-to-r from-[#3DBE8B] to-[#3DA8F5] hover:opacity-90 rounded-lg disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                <span>إنشاء عنصر ذكي تلقائياً</span>
              </button>
            </div>

            <div className="p-2 space-y-1">
              <div className="text-[10px] text-[hsl(var(--ink-60))] px-2 py-1">تحويل إلى:</div>
              {TRANSFORM_OPTIONS.map((option) => (
                <button
                  key={option.type}
                  type="button"
                  onClick={() => {
                    onTransform(option.type);
                    setIsOpen(false);
                  }}
                  disabled={isLoading}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[hsl(var(--panel))] transition-colors text-right disabled:opacity-50"
                >
                  <span className="text-[#3DBE8B]">
                    <option.icon size={16} />
                  </span>
                  <div className="flex-1">
                    <div className="text-[12px] font-medium text-black">{option.label}</div>
                    <div className="text-[10px] text-[hsl(var(--ink-60))]">{option.description}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-2 border-t border-[hsl(var(--border))]">
              <div className="text-[10px] text-[hsl(var(--ink-60))] px-2 py-1 mb-1">تحويل مخصص:</div>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={localPrompt}
                  onChange={(e) => setLocalPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter" && !isLoading && localPrompt.trim()) {
                      handleSubmit();
                    }
                  }}
                  placeholder="وصف التحويل..."
                  className="flex-1 h-8 px-2 text-[11px] rounded-lg border border-[hsl(var(--border))] bg-white focus:outline-none focus:border-[#3DBE8B] placeholder:text-[hsl(var(--ink-30))]"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading || !localPrompt.trim()}
                  className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#3DBE8B] to-[#3DA8F5] text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                </button>
              </div>
            </div>

            <div className="px-3 py-2 border-t border-[hsl(var(--border))] text-[10px] text-[hsl(var(--ink-60))] text-center">
              {selectedCount} عنصر محدد
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

AIMenuDropdown.displayName = "AIMenuDropdown";
