/**
 * FontFamilyDropdown - قائمة اختيار الخط مع معاينة
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FONT_FAMILIES } from "../constants";

interface FontFamilyDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const FontFamilyDropdown: React.FC<FontFamilyDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentFont = FONT_FAMILIES.find((f) => f.value === value) || FONT_FAMILIES[0];

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        type="button"
        className="h-8 px-2 flex items-center gap-1 rounded-md hover:bg-[hsl(var(--ink)/0.1)] transition-colors text-xs font-medium min-w-[100px] justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate max-w-[80px]" style={{ fontFamily: currentFont.value }}>
          {currentFont.label}
        </span>
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-[hsl(var(--border))] py-1 min-w-[150px] z-[var(--z-popover)] max-h-[200px] overflow-y-auto"
          >
            {FONT_FAMILIES.map((font) => (
              <button
                key={font.value}
                type="button"
                className={`w-full text-right px-3 py-1.5 text-sm hover:bg-[hsl(var(--ink)/0.05)] ${
                  value === font.value ? "bg-[hsl(var(--ink)/0.1)]" : ""
                }`}
                style={{ fontFamily: font.value }}
                onClick={() => {
                  onChange(font.value);
                  setIsOpen(false);
                }}
              >
                {font.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {showTooltip && !isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-nowrap font-medium absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-[hsl(var(--ink))] text-white text-xs rounded-md px-2 py-1 shadow-lg z-[var(--z-tooltip)] pointer-events-none"
        >
          نوع الخط
        </motion.div>
      )}
    </div>
  );
};

export default FontFamilyDropdown;
