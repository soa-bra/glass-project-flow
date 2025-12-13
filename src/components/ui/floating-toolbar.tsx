"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  RemoveFormatting,
  ChevronDown,
  Pilcrow,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";

// قائمة الخطوط المتاحة
const FONT_FAMILIES = [
  { value: 'IBM Plex Sans Arabic', label: 'IBM Plex Sans Arabic' },
  { value: 'Cairo', label: 'Cairo' },
  { value: 'Tajawal', label: 'Tajawal' },
  { value: 'Amiri', label: 'Amiri' },
  { value: 'Noto Sans Arabic', label: 'Noto Sans Arabic' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Times New Roman', label: 'Times New Roman' },
];

// أحجام الخطوط المتاحة
const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72];

interface FloatingToolbarProps {
  position: { x: number; y: number };
  onApplyFormat: (command: string, value?: string) => void;
  onToggleList: (listType: 'ul' | 'ol') => void;
  onRemoveFormatting: () => void;
  onAlignChange: (align: 'left' | 'center' | 'right') => void;
  onVerticalAlignChange: (align: 'flex-start' | 'center' | 'flex-end') => void;
  onDirectionChange: (direction: 'rtl' | 'ltr') => void;
  onFontFamilyChange: (fontFamily: string) => void;
  onFontSizeChange: (fontSize: number) => void;
  onColorChange: (color: string) => void;
  currentAlign?: 'left' | 'center' | 'right';
  currentVerticalAlign?: 'flex-start' | 'center' | 'flex-end';
  currentDirection?: 'rtl' | 'ltr';
  currentFontFamily?: string;
  currentFontSize?: number;
  currentColor?: string;
  isVisible: boolean;
}

interface ToolbarButtonProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  onClick: () => void;
  tooltip: string | null;
  showTooltip: (label: string) => void;
  hideTooltip: () => void;
}

const ToolbarButton = ({
  label,
  icon: Icon,
  isActive,
  onClick,
  tooltip,
  showTooltip,
  hideTooltip,
}: ToolbarButtonProps) => (
  <div
    className="relative"
    onMouseEnter={() => showTooltip(label)}
    onMouseLeave={hideTooltip}
  >
    <button
      className={`h-8 w-8 flex items-center justify-center rounded-md transition-colors duration-200 ${
        isActive 
          ? "bg-[hsl(var(--ink))] text-white" 
          : "hover:bg-[hsl(var(--ink)/0.1)]"
      } focus:outline-none`}
      aria-label={label}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      <Icon className="h-4 w-4" />
    </button>
    <AnimatePresence>
      {tooltip === label && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.15 }}
          className="text-nowrap font-medium absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-[hsl(var(--ink))] text-white text-xs rounded-md px-2 py-1 shadow-lg z-[9999] pointer-events-none"
        >
          {label}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// Dropdown للخطوط
