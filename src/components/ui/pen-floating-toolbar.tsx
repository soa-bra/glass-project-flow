"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ChevronDown, Pen, Eraser } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import { ColorPickerInput } from "@/components/ui/color-picker";

interface PenFloatingToolbarProps {
  position: {
    x: number;
    y: number;
  };
  isVisible: boolean;
}


// أحجام الفرشاة
const BRUSH_SIZES = [1, 2, 4, 6, 8, 12, 16, 20];
interface ToolbarButtonProps {
  label: string;
  icon?: React.ComponentType<{
    className?: string;
  }>;
  children?: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  tooltip: string | null;
  showTooltip: (label: string) => void;
  hideTooltip: () => void;
}

const ToolbarButton = ({
  label,
  icon: Icon,
  children,
  isActive,
  onClick,
  tooltip,
  showTooltip,
  hideTooltip,
}: ToolbarButtonProps) => (
  <div className="relative" onMouseEnter={() => showTooltip(label)} onMouseLeave={hideTooltip}>
    <button
      className={`h-5 w-5 flex items-center justify-center rounded transition-colors duration-200 ${isActive ? "bg-[hsl(var(--ink))] text-white" : "hover:bg-[hsl(var(--ink)/0.1)]"} focus:outline-none`}
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
      {Icon ? <Icon className="h-3 w-3" /> : children}
    </button>
    <AnimatePresence>
      {tooltip === label && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.15 }}
          className="text-nowrap font-medium absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-[hsl(var(--ink))] text-white text-[10px] rounded px-1.5 py-0.5 shadow-lg z-[9999] pointer-events-none"
        >
          {label}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// Dropdown لحجم الفرشاة
const BrushSizeDropdown = ({
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

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => showTooltip("حجم الفرشاة")}
      onMouseLeave={hideTooltip}
    >
      <button
        className="h-5 px-1.5 flex items-center gap-1 rounded hover:bg-[hsl(var(--ink)/0.1)] transition-colors text-[10px] font-medium min-w-[40px] justify-between"
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
        <div className="flex items-center gap-1">
          <div
            className="rounded-full bg-[hsl(var(--ink))]"
            style={{
              width: Math.min(value, 8),
              height: Math.min(value, 8),
            }}
          />
          <span>{value}px</span>
        </div>
        <ChevronDown className="h-2.5 w-2.5 opacity-60" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-[hsl(var(--border))] py-1 min-w-[70px] z-[10000]"
          >
            {BRUSH_SIZES.map((size) => (
              <button
                key={size}
                className={`w-full flex items-center gap-2 px-2 py-1 text-[11px] hover:bg-[hsl(var(--ink)/0.05)] ${value === size ? "bg-[hsl(var(--ink)/0.1)]" : ""}`}
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
                <div
                  className="rounded-full bg-[hsl(var(--ink))]"
                  style={{
                    width: Math.min(size, 8),
                    height: Math.min(size, 8),
                  }}
                />
                <span>{size}px</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {tooltip === "حجم الفرشاة" && !isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-nowrap font-medium absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-[hsl(var(--ink))] text-white text-[10px] rounded px-1.5 py-0.5 shadow-lg z-[9999] pointer-events-none"
        >
          حجم الفرشاة
        </motion.div>
      )}
    </div>
  );
};

// Compact Color Picker for Toolbar
const CompactColorPicker = ({
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
  return (
    <div
      className="relative"
      onMouseEnter={() => showTooltip("لون الفرشاة")}
      onMouseLeave={hideTooltip}
    >
      <ColorPickerInput
        value={value}
        onChange={onChange}
        className="[&_button]:h-5 [&_button]:w-5 [&_button]:rounded [&_input]:hidden"
      />
      {tooltip === "لون الفرشاة" && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-nowrap font-medium absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-[hsl(var(--ink))] text-white text-[10px] rounded px-1.5 py-0.5 shadow-lg z-[9999] pointer-events-none"
        >
          لون الفرشاة
        </motion.div>
      )}
    </div>
  );
};
export const PenFloatingToolbar = ({ position, isVisible }: PenFloatingToolbarProps) => {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isEraserMode, setIsEraserMode] = useState(false);
  const { toolSettings, setPenSettings, toggleSmartMode, clearAllStrokes } = useCanvasStore();
  const penSettings = toolSettings.pen;
  const showTooltip = useCallback((label: string) => setTooltip(label), []);
  const hideTooltip = useCallback(() => setTooltip(null), []);

  // ثوابت الحجم والحدود
  const TOOLBAR_WIDTH = 280;
  const TOOLBAR_HEIGHT = 32;
  const PADDING = 16;
  const TOP_OFFSET = 60;
  const BOTTOM_OFFSET = 100;

  // حالة موضع السحب
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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

  // التحكم اليدوي في حدود السحب
  const handleDrag = useCallback(
    (event: any, info: { offset: { x: number; y: number } }) => {
      const minX = PADDING;
      const maxX = window.innerWidth - TOOLBAR_WIDTH - PADDING;
      const minY = TOP_OFFSET;
      const maxY = window.innerHeight - TOOLBAR_HEIGHT - BOTTOM_OFFSET;
      let newX = safePos.left + info.offset.x;
      let newY = safePos.top + info.offset.y;
      newX = Math.max(minX, Math.min(newX, maxX));
      newY = Math.max(minY, Math.min(newY, maxY));
      setDragOffset({
        x: newX - safePos.left,
        y: newY - safePos.top,
      });
    },
    [safePos.left, safePos.top],
  );

  const handleStrokeWidthChange = (width: number) => {
    setPenSettings({ strokeWidth: width });
  };

  const handleColorChange = (color: string) => {
    setPenSettings({ color });
  };

  const toggleEraserMode = () => {
    setIsEraserMode(!isEraserMode);
    setPenSettings({ eraserMode: !isEraserMode });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          drag
          dragMomentum={false}
          dragElastic={0}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          onDrag={handleDrag}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 400 }}
          className="fixed z-[9999] bg-white rounded-lg shadow-lg border border-[hsl(var(--border))] flex items-center gap-1 px-1.5 py-1 cursor-grab active:cursor-grabbing"
          style={{
            left: safePos.left,
            top: safePos.top,
            x: dragOffset.x,
            y: dragOffset.y,
          }}
          data-pen-floating-toolbar
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* حجم الفرشاة */}
          <BrushSizeDropdown
            value={penSettings.strokeWidth}
            onChange={handleStrokeWidthChange}
            tooltip={tooltip}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />

          {/* Divider */}
          <div className="w-px h-4 bg-[hsl(var(--border))]" />

          {/* لون الفرشاة */}
          <CompactColorPicker
            value={penSettings.color}
            onChange={handleColorChange}
            tooltip={tooltip}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />

          {/* Divider */}
          <div className="w-px h-4 bg-[hsl(var(--border))]" />

          {/* التبديل بين القلم والممحاة */}
          <ToolbarButton
            label="قلم"
            icon={Pen}
            isActive={!isEraserMode}
            onClick={() => {
              if (isEraserMode) toggleEraserMode();
            }}
            tooltip={tooltip}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />
          <ToolbarButton
            label="ممحاة"
            icon={Eraser}
            isActive={isEraserMode}
            onClick={() => {
              if (!isEraserMode) toggleEraserMode();
            }}
            tooltip={tooltip}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />

          {/* Divider */}
          <div className="w-px h-4 bg-[hsl(var(--border))]" />

          {/* مسح كل الرسومات */}
          <ToolbarButton
            label="مسح الكل"
            icon={Trash2}
            isActive={false}
            onClick={clearAllStrokes}
            tooltip={tooltip}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PenFloatingToolbar;
