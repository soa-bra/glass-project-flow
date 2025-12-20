/**
 * UnifiedFloatingToolbar - شريط أدوات طافي موحد وتفاعلي
 * يدعم: العناصر الفردية، النصوص، الصور، والعناصر المتعددة
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useCanvasStore } from '@/stores/canvasStore';
import { useSmartElementsStore } from '@/stores/smartElementsStore';
import { useSmartElementAI } from '@/hooks/useSmartElementAI';
import { toast } from 'sonner';
import { Portal } from "@ark-ui/react/portal";
import { ColorPicker, parseColor } from "@ark-ui/react/color-picker";
import {
  Copy,
  Scissors,
  ClipboardPaste,
  Type,
  Layers,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  MoreVertical,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  MessageSquare,
  Sparkles,
  Files,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyEnd,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyEnd,
  List,
  ListOrdered,
  RemoveFormatting,
  Link,
  Crop,
  Replace,
  Group,
  Ungroup,
  ChevronDown,
  Plus,
  Loader2,
  LayoutGrid,
  Network,
  Calendar,
  Table2,
  Zap,
  Palette,
  PaintBucket,
  ArrowRightLeft,
  PipetteIcon,
} from 'lucide-react';
import { SmartElementType } from '@/types/smart-elements';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

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

type SelectionType = 'element' | 'text' | 'image' | 'multiple' | null;

// خيارات التحويل للعناصر الذكية
const TRANSFORM_OPTIONS = [
  { type: 'kanban' as SmartElementType, label: 'لوحة كانبان', icon: LayoutGrid, description: 'تحويل إلى أعمدة ومهام' },
  { type: 'mind_map' as SmartElementType, label: 'خريطة ذهنية', icon: Network, description: 'تنظيم كخريطة مترابطة' },
  { type: 'timeline' as SmartElementType, label: 'خط زمني', icon: Calendar, description: 'ترتيب على محور زمني' },
  { type: 'decisions_matrix' as SmartElementType, label: 'مصفوفة قرارات', icon: Table2, description: 'تقييم ومقارنة الخيارات' },
  { type: 'brainstorming' as SmartElementType, label: 'عصف ذهني', icon: Zap, description: 'تجميع كأفكار للنقاش' },
];

// ألوان preset
const UTILITY_COLORS = [
  { color: "transparent", label: "شفاف" },
  { color: "#000000", label: "أسود" },
  { color: "#FFFFFF", label: "أبيض" },
  { color: "#808080", label: "رمادي" },
];

const SUPRA_COLORS = [
  { color: "#3DBE8B", label: "أخضر" },
  { color: "#F6C445", label: "أصفر" },
  { color: "#E5564D", label: "أحمر" },
  { color: "#3DA8F5", label: "أزرق" },
];

// ===== Enhanced ToolbarButton with Tooltips =====
interface ToolbarButtonProps {
  icon: React.ReactNode | React.ComponentType<{ className?: string }>;
  onClick: (e: React.MouseEvent) => void;
  title: string;
  isActive?: boolean;
  variant?: 'default' | 'destructive' | 'ai';
  disabled?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  onClick,
  title,
  isActive = false,
  variant = 'default',
  disabled = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const baseClass = "flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed relative";
  
  const variantClasses = {
    default: isActive 
      ? "bg-[hsl(var(--ink))] text-white" 
      : "text-[hsl(var(--ink))] hover:bg-[hsl(var(--ink)/0.1)]",
    destructive: "text-[hsl(var(--ink))] hover:text-[#E5564D] hover:bg-red-50",
    ai: "bg-gradient-to-br from-[#3DBE8B] to-[#3DA8F5] text-white hover:opacity-90",
  };

  const renderIcon = () => {
    if (typeof icon === 'function') {
      const IconComponent = icon as React.ComponentType<{ className?: string }>;
      return <IconComponent className="h-4 w-4" />;
    }
    return icon;
  };

  return (
    <div
      className="relative pointer-events-auto"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onClick(e);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className={cn(baseClass, variantClasses[variant])}
        disabled={disabled}
      >
        {renderIcon()}
      </button>
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="text-nowrap font-medium absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-[hsl(var(--ink))] text-white text-xs rounded-md px-2 py-1 shadow-lg z-[9999] pointer-events-none"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ===== Color Picker Button using ark-ui ColorPicker =====
interface ColorButtonProps {
  value: string;
  onChange: (color: string) => void;
  icon: React.ReactNode;
  title: string;
}

const ColorButton: React.FC<ColorButtonProps> = ({ value, onChange, icon, title }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const safeValue = value && value !== "transparent" ? value : "#000000";

  const handleValueChange = (details: { value: any; valueAsString: string }) => {
    onChange(details.valueAsString);
  };

  const handlePresetClick = (color: string) => {
    onChange(color);
  };

  return (
    <div
      className="relative pointer-events-auto"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <ColorPicker.Root value={parseColor(safeValue)} onValueChange={handleValueChange}>
        <ColorPicker.Control>
          <ColorPicker.Trigger className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[hsl(var(--ink)/0.1)] transition-colors cursor-pointer pointer-events-auto">
            <div className="flex flex-col items-center justify-center gap-0.5">
              {icon}
              <div 
                className="w-4 h-1 rounded-sm border border-[hsl(var(--border))]"
                style={{ backgroundColor: value === 'transparent' ? 'transparent' : value }}
              />
            </div>
          </ColorPicker.Trigger>
        </ColorPicker.Control>
        
        <Portal>
          <ColorPicker.Positioner>
            <ColorPicker.Content className="bg-white border border-[hsl(var(--border))] rounded-lg p-4 shadow-lg space-y-4 z-[10001] w-72">
              {/* Color Area */}
              <ColorPicker.Area className="w-full h-32 rounded-md overflow-hidden relative">
                <ColorPicker.AreaBackground className="w-full h-full" />
                <ColorPicker.AreaThumb className="absolute w-4 h-4 bg-white border-2 border-white rounded-full shadow-md -translate-x-1/2 -translate-y-1/2" />
              </ColorPicker.Area>

              {/* Sliders */}
              <div className="flex items-center gap-3">
                {'EyeDropper' in window && (
                  <ColorPicker.EyeDropperTrigger className="p-2 text-[hsl(var(--ink-60))] hover:text-[hsl(var(--ink))] border border-[hsl(var(--border))] hover:bg-[hsl(var(--panel))] transition-colors rounded-lg cursor-pointer">
                    <PipetteIcon className="w-4 h-4" />
                  </ColorPicker.EyeDropperTrigger>
                )}

                <div className="flex-1 space-y-3">
                  <ColorPicker.ChannelSlider channel="hue" className="relative w-full h-2 flex items-center">
                    <ColorPicker.ChannelSliderTrack 
                      className="w-full h-2 rounded-full" 
                      style={{ background: "linear-gradient(to right, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000)" }}
                    />
                    <ColorPicker.ChannelSliderThumb className="absolute top-1/2 w-3 h-4 bg-white rounded-full -translate-y-1/2 -translate-x-1/2 border-2 border-white shadow-md" />
                  </ColorPicker.ChannelSlider>

                  <ColorPicker.ChannelSlider channel="alpha" className="relative w-full h-2 flex items-center">
                    <ColorPicker.TransparencyGrid className="w-full h-2 rounded-full [--size:6px]" />
                    <ColorPicker.ChannelSliderTrack className="absolute w-full h-2 rounded-full" />
                    <ColorPicker.ChannelSliderThumb className="absolute top-1/2 w-3 h-4 bg-white rounded-full -translate-y-1/2 -translate-x-1/2 border-2 border-white shadow-md" />
                  </ColorPicker.ChannelSlider>
                </div>
              </div>

              {/* Input */}
              <ColorPicker.ChannelInput 
                channel="hex" 
                className="w-full px-3 py-2 text-sm text-center border border-[hsl(var(--border))] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#3DBE8B]" 
              />

              {/* Presets */}
              <div className="flex gap-2 flex-wrap">
                {[...UTILITY_COLORS, ...SUPRA_COLORS].map(({ color, label }) => (
                  <button
                    key={color}
                    type="button"
                    title={label}
                    onClick={() => handlePresetClick(color)}
                    className={cn(
                      "w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform border-2",
                      value?.toLowerCase() === color.toLowerCase() ? "border-[hsl(var(--ink))]" : "border-[hsl(var(--border))]"
                    )}
                    style={{ 
                      backgroundColor: color === "transparent" ? undefined : color,
                      backgroundImage: color === "transparent" ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)" : undefined,
                      backgroundSize: "6px 6px",
                    }}
                  />
                ))}
              </div>
            </ColorPicker.Content>
          </ColorPicker.Positioner>
        </Portal>
        <ColorPicker.HiddenInput />
      </ColorPicker.Root>
      
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="text-nowrap font-medium absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-[hsl(var(--ink))] text-white text-xs rounded-md px-2 py-1 shadow-lg z-[9999] pointer-events-none"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ===== FontFamilyDropdown with Preview =====
const FontFamilyDropdown: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
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
            className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-[hsl(var(--border))] py-1 min-w-[150px] z-[10001] max-h-[200px] overflow-y-auto"
          >
            {FONT_FAMILIES.map((font) => (
              <button
                key={font.value}
                type="button"
                className={`w-full text-right px-3 py-1.5 text-sm hover:bg-[hsl(var(--ink)/0.05)] ${
                  value === font.value ? 'bg-[hsl(var(--ink)/0.1)]' : ''
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
          className="text-nowrap font-medium absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-[hsl(var(--ink))] text-white text-xs rounded-md px-2 py-1 shadow-lg z-[9999] pointer-events-none"
        >
          نوع الخط
        </motion.div>
      )}
    </div>
  );
};

// ===== FontSizeInput with Manual Input =====
const FontSizeInput: React.FC<{
  value: number;
  onChange: (value: number) => void;
}> = ({ value, onChange }) => {
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
            className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-[hsl(var(--border))] py-1 min-w-[60px] z-[10001] max-h-[200px] overflow-y-auto"
          >
            {FONT_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                className={`w-full text-center px-3 py-1 text-sm hover:bg-[hsl(var(--ink)/0.05)] ${
                  value === size ? 'bg-[hsl(var(--ink)/0.1)]' : ''
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
          className="text-nowrap font-medium absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-[hsl(var(--ink))] text-white text-xs rounded-md px-2 py-1 shadow-lg z-[9999] pointer-events-none"
        >
          حجم الخط
        </motion.div>
      )}
    </div>
  );
};

// ===== AI Menu Dropdown - Stable Component =====
const AIMenuDropdown: React.FC<{
  isLoading: boolean;
  onQuickGenerate: () => void;
  onTransform: (type: SmartElementType) => void;
  onCustomTransform: (prompt: string) => void;
  selectedCount: number;
}> = React.memo(({ isLoading, onQuickGenerate, onTransform, onCustomTransform, selectedCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localPrompt, setLocalPrompt] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSubmit = () => {
    if (localPrompt.trim()) {
      onCustomTransform(localPrompt);
      setLocalPrompt('');
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
            className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-[hsl(var(--border))] overflow-hidden z-[10001]"
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
                  <span className="text-[#3DBE8B]"><option.icon size={16} /></span>
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
                    if (e.key === 'Enter' && !isLoading && localPrompt.trim()) {
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

AIMenuDropdown.displayName = 'AIMenuDropdown';

const UnifiedFloatingToolbar: React.FC = () => {
  const {
    elements,
    selectedElementIds,
    updateElement,
    deleteElements,
    copyElements,
    cutElements,
    pasteElements,
    clipboard,
    groupElements,
    ungroupElements,
    alignElements,
    lockElements,
    unlockElements,
    duplicateElement,
    viewport,
    layers,
    addLayer,
    addElement,
    editingTextId,
  } = useCanvasStore();

  const { addSmartElement } = useSmartElementsStore();
  const { analyzeSelection, transformElements, isLoading: isAILoading } = useSmartElementAI();

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [imageName, setImageName] = useState('');
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});
  const [isTransforming, setIsTransforming] = useState(false);
  
  // حساب العناصر المحددة + العنصر الذي يتم تحريره
  const selectedElements = useMemo(
    () => elements.filter(el => selectedElementIds.includes(el.id)),
    [elements, selectedElementIds]
  );

  // العنصر النصي الذي يتم تحريره
  const editingElement = useMemo(
    () => editingTextId ? elements.find(el => el.id === editingTextId) : null,
    [elements, editingTextId]
  );

  // هل يوجد تحديد أو تحرير نص؟
  const hasSelection = selectedElements.length > 0 || !!editingTextId;
  
  // العناصر الفعلية للعمل معها (أولوية للنص الذي يتم تحريره)
  const activeElements = useMemo(() => {
    if (editingTextId && editingElement) {
      return [editingElement];
    }
    return selectedElements;
  }, [editingTextId, editingElement, selectedElements]);

  const firstElement = activeElements[0];
  const selectionCount = activeElements.length;

  // تحديد نوع التحديد (أولوية لتحرير النص)
  const selectionType = useMemo((): SelectionType => {
    // إذا كان هناك نص قيد التحرير
    if (editingTextId && editingElement) {
      const type = editingElement.type;
      if (type === 'text') return 'text';
      // sticky notes تعامل كنص
      if (type === 'shape' && editingElement.shapeType === 'sticky') return 'text';
    }
    
    if (!hasSelection) return null;
    if (selectionCount > 1) return 'multiple';
    
    const type = firstElement?.type;
    if (type === 'text') return 'text';
    if (type === 'image') return 'image';
    return 'element';
  }, [hasSelection, selectionCount, firstElement?.type, editingTextId, editingElement]);

  // حالات العناصر
  const groupId = useMemo(() => {
    for (const el of activeElements) {
      if (el.metadata?.groupId) return el.metadata.groupId as string;
    }
    return null;
  }, [activeElements]);

  const areElementsGrouped = !!groupId;
  const areElementsVisible = activeElements.every(el => el.visible !== false);
  const areElementsLocked = activeElements.some(el => el.locked === true);

  // تتبع حالة التنسيقات النشطة
  useEffect(() => {
    if (selectionType !== 'text') return;
    
    const updateActiveFormats = () => {
      try {
        setActiveFormats({
          bold: document.queryCommandState('bold'),
          italic: document.queryCommandState('italic'),
          underline: document.queryCommandState('underline'),
          strikeThrough: document.queryCommandState('strikeThrough'),
          insertUnorderedList: document.queryCommandState('insertUnorderedList'),
          insertOrderedList: document.queryCommandState('insertOrderedList'),
        });
      } catch (e) {
        // ignore queryCommandState errors
      }
    };

    document.addEventListener('selectionchange', updateActiveFormats);
    updateActiveFormats();

    return () => document.removeEventListener('selectionchange', updateActiveFormats);
  }, [selectionType]);

  // حساب موقع البار بناءً على عنصر DOM مباشرة (مثل TextEditor السابق)
  useEffect(() => {
    if (!hasSelection) return;
    
    const calculatePosition = () => {
      const targetId = editingTextId || (activeElements.length === 1 ? activeElements[0]?.id : null);
      
      if (targetId) {
        // محاولة الحصول على الـ DOM element مباشرة
        const domElement = document.querySelector(`[data-element-id="${targetId}"]`);
        if (domElement) {
          const rect = domElement.getBoundingClientRect();
          const newX = rect.left + rect.width / 2;
          const newY = Math.max(70, rect.top - 60);
          
          if (Math.abs(newX - position.x) > 2 || Math.abs(newY - position.y) > 2) {
            setPosition({ x: newX, y: newY });
          }
          return;
        }
      }
      
      // Fallback: حساب من بيانات العناصر
      if (activeElements.length === 0) return;
      
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      activeElements.forEach(el => {
        const x = el.position.x;
        const y = el.position.y;
        const width = el.size?.width || 200;
        const height = el.size?.height || 100;
        
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x + width > maxX) maxX = x + width;
        if (y + height > maxY) maxY = y + height;
      });
      
      const selectionCenterX = (minX + maxX) / 2;
      const screenCenterX = selectionCenterX * viewport.zoom + viewport.pan.x;
      const screenTopY = minY * viewport.zoom + viewport.pan.y - 60;
      
      const newX = screenCenterX;
      const newY = Math.max(70, screenTopY);
      
      if (Math.abs(newX - position.x) > 2 || Math.abs(newY - position.y) > 2) {
        setPosition({ x: newX, y: newY });
      }
    };
    
    calculatePosition();
    
    // تحديث الموقع عند تغير الـ viewport
    const interval = setInterval(calculatePosition, 100);
    return () => clearInterval(interval);
  }, [hasSelection, activeElements, editingTextId, viewport.zoom, viewport.pan.x, viewport.pan.y]);

  // تحديث اسم الصورة عند التحديد
  useEffect(() => {
    if (selectionType === 'image' && firstElement) {
      setImageName(firstElement.content || 'صورة');
    }
  }, [selectionType, firstElement]);

  // ===== دالة مساعدة لاستعادة الـ focus للمحرر =====
  const restoreEditorFocus = useCallback(() => {
    const editor = (window as any).__currentTextEditor;
    if (editor?.editorRef) {
      editor.editorRef.focus();
      return true;
    }
    return false;
  }, []);

  if (!hasSelection) return null;

  // ===== الإجراءات المشتركة =====
  const handleDuplicate = () => {
    selectedElementIds.forEach(id => duplicateElement(id));
    toast.success('تم تكرار العناصر');
  };

  const handleToggleVisibility = () => {
    selectedElementIds.forEach(id => {
      const current = elements.find(el => el.id === id);
      updateElement(id, { visible: current?.visible === false ? true : false });
    });
    toast.success(areElementsVisible ? 'تم إخفاء العناصر' : 'تم إظهار العناصر');
  };

  const handleToggleLock = () => {
    if (areElementsLocked) {
      unlockElements(selectedElementIds);
      toast.success('تم إلغاء قفل العناصر');
    } else {
      lockElements(selectedElementIds);
      toast.success('تم قفل العناصر');
    }
  };

  const handleComment = () => {
    toast.info('قريباً: إضافة تعليق');
  };

  const handleDelete = () => {
    deleteElements(selectedElementIds);
    toast.success('تم حذف العناصر');
  };

  // ===== وظائف الذكاء الاصطناعي =====
  const getSelectionContent = () => {
    return selectedElements.map(el => ({
      type: el.type,
      content: el.content || '',
      smartType: el.smartType,
      position: el.position,
    }));
  };

  const handleQuickGenerate = async () => {
    const content = getSelectionContent();
    const contentText = selectedElements.map(el => el.content || '').filter(Boolean).join('\n');
    const result = await analyzeSelection(content, `حلل هذه العناصر وأنشئ عنصر ذكي مناسب: ${contentText}`);
    if (result?.suggestions && result.suggestions.length > 0) {
      const suggestion = result.suggestions[0];
      if (suggestion.targetType) {
        await handleTransform(suggestion.targetType);
      }
    }
  };

  const handleTransform = async (targetType: SmartElementType) => {
    setIsTransforming(true);
    
    try {
      const content = getSelectionContent();
      const contentText = selectedElements.map(el => el.content || '').filter(Boolean).join('\n');
      const result = await transformElements(content, targetType, `حوّل هذه العناصر إلى ${targetType}: ${contentText}`);
      if (result?.elements && result.elements.length > 0) {
        const centerX = selectedElements.reduce((sum, el) => sum + (el.position?.x || 0), 0) / selectedElements.length;
        const centerY = selectedElements.reduce((sum, el) => sum + (el.position?.y || 0), 0) / selectedElements.length;
        result.elements.forEach((element, index) => {
          addSmartElement(element.type as SmartElementType, { x: centerX + index * 30, y: centerY + index * 30 }, element.data);
        });
        toast.success(`تم تحويل ${selectedElements.length} عنصر إلى ${TRANSFORM_OPTIONS.find(o => o.type === targetType)?.label}`);
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء التحويل');
    } finally {
      setIsTransforming(false);
    }
  };

  const handleCustomTransform = async (prompt: string) => {
    if (!prompt.trim()) {
      toast.error('يرجى إدخال وصف التحويل');
      return;
    }
    
    setIsTransforming(true);
    
    try {
      const content = getSelectionContent();
      const contentText = selectedElements.map(el => el.content || '').filter(Boolean).join('\n');
      const result = await analyzeSelection(content, `${prompt}: ${contentText}`);
      
      if (result?.suggestions && result.suggestions.length > 0) {
        const suggestion = result.suggestions[0];
        if (suggestion.targetType) {
          const transformResult = await transformElements(content, suggestion.targetType, `${prompt}: ${contentText}`);
          if (transformResult?.elements && transformResult.elements.length > 0) {
            const centerX = selectedElements.reduce((sum, el) => sum + (el.position?.x || 0), 0) / selectedElements.length;
            const centerY = selectedElements.reduce((sum, el) => sum + (el.position?.y || 0), 0) / selectedElements.length;
            transformResult.elements.forEach((element, index) => {
              addSmartElement(element.type as SmartElementType, { x: centerX + index * 30, y: centerY + index * 30 }, element.data);
            });
            toast.success('تم التحويل المخصص بنجاح');
          }
        }
      } else {
        toast.info('لم يتم العثور على تحويل مناسب');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء التحويل المخصص');
    } finally {
      setIsTransforming(false);
    }
  };

  const handleCopy = () => {
    copyElements(selectedElementIds);
    toast.success('تم نسخ العناصر');
  };

  const handleCut = () => {
    cutElements(selectedElementIds);
    toast.success('تم قص العناصر');
  };

  const handlePaste = () => {
    if (clipboard.length > 0) {
      pasteElements();
      toast.success('تم لصق العناصر');
    } else {
      toast.error('الحافظة فارغة');
    }
  };

  const handleAddText = () => {
    // حساب المركز من العناصر النشطة
    const centerX = activeElements.length > 0 
      ? activeElements.reduce((sum, el) => sum + (el.position.x + (el.size?.width || 200) / 2), 0) / activeElements.length 
      : 100;
    const maxY = activeElements.length > 0 
      ? Math.max(...activeElements.map(el => el.position.y + (el.size?.height || 100))) 
      : 50;
    
    addElement({
      type: 'text',
      position: { x: centerX, y: maxY + 50 },
      size: { width: 200, height: 40 },
      content: 'نص جديد',
      style: { fontSize: 16 },
    });
    toast.success('تم إضافة نص جديد');
  };

  const handleChangeLayer = (layerId: string) => {
    if (layerId === 'new') {
      const newLayerName = `طبقة ${layers.length + 1}`;
      addLayer(newLayerName);
      toast.success(`تم إنشاء ${newLayerName}`);
    } else {
      selectedElementIds.forEach(id => {
        updateElement(id, { layerId });
      });
      toast.success('تم نقل العناصر إلى الطبقة');
    }
  };

  const handleBringToFront = () => {
    const currentElements = useCanvasStore.getState().elements;
    const selectedSet = new Set(selectedElementIds);
    const selected = currentElements.filter(el => selectedSet.has(el.id));
    const others = currentElements.filter(el => !selectedSet.has(el.id));
    useCanvasStore.setState({ elements: [...others, ...selected] });
    toast.success('تم نقل العنصر للأمام');
  };

  const handleBringForward = () => {
    const currentElements = useCanvasStore.getState().elements;
    const newElements = [...currentElements];
    [...selectedElementIds].reverse().forEach(id => {
      const idx = newElements.findIndex(el => el.id === id);
      if (idx >= 0 && idx < newElements.length - 1) {
        [newElements[idx], newElements[idx + 1]] = [newElements[idx + 1], newElements[idx]];
      }
    });
    useCanvasStore.setState({ elements: newElements });
    toast.success('تم رفع العنصر');
  };

  const handleSendBackward = () => {
    const currentElements = useCanvasStore.getState().elements;
    const newElements = [...currentElements];
    selectedElementIds.forEach(id => {
      const idx = newElements.findIndex(el => el.id === id);
      if (idx > 0) {
        [newElements[idx], newElements[idx - 1]] = [newElements[idx - 1], newElements[idx]];
      }
    });
    useCanvasStore.setState({ elements: newElements });
    toast.success('تم خفض العنصر');
  };

  const handleSendToBack = () => {
    const currentElements = useCanvasStore.getState().elements;
    const selectedSet = new Set(selectedElementIds);
    const selected = currentElements.filter(el => selectedSet.has(el.id));
    const others = currentElements.filter(el => !selectedSet.has(el.id));
    useCanvasStore.setState({ elements: [...selected, ...others] });
    toast.success('تم نقل العنصر للخلف');
  };

  // ===== إجراءات النص =====

  // ===== إجراءات النص =====
  const handleTextFormat = (format: string) => {
    // أولاً: استعادة الـ focus للمحرر
    restoreEditorFocus();
    // ثم تنفيذ الأمر
    requestAnimationFrame(() => {
      document.execCommand(format, false);
    });
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    const targetIds = editingTextId ? [editingTextId] : selectedElementIds;
    targetIds.forEach(id => {
      const el = elements.find(e => e.id === id);
      if (el) {
        updateElement(id, { style: { ...el.style, fontFamily } });
      }
    });
  };

  const handleFontSizeChange = (fontSize: number) => {
    const targetIds = editingTextId ? [editingTextId] : selectedElementIds;
    targetIds.forEach(id => {
      const el = elements.find(e => e.id === id);
      if (el) {
        updateElement(id, { style: { ...el.style, fontSize } });
      }
    });
  };

  const handleColorChange = (color: string) => {
    const targetIds = editingTextId ? [editingTextId] : selectedElementIds;
    targetIds.forEach(id => {
      const el = elements.find(e => e.id === id);
      if (el) {
        updateElement(id, { style: { ...el.style, color } });
      }
    });
  };

  const handleTextAlign = (align: string) => {
    const targetIds = editingTextId ? [editingTextId] : selectedElementIds;
    targetIds.forEach(id => {
      const el = elements.find(e => e.id === id);
      if (el) {
        updateElement(id, { style: { ...el.style, textAlign: align } });
      }
    });
  };

  const handleVerticalAlign = (align: string) => {
    const targetIds = editingTextId ? [editingTextId] : selectedElementIds;
    targetIds.forEach(id => {
      const el = elements.find(e => e.id === id);
      if (el) {
        updateElement(id, { style: { ...el.style, alignItems: align } });
      }
    });
  };

  const handleTextDirection = (direction: 'rtl' | 'ltr') => {
    const targetIds = editingTextId ? [editingTextId] : selectedElementIds;
    targetIds.forEach(id => {
      const el = elements.find(e => e.id === id);
      if (el) {
        updateElement(id, { style: { ...el.style, direction } });
      }
    });
  };

  const handleClearFormatting = () => {
    restoreEditorFocus();
    requestAnimationFrame(() => {
      document.execCommand('removeFormat', false);
      toast.success('تم إزالة التنسيق');
    });
  };

  const handleAddLink = () => {
    const url = prompt('أدخل الرابط:');
    if (url) {
      restoreEditorFocus();
      requestAnimationFrame(() => {
        document.execCommand('createLink', false, url);
        toast.success('تم إضافة الرابط');
      });
    }
  };

  const handleToggleList = (listType: 'ul' | 'ol') => {
    restoreEditorFocus();
    requestAnimationFrame(() => {
      const command = listType === 'ul' ? 'insertUnorderedList' : 'insertOrderedList';
      document.execCommand(command, false);
    });
  };

  // ===== إجراءات الصور =====
  const handleImageRename = (name: string) => {
    setImageName(name);
    if (firstElement) {
      updateElement(firstElement.id, { content: name });
    }
  };

  const handleCrop = () => {
    toast.info('قريباً: أداة الكروب');
  };

  const handleReplaceImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && firstElement) {
        const reader = new FileReader();
        reader.onload = () => {
          updateElement(firstElement.id, { src: reader.result as string });
          toast.success('تم تبديل الصورة');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // ===== إجراءات التحديد المتعدد =====
  const handleHorizontalAlign = (align: 'right' | 'center' | 'left') => {
    alignElements(selectedElementIds, align);
    toast.success(`تمت المحاذاة ${align === 'right' ? 'لليمين' : align === 'center' ? 'للوسط' : 'لليسار'}`);
  };

  const handleVerticalAlignMultiple = (align: 'top' | 'middle' | 'bottom') => {
    alignElements(selectedElementIds, align);
    toast.success(`تمت المحاذاة ${align === 'top' ? 'للأعلى' : align === 'middle' ? 'للوسط' : 'للأسفل'}`);
  };

  const handleToggleGroup = () => {
    if (groupId) {
      ungroupElements(groupId);
      toast.success('تم فك التجميع');
    } else if (selectedElementIds.length > 1) {
      groupElements(selectedElementIds);
      toast.success('تم تجميع العناصر');
    } else {
      toast.error('حدد عنصرين أو أكثر للتجميع');
    }
  };

  // Get current text styles
  const currentFontFamily = firstElement?.style?.fontFamily || 'IBM Plex Sans Arabic';
  const currentFontSize = firstElement?.style?.fontSize || 16;
  const currentColor = firstElement?.style?.color || '#0B0F12';
  const currentAlign = (firstElement?.style?.textAlign as 'left' | 'center' | 'right' | 'justify') || 'right';
  const currentVerticalAlign = (firstElement?.style?.alignItems as 'flex-start' | 'center' | 'flex-end') || 'flex-start';
  const currentDirection = (firstElement?.style?.direction as 'rtl' | 'ltr') || 'rtl';

  // Element colors
  const currentBg = firstElement?.style?.backgroundColor || '#FFFFFF';
  const currentStroke = firstElement?.style?.borderColor || '#0B0F12';

  // ===== الأزرار المشتركة =====
  const CommonActions = () => (
    <>
      <ToolbarButton icon={<Files size={16} />} onClick={handleDuplicate} title="تكرار" />
      <ToolbarButton 
        icon={areElementsVisible ? <Eye size={16} /> : <EyeOff size={16} />} 
        onClick={handleToggleVisibility} 
        title={areElementsVisible ? 'إخفاء' : 'إظهار'}
        isActive={!areElementsVisible}
      />
      <ToolbarButton 
        icon={areElementsLocked ? <Lock size={16} /> : <Unlock size={16} />} 
        onClick={handleToggleLock} 
        title={areElementsLocked ? 'فك القفل' : 'قفل'}
        isActive={areElementsLocked}
      />
      <ToolbarButton icon={<MessageSquare size={16} />} onClick={handleComment} title="ترك تعليق" />
      <ToolbarButton icon={<Trash2 size={16} />} onClick={handleDelete} title="حذف" variant="destructive" />
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <AIMenuDropdown
        isLoading={isAILoading || isTransforming}
        onQuickGenerate={handleQuickGenerate}
        onTransform={handleTransform}
        onCustomTransform={handleCustomTransform}
        selectedCount={selectedElements.length}
      />
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            type="button" 
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-[hsl(var(--ink)/0.1)] text-[hsl(var(--ink))] pointer-events-auto"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <MoreVertical size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white z-[10001] pointer-events-auto" onMouseDown={(e) => e.stopPropagation()}>
          <DropdownMenuItem onClick={handleCopy}>
            <Copy size={14} className="ml-2" />
            نسخ
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCut}>
            <Scissors size={14} className="ml-2" />
            قص
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePaste} disabled={clipboard.length === 0}>
            <ClipboardPaste size={14} className="ml-2" />
            لصق
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleAddText}>
            <Type size={14} className="ml-2" />
            إضافة نص
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Layers size={14} className="ml-2" />
              تغيير الطبقة
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-white z-[10002]">
              {layers.map((layer) => (
                <DropdownMenuItem key={layer.id} onClick={() => handleChangeLayer(layer.id)}>
                  {layer.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleChangeLayer('new')}>
                <Plus size={14} className="ml-2" />
                طبقة جديدة
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleBringToFront}>
            <ChevronsUp size={14} className="ml-2" />
            إحضار إلى الأمام
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleBringForward}>
            <ArrowUp size={14} className="ml-2" />
            نقل خطوة إلى الأمام
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSendBackward}>
            <ArrowDown size={14} className="ml-2" />
            نقل خطوة إلى الخلف
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSendToBack}>
            <ChevronsDown size={14} className="ml-2" />
            إرسال إلى الخلف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );

  // ===== أزرار النص =====
  const TextActions = () => (
    <>
      <FontFamilyDropdown value={currentFontFamily} onChange={handleFontFamilyChange} />
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <FontSizeInput value={currentFontSize} onChange={handleFontSizeChange} />
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      {/* لون النص */}
      <ColorButton 
        value={currentColor} 
        onChange={handleColorChange}
        icon={<Type size={14} />}
        title="لون النص"
      />
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      {/* تنسيق النص */}
      <ToolbarButton icon={<Bold size={16} />} onClick={() => handleTextFormat('bold')} title="غامق" isActive={activeFormats.bold} />
      <ToolbarButton icon={<Italic size={16} />} onClick={() => handleTextFormat('italic')} title="مائل" isActive={activeFormats.italic} />
      <ToolbarButton icon={<Underline size={16} />} onClick={() => handleTextFormat('underline')} title="تسطير" isActive={activeFormats.underline} />
      <ToolbarButton icon={<Strikethrough size={16} />} onClick={() => handleTextFormat('strikeThrough')} title="يتوسطه خط" isActive={activeFormats.strikeThrough} />
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      {/* قوائم */}
      <ToolbarButton icon={<List size={16} />} onClick={() => handleToggleList('ul')} title="قائمة نقطية" isActive={activeFormats.insertUnorderedList} />
      <ToolbarButton icon={<ListOrdered size={16} />} onClick={() => handleToggleList('ol')} title="قائمة مرقمة" isActive={activeFormats.insertOrderedList} />
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      {/* اتجاه النص */}
      <ToolbarButton 
        icon={<ArrowRightLeft size={16} />} 
        onClick={() => handleTextDirection(currentDirection === 'rtl' ? 'ltr' : 'rtl')} 
        title={currentDirection === 'rtl' ? 'تبديل إلى LTR' : 'تبديل إلى RTL'} 
        isActive={currentDirection === 'ltr'}
      />
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      {/* محاذاة النص الأفقية */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-[hsl(var(--ink)/0.1)] text-[hsl(var(--ink))] pointer-events-auto" 
            title="محاذاة النص"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {currentAlign === 'right' && <AlignRight size={16} />}
            {currentAlign === 'center' && <AlignCenter size={16} />}
            {currentAlign === 'left' && <AlignLeft size={16} />}
            {currentAlign === 'justify' && <AlignJustify size={16} />}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white z-[10001] min-w-0 p-1 pointer-events-auto" onMouseDown={(e) => e.stopPropagation()}>
          <div className="flex gap-1">
            <button 
              type="button"
              onClick={() => handleTextAlign('right')} 
              className={cn("w-8 h-8 flex items-center justify-center rounded hover:bg-[hsl(var(--ink)/0.1)]", currentAlign === 'right' && "bg-[hsl(var(--ink)/0.1)]")}
            >
              <AlignRight size={16} />
            </button>
            <button 
              type="button"
              onClick={() => handleTextAlign('center')} 
              className={cn("w-8 h-8 flex items-center justify-center rounded hover:bg-[hsl(var(--ink)/0.1)]", currentAlign === 'center' && "bg-[hsl(var(--ink)/0.1)]")}
            >
              <AlignCenter size={16} />
            </button>
            <button 
              type="button"
              onClick={() => handleTextAlign('left')} 
              className={cn("w-8 h-8 flex items-center justify-center rounded hover:bg-[hsl(var(--ink)/0.1)]", currentAlign === 'left' && "bg-[hsl(var(--ink)/0.1)]")}
            >
              <AlignLeft size={16} />
            </button>
            <button 
              type="button"
              onClick={() => handleTextAlign('justify')} 
              className={cn("w-8 h-8 flex items-center justify-center rounded hover:bg-[hsl(var(--ink)/0.1)]", currentAlign === 'justify' && "bg-[hsl(var(--ink)/0.1)]")}
            >
              <AlignJustify size={16} />
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* المحاذاة الرأسية */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-[hsl(var(--ink)/0.1)] text-[hsl(var(--ink))] pointer-events-auto" 
            title="المحاذاة الرأسية"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {currentVerticalAlign === 'flex-start' && <AlignVerticalJustifyStart size={16} />}
            {currentVerticalAlign === 'center' && <AlignVerticalJustifyCenter size={16} />}
            {currentVerticalAlign === 'flex-end' && <AlignVerticalJustifyEnd size={16} />}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white z-[10001] min-w-0 p-1 pointer-events-auto" onMouseDown={(e) => e.stopPropagation()}>
          <div className="flex gap-1">
            <button 
              type="button"
              onClick={() => handleVerticalAlign('flex-start')} 
              className={cn("w-8 h-8 flex items-center justify-center rounded hover:bg-[hsl(var(--ink)/0.1)]", currentVerticalAlign === 'flex-start' && "bg-[hsl(var(--ink)/0.1)]")}
            >
              <AlignVerticalJustifyStart size={16} />
            </button>
            <button 
              type="button"
              onClick={() => handleVerticalAlign('center')} 
              className={cn("w-8 h-8 flex items-center justify-center rounded hover:bg-[hsl(var(--ink)/0.1)]", currentVerticalAlign === 'center' && "bg-[hsl(var(--ink)/0.1)]")}
            >
              <AlignVerticalJustifyCenter size={16} />
            </button>
            <button 
              type="button"
              onClick={() => handleVerticalAlign('flex-end')} 
              className={cn("w-8 h-8 flex items-center justify-center rounded hover:bg-[hsl(var(--ink)/0.1)]", currentVerticalAlign === 'flex-end' && "bg-[hsl(var(--ink)/0.1)]")}
            >
              <AlignVerticalJustifyEnd size={16} />
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <ToolbarButton icon={<RemoveFormatting size={16} />} onClick={handleClearFormatting} title="إزالة التنسيق" />
      <ToolbarButton icon={<Link size={16} />} onClick={handleAddLink} title="إضافة رابط" />
      
      <Separator orientation="vertical" className="h-6 mx-1" />
    </>
  );

  // ===== أزرار الصور =====
  const ImageActions = () => (
    <>
      <Input
        value={imageName}
        onChange={(e) => handleImageRename(e.target.value)}
        className="h-8 w-[120px] text-xs"
        placeholder="اسم الصورة"
      />
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <ToolbarButton icon={<Crop size={16} />} onClick={handleCrop} title="كروب" />
      <ToolbarButton icon={<Replace size={16} />} onClick={handleReplaceImage} title="تبديل الصورة" />
      <ToolbarButton icon={<Link size={16} />} onClick={handleAddLink} title="إضافة رابط" />
      
      <Separator orientation="vertical" className="h-6 mx-1" />
    </>
  );

  // ===== أزرار العنصر الفردي =====
  const ElementActions = () => {
    const handleBgColorChange = (color: string) => {
      selectedElementIds.forEach(id => {
        updateElement(id, { style: { ...firstElement?.style, backgroundColor: color } });
      });
    };
    
    const handleStrokeColorChange = (color: string) => {
      selectedElementIds.forEach(id => {
        updateElement(id, { style: { ...firstElement?.style, borderColor: color, borderWidth: 1, borderStyle: 'solid' } });
      });
    };
    
    return (
      <>
        <ColorButton 
          value={currentBg} 
          onChange={handleBgColorChange}
          icon={<PaintBucket size={14} />}
          title="لون التعبئة"
        />
        
        <ColorButton 
          value={currentStroke} 
          onChange={handleStrokeColorChange}
          icon={<Palette size={14} />}
          title="لون الحد"
        />
        
        <Separator orientation="vertical" className="h-6 mx-1" />
      </>
    );
  };

  // ===== أزرار التحديد المتعدد =====
  const MultipleActions = () => (
    <>
      <div className="flex items-center gap-1 px-2 py-1 bg-[hsl(var(--panel))] rounded-lg text-xs font-medium text-[hsl(var(--ink))]">
        <span>{selectionCount}</span>
        <span>عناصر محددة</span>
      </div>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-[hsl(var(--ink)/0.1)] text-[hsl(var(--ink))]" title="المحاذاة الأفقية">
            <AlignHorizontalJustifyCenter size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white z-[10001]">
          <DropdownMenuItem onClick={() => handleHorizontalAlign('right')}>
            <AlignHorizontalJustifyEnd size={14} className="ml-2" />
            محاذاة لليمين
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleHorizontalAlign('center')}>
            <AlignHorizontalJustifyCenter size={14} className="ml-2" />
            محاذاة للوسط
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleHorizontalAlign('left')}>
            <AlignHorizontalJustifyStart size={14} className="ml-2" />
            محاذاة لليسار
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-[hsl(var(--ink)/0.1)] text-[hsl(var(--ink))]" title="المحاذاة العمودية">
            <AlignVerticalJustifyCenter size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white z-[10001]">
          <DropdownMenuItem onClick={() => handleVerticalAlignMultiple('top')}>
            <AlignVerticalJustifyStart size={14} className="ml-2" />
            محاذاة للأعلى
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleVerticalAlignMultiple('middle')}>
            <AlignVerticalJustifyCenter size={14} className="ml-2" />
            محاذاة للوسط
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleVerticalAlignMultiple('bottom')}>
            <AlignVerticalJustifyEnd size={14} className="ml-2" />
            محاذاة للأسفل
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <ToolbarButton 
        icon={areElementsGrouped ? <Ungroup size={16} /> : <Group size={16} />} 
        onClick={handleToggleGroup} 
        title={areElementsGrouped ? 'فك التجميع' : 'تجميع'}
        isActive={areElementsGrouped}
      />
      
      <Separator orientation="vertical" className="h-6 mx-1" />
    </>
  );

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed z-[9999] pointer-events-auto"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translateX(-50%)'
      }}
      data-floating-toolbar
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-[hsl(var(--border))] p-1.5 pointer-events-auto">
        <div className="flex items-center gap-1 pointer-events-auto">
          {selectionType === 'element' && <ElementActions />}
          {selectionType === 'text' && <TextActions />}
          {selectionType === 'image' && <ImageActions />}
          {selectionType === 'multiple' && <MultipleActions />}
          
          <CommonActions />
        </div>
      </div>
    </motion.div>,
    document.body
  );
};

export default UnifiedFloatingToolbar;
