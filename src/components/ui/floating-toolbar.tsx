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
  RemoveFormatting,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface FloatingToolbarProps {
  position: { x: number; y: number };
  onApplyFormat: (command: string, value?: string) => void;
  onToggleList: (listType: 'ul' | 'ol') => void;
  onRemoveFormatting: () => void;
  onAlignChange: (align: 'left' | 'center' | 'right') => void;
  currentAlign?: 'left' | 'center' | 'right';
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

export const FloatingToolbar = ({
  position,
  onApplyFormat,
  onToggleList,
  onRemoveFormatting,
  onAlignChange,
  currentAlign = 'right',
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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 400 }}
          className="fixed z-[9999] bg-white rounded-xl shadow-lg border border-[hsl(var(--border))] flex items-center gap-0.5 p-1"
          style={{
            left: position.x,
            top: position.y,
            transform: 'translateX(-50%)',
          }}
          data-floating-toolbar
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
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
      )}
    </AnimatePresence>
  );
};
