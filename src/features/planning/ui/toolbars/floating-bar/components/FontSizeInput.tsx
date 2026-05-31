/**
 * FontSizeInput - إدخال حجم الخط مع قائمة منسدلة
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FONT_SIZES } from "../constants";

interface FontSizeInputProps {
  value: number;
  onChange: (value: number) => void;
}

const FontSizeInput: React.FC<FontSizeInputProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const [showTooltip, setShowTooltip] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const num = parseInt(inputValue);
    if (!isNaN(num) && num >= 8 && num <= 200) {
      onChange(num);
    } else {
      setInputValue(value.toString());
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInputBlur();
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex items-center gap-0.5">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          className="h-8 w-10 text-center rounded-md border border-[hsl(var(--border))] text-xs font-medium focus:outline-none focus:border-[hsl(var(--ink))]"
        />
        <button
          type="button"
          className="h-8 w-5 flex items-center justify-center rounded-md hover:bg-[hsl(var(--ink)/0.1)]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronDown className="h-3 w-3 opacity-60" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-[hsl(var(--border))] py-1 min-w-[60px] z-[var(--z-popover)] max-h-[200px] overflow-y-auto"
          >
            {FONT_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                className={`w-full text-center px-3 py-1 text-sm hover:bg-[hsl(var(--ink)/0.05)] ${
                  value === size ? "bg-[hsl(var(--ink)/0.1)]" : ""
                }`}
                onClick={() => {
                  onChange(size);
                  setIsOpen(false);
                }}
              >
                {size}
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
          حجم الخط
        </motion.div>
      )}
    </div>
  );
};

export default FontSizeInput;