const FontFamilyDropdown = ({
  value,
  onChange,
  tooltip,
  showTooltip,
  hideTooltip,
}: {
  value: string;
  onChange: (value: string) => void;
  tooltip: string | null;
  showTooltip: (label: string) => void;
  hideTooltip: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentFont = FONT_FAMILIES.find(f => f.value === value) || FONT_FAMILIES[0];

  return (
    <div 
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => showTooltip('نوع الخط')}
      onMouseLeave={hideTooltip}
    >
      <button
        className="h-8 px-2 flex items-center gap-1 rounded-md hover:bg-[hsl(var(--ink)/0.1)] transition-colors text-xs font-medium min-w-[100px] justify-between"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
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
            className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-[hsl(var(--border))] py-1 min-w-[150px] z-[10000] max-h-[200px] overflow-y-auto"
          >
            {FONT_FAMILIES.map((font) => (
              <button
                key={font.value}
                className={`w-full text-right px-3 py-1.5 text-sm hover:bg-[hsl(var(--ink)/0.05)] ${
                  value === font.value ? 'bg-[hsl(var(--ink)/0.1)]' : ''
                }`}
                style={{ fontFamily: font.value }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
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
      
      {tooltip === 'نوع الخط' && !isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-nowrap font-medium absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-[hsl(var(--ink))] text-white text-xs rounded-md px-2 py-1 shadow-lg z-[9999] pointer-events-none"
        >
          نوع الخط
        </motion.div>
      )}
    </div>
  );
};

// Input لحجم الخط
const FontSizeInput = ({
  value,
  onChange,
  tooltip,
  showTooltip,
  hideTooltip,
}: {
  value: number;
  onChange: (value: number) => void;
  tooltip: string | null;
  showTooltip: (label: string) => void;
  hideTooltip: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => showTooltip('حجم الخط')}
      onMouseLeave={hideTooltip}
    >
      <div className="flex items-center gap-0.5">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="h-8 w-10 text-center rounded-md border border-[hsl(var(--border))] text-xs font-medium focus:outline-none focus:border-[hsl(var(--ink))]"
        />
        <button
          className="h-8 w-5 flex items-center justify-center rounded-md hover:bg-[hsl(var(--ink)/0.1)]"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
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
            className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-[hsl(var(--border))] py-1 min-w-[60px] z-[10000] max-h-[200px] overflow-y-auto"
          >
            {FONT_SIZES.map((size) => (
              <button
                key={size}
                className={`w-full text-center px-3 py-1 text-sm hover:bg-[hsl(var(--ink)/0.05)] ${
                  value === size ? 'bg-[hsl(var(--ink)/0.1)]' : ''
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
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
      
      {tooltip === 'حجم الخط' && !isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-nowrap font-medium absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-[hsl(var(--ink))] text-white text-xs rounded-md px-2 py-1 shadow-lg z-[9999] pointer-events-none"
        >
          حجم الخط
        </motion.div>
      )}
    </div>
  );
};

// Color Picker
const ColorPicker = ({
  value,
  onChange,
  tooltip,
  showTooltip,
  hideTooltip,
}: {
  value: string;
  onChange: (value: string) => void;
  tooltip: string | null;
  showTooltip: (label: string) => void;
  hideTooltip: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div 
      className="relative"
      onMouseEnter={() => showTooltip('لون النص')}
      onMouseLeave={hideTooltip}
    >
      <button
        className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-[hsl(var(--ink)/0.1)] transition-colors"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          inputRef.current?.click();
        }}
      >
        <div 
          className="w-5 h-5 rounded border border-[hsl(var(--border))]"
          style={{ backgroundColor: value }}
        />
      </button>
      <input
        ref={inputRef}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute opacity-0 w-0 h-0"
      />
      
      {tooltip === 'لون النص' && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-nowrap font-medium absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-[hsl(var(--ink))] text-white text-xs rounded-md px-2 py-1 shadow-lg z-[9999] pointer-events-none"
        >
          لون النص
        </motion.div>
      )}
    </div>
  );
};

export const FloatingToolbar = ({
  position,
  onApplyFormat,
  onToggleList,
  onRemoveFormatting,
  onAlignChange,
  onVerticalAlignChange,
  onDirectionChange,
  onFontFamilyChange,
  onFontSizeChange,
  onColorChange,
  currentAlign = 'right',
  currentVerticalAlign = 'flex-start',
  currentDirection = 'rtl',
  currentFontFamily = 'IBM Plex Sans Arabic',
  currentFontSize = 16,
  currentColor = '#0B0F12',
  isVisible,
}: FloatingToolbarProps) => {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});

  const showTooltip = useCallback((label: string) => setTooltip(label), []);
  const hideTooltip = useCallback(() => setTooltip(null), []);

  // تتبع حالة التنسيقات النشطة
  useEffect(() => {
    const updateActiveFormats = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikeThrough: document.queryCommandState('strikeThrough'),
        insertUnorderedList: document.queryCommandState('insertUnorderedList'),
        insertOrderedList: document.queryCommandState('insertOrderedList'),
      });
    };

    document.addEventListener('selectionchange', updateActiveFormats);
    updateActiveFormats();

    return () => document.removeEventListener('selectionchange', updateActiveFormats);
  }, []);

  // مرجع لحدود السحب
  const constraintsRef = useRef<HTMLDivElement>(null);
  
  // ثوابت الحجم والحدود
  const TOOLBAR_WIDTH = 640;
  const TOOLBAR_HEIGHT = 50;
  const PADDING = 16;
  const TOP_OFFSET = 60;
  const BOTTOM_OFFSET = 100;
  
  // حساب الموضع الآمن داخل حدود النافذة
  const getSafePosition = useCallback(() => {
    const minX = PADDING;
    const maxX = window.innerWidth - TOOLBAR_WIDTH - PADDING;
    const minY = TOP_OFFSET;
    const maxY = window.innerHeight - TOOLBAR_HEIGHT - BOTTOM_OFFSET;
    
    const centeredX = position.x - TOOLBAR_WIDTH / 2;
    
    return {
      left: Math.max(minX, Math.min(centeredX, maxX)),
      top: Math.max(minY, Math.min(position.y, maxY)),
    };
  }, [position.x, position.y]);
  
  const safePos = getSafePosition();

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* عنصر الحدود - يحدد المنطقة المسموح بالسحب فيها */}
          <div
            ref={constraintsRef}
            style={{
              position: 'fixed',
              top: TOP_OFFSET,
              left: PADDING,
              width: window.innerWidth - PADDING * 2,
              height: window.innerHeight - TOP_OFFSET - BOTTOM_OFFSET,
              pointerEvents: 'none',
              zIndex: 9998,
            }}
          />
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={constraintsRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="fixed z-[9999] bg-white rounded-xl shadow-lg border border-[hsl(var(--border))] flex items-center gap-0.5 p-1 cursor-grab active:cursor-grabbing"
            style={{
              left: safePos.left,
              top: safePos.top,
              width: TOOLBAR_WIDTH,
            }}
            data-floating-toolbar
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
          >
          {/* Font Family */}
          <FontFamilyDropdown
            value={currentFontFamily}
            onChange={onFontFamilyChange}
            tooltip={tooltip}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />

          {/* Divider */}
          <div className="w-px h-6 bg-[hsl(var(--border))] mx-1" />

          {/* Font Size */}
          <FontSizeInput
            value={currentFontSize}
            onChange={onFontSizeChange}
            tooltip={tooltip}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />

          {/* Divider */}
          <div className="w-px h-6 bg-[hsl(var(--border))] mx-1" />

          {/* Text Color */}
          <ColorPicker
            value={currentColor}
            onChange={onColorChange}
            tooltip={tooltip}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />

          {/* Divider */}
          <div className="w-px h-6 bg-[hsl(var(--border))] mx-1" />

          {/* Text Formatting Section */}
          <ToolbarButton
            label="غامق"
            icon={Bold}
            isActive={activeFormats.bold || false}
            onClick={() => onApplyFormat('bold')}
            tooltip={tooltip}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />
          <ToolbarButton
            label="مائل"
            icon={Italic}
            isActive={activeFormats.italic || false}
            onClick={() => onApplyFormat('italic')}
            tooltip={tooltip}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />
          <ToolbarButton
            label="تسطير"
            icon={Underline}
            isActive={activeFormats.underline || false}
            onClick={() => onApplyFormat('underline')}
            tooltip={tooltip}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />
          <ToolbarButton
            label="يتوسطه خط"
            icon={Strikethrough}
            isActive={activeFormats.strikeThrough || false}
            onClick={() => onApplyFormat('strikeThrough')}
            tooltip={tooltip}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />

          {/* Divider */}
          <div className="w-px h-6 bg-[hsl(var(--border))] mx-1" />

          {/* Lists Section */}
          <ToolbarButton
            label="قائمة نقطية"
            icon={List}
            isActive={activeFormats.insertUnorderedList || false}
            onClick={() => onToggleList('ul')}
            tooltip={tooltip}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />
          <ToolbarButton
            label="قائمة مرقمة"
            icon={ListOrdered}
            isActive={activeFormats.insertOrderedList || false}
            onClick={() => onToggleList('ol')}
            tooltip={tooltip}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />

          {/* Divider */}
          <div className="w-px h-6 bg-[hsl(var(--border))] mx-1" />

          {/* Text Direction */}
          <ToolbarButton
            label={currentDirection === 'rtl' ? 'من اليمين لليسار' : 'من اليسار لليمين'}
            icon={Pilcrow}
            isActive={false}
            onClick={() => onDirectionChange(currentDirection === 'rtl' ? 'ltr' : 'rtl')}
            tooltip={tooltip}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />

          {/* Divider */}
          <div className="w-px h-6 bg-[hsl(var(--border))] mx-1" />

          {/* Text Alignment Section */}
          <ToolbarButton
            label="محاذاة يمين"
            icon={AlignRight}
            isActive={currentAlign === 'right'}
            onClick={() => onAlignChange('right')}
            tooltip={tooltip}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />
          <ToolbarButton
            label="محاذاة وسط"
            icon={AlignCenter}
            isActive={currentAlign === 'center'}
            onClick={() => onAlignChange('center')}
            tooltip={tooltip}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />
          <ToolbarButton
            label="محاذاة يسار"
            icon={AlignLeft}
            isActive={currentAlign === 'left'}
            onClick={() => onAlignChange('left')}
            tooltip={tooltip}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />

          {/* Divider */}
          <div className="w-px h-6 bg-[hsl(var(--border))] mx-1" />

          {/* Vertical Alignment Section */}
          <ToolbarButton
            label="محاذاة أعلى"
            icon={AlignVerticalJustifyStart}
            isActive={currentVerticalAlign === 'flex-start'}
            onClick={() => onVerticalAlignChange('flex-start')}
            tooltip={tooltip}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />
          <ToolbarButton
            label="محاذاة وسط عمودي"
            icon={AlignVerticalJustifyCenter}
            isActive={currentVerticalAlign === 'center'}
            onClick={() => onVerticalAlignChange('center')}
            tooltip={tooltip}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />
          <ToolbarButton
            label="محاذاة أسفل"
            icon={AlignVerticalJustifyEnd}
            isActive={currentVerticalAlign === 'flex-end'}
            onClick={() => onVerticalAlignChange('flex-end')}
            tooltip={tooltip}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />

          {/* Divider */}
          <div className="w-px h-6 bg-[hsl(var(--border))] mx-1" />

          {/* Remove Formatting */}
          <ToolbarButton
            label="إزالة التنسيق"
            icon={RemoveFormatting}
            isActive={false}
            onClick={onRemoveFormatting}
            tooltip={tooltip}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};