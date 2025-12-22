/**
 * TextFloatingToolbar - شريط أدوات عائم للنص
 * Floating toolbar for text formatting
 */
import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Link2, Highlighter,
  Type, ChevronDown, Minus, Plus,
  ArrowLeftRight, Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TextFloatingToolbarProps {
  position: { x: number; y: number };
  visible: boolean;
  currentStyles: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    align?: 'left' | 'center' | 'right';
    direction?: 'rtl' | 'ltr';
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    highlightColor?: string;
  };
  onFormat: (command: string, value?: string) => void;
  onAlignChange: (align: 'left' | 'center' | 'right') => void;
  onDirectionChange: (direction: 'rtl' | 'ltr') => void;
  onFontSizeChange: (size: number) => void;
  onColorChange: (color: string) => void;
}

const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72];
const COLORS = [
  '#0B0F12', '#374151', '#6B7280', '#9CA3AF',
  '#E5564D', '#F6C445', '#3DBE8B', '#3DA8F5',
  '#8B5CF6', '#EC4899', '#F97316', '#14B8A6'
];

export const TextFloatingToolbar: React.FC<TextFloatingToolbarProps> = ({
  position,
  visible,
  currentStyles,
  onFormat,
  onAlignChange,
  onDirectionChange,
  onFontSizeChange,
  onColorChange
}) => {
  const [showFontSizes, setShowFontSizes] = React.useState(false);
  const [showColors, setShowColors] = React.useState(false);
  
  const handleFormat = useCallback((command: string) => {
    onFormat(command);
  }, [onFormat]);

  const ToolButton: React.FC<{
    active?: boolean;
    onClick: () => void;
    title: string;
    children: React.ReactNode;
  }> = ({ active, onClick, title, children }) => (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "w-7 h-7 flex items-center justify-center rounded-md transition-all",
        active 
          ? "bg-[hsl(var(--accent-blue))] text-white" 
          : "text-[hsl(var(--ink-60))] hover:text-[hsl(var(--ink))] hover:bg-[hsl(var(--muted))]"
      )}
    >
      {children}
    </button>
  );

  const Divider = () => (
    <div className="w-px h-5 bg-[hsl(var(--border))] mx-1" />
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            left: position.x,
            top: position.y,
            transform: 'translateX(-50%)',
            zIndex: 9999
          }}
          className="bg-white rounded-xl shadow-lg border border-[hsl(var(--border))] p-1.5 flex items-center gap-0.5"
          data-floating-toolbar
        >
          {/* تنسيق النص - Text Formatting */}
          <ToolButton 
            active={currentStyles.bold} 
            onClick={() => handleFormat('bold')}
            title="عريض (Ctrl+B)"
          >
            <Bold size={14} strokeWidth={2.5} />
          </ToolButton>
          
          <ToolButton 
            active={currentStyles.italic} 
            onClick={() => handleFormat('italic')}
            title="مائل (Ctrl+I)"
          >
            <Italic size={14} />
          </ToolButton>
          
          <ToolButton 
            active={currentStyles.underline} 
            onClick={() => handleFormat('underline')}
            title="تسطير (Ctrl+U)"
          >
            <Underline size={14} />
          </ToolButton>
          
          <ToolButton 
            active={currentStyles.strikethrough} 
            onClick={() => handleFormat('strikeThrough')}
            title="يتوسطه خط"
          >
            <Strikethrough size={14} />
          </ToolButton>

          <Divider />

          {/* حجم الخط - Font Size */}
          <div className="relative">
            <button
              onClick={() => setShowFontSizes(!showFontSizes)}
              className="h-7 px-2 flex items-center gap-1 rounded-md text-sm 
                text-[hsl(var(--ink-60))] hover:text-[hsl(var(--ink))] hover:bg-[hsl(var(--muted))]"
            >
              <span className="w-6 text-center">{currentStyles.fontSize || 16}</span>
              <ChevronDown size={12} />
            </button>
            
            {showFontSizes && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-1 left-1/2 -translate-x-1/2 
                  bg-white rounded-lg shadow-lg border border-[hsl(var(--border))] 
                  p-1 min-w-[80px] max-h-48 overflow-y-auto z-50"
              >
                {FONT_SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => {
                      onFontSizeChange(size);
                      setShowFontSizes(false);
                    }}
                    className={cn(
                      "w-full px-3 py-1.5 text-sm rounded-md text-right",
                      size === currentStyles.fontSize
                        ? "bg-[hsl(var(--accent-blue))] text-white"
                        : "hover:bg-[hsl(var(--muted))]"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          <div className="flex items-center">
            <button
              onClick={() => onFontSizeChange((currentStyles.fontSize || 16) - 2)}
              className="w-6 h-7 flex items-center justify-center text-[hsl(var(--ink-60))] hover:text-[hsl(var(--ink))]"
              title="تصغير الخط"
            >
              <Minus size={12} />
            </button>
            <button
              onClick={() => onFontSizeChange((currentStyles.fontSize || 16) + 2)}
              className="w-6 h-7 flex items-center justify-center text-[hsl(var(--ink-60))] hover:text-[hsl(var(--ink))]"
              title="تكبير الخط"
            >
              <Plus size={12} />
            </button>
          </div>

          <Divider />

          {/* المحاذاة - Alignment */}
          <ToolButton 
            active={currentStyles.align === 'right'} 
            onClick={() => onAlignChange('right')}
            title="محاذاة لليمين"
          >
            <AlignRight size={14} />
          </ToolButton>
          
          <ToolButton 
            active={currentStyles.align === 'center'} 
            onClick={() => onAlignChange('center')}
            title="توسيط"
          >
            <AlignCenter size={14} />
          </ToolButton>
          
          <ToolButton 
            active={currentStyles.align === 'left'} 
            onClick={() => onAlignChange('left')}
            title="محاذاة لليسار"
          >
            <AlignLeft size={14} />
          </ToolButton>

          <Divider />

          {/* الاتجاه - Direction */}
          <ToolButton 
            active={currentStyles.direction === 'rtl'} 
            onClick={() => onDirectionChange(currentStyles.direction === 'rtl' ? 'ltr' : 'rtl')}
            title="تبديل الاتجاه (RTL/LTR)"
          >
            <ArrowLeftRight size={14} />
          </ToolButton>

          <Divider />

          {/* القوائم - Lists */}
          <ToolButton 
            onClick={() => handleFormat('insertUnorderedList')}
            title="قائمة نقطية"
          >
            <List size={14} />
          </ToolButton>
          
          <ToolButton 
            onClick={() => handleFormat('insertOrderedList')}
            title="قائمة مرقمة"
          >
            <ListOrdered size={14} />
          </ToolButton>

          <Divider />

          {/* الألوان - Colors */}
          <div className="relative">
            <button
              onClick={() => setShowColors(!showColors)}
              className="w-7 h-7 flex items-center justify-center rounded-md 
                text-[hsl(var(--ink-60))] hover:text-[hsl(var(--ink))] hover:bg-[hsl(var(--muted))]"
              title="لون النص"
            >
              <div className="relative">
                <Type size={14} />
                <div 
                  className="absolute -bottom-0.5 left-0 right-0 h-1 rounded-full"
                  style={{ backgroundColor: currentStyles.color || '#0B0F12' }}
                />
              </div>
            </button>
            
            {showColors && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-1 right-0 
                  bg-white rounded-lg shadow-lg border border-[hsl(var(--border))] 
                  p-2 z-50"
              >
                <div className="grid grid-cols-4 gap-1.5">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        onColorChange(color);
                        setShowColors(false);
                      }}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
                        color === currentStyles.color ? "border-[hsl(var(--accent-blue))]" : "border-transparent"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* رابط - Link */}
          <ToolButton 
            onClick={() => {
              const url = prompt('أدخل الرابط:');
              if (url) handleFormat('createLink');
            }}
            title="إضافة رابط"
          >
            <Link2 size={14} />
          </ToolButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
