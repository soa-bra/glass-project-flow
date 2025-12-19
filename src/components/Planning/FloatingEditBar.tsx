import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowUp, 
  ArrowDown,
  Sparkles,
  Lock,
  Unlock,
  Trash2,
  Eye,
  EyeOff,
  Group,
  Ungroup,
  AlignVerticalJustifyCenter,
  AlignHorizontalJustifyCenter,
  MoreHorizontal,
  Copy,
  Scissors,
  ClipboardPaste,
  PipetteIcon,
  Square
} from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';
import { Portal } from "@ark-ui/react/portal";
import { ColorPicker, parseColor } from "@ark-ui/react/color-picker";

// Utility colors
const UTILITY_COLORS = [
  { color: "transparent", label: "شفاف" },
  { color: "#000000", label: "أسود" },
  { color: "#FFFFFF", label: "أبيض" },
  { color: "#808080", label: "رمادي" },
];

// Supra brand colors
const SUPRA_COLORS = [
  { color: "#3DBE8B", label: "أخضر" },
  { color: "#F6C445", label: "أصفر" },
  { color: "#E5564D", label: "أحمر" },
  { color: "#3DA8F5", label: "أزرق" },
];

const RECENT_COLORS_KEY = "supra-floating-bar-recent-colors";
const MAX_RECENT_COLORS = 6;

const getRecentColors = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(RECENT_COLORS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const addRecentColor = (color: string) => {
  if (typeof window === "undefined") return;
  if (color === "transparent" || !color) return;
  try {
    const recent = getRecentColors();
    const filtered = recent.filter((c) => c.toLowerCase() !== color.toLowerCase());
    const updated = [color, ...filtered].slice(0, MAX_RECENT_COLORS);
    localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
};

const FloatingEditBar: React.FC = () => {
  const { 
    elements, 
    selectedElementIds, 
    updateElement 
  } = useCanvasStore();
  
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [colorMode, setColorMode] = useState<'fill' | 'stroke'>('fill');
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isGrouped, setIsGrouped] = useState(false);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  
  useEffect(() => {
    setRecentColors(getRecentColors());
  }, []);
  
  const selectedElements = useMemo(
    () => elements.filter(el => selectedElementIds.includes(el.id)),
    [elements, selectedElementIds]
  );
  const hasSelection = selectedElements.length > 0;
  const firstElement = selectedElements[0];
  
  useEffect(() => {
    if (!hasSelection) return;
    
    let minX = Infinity, minY = Infinity, maxX = -Infinity;
    selectedElements.forEach(el => {
      if (el.position.x < minX) minX = el.position.x;
      if (el.position.y < minY) minY = el.position.y;
      if (el.position.x + (el.size?.width || 200) > maxX) maxX = el.position.x + (el.size?.width || 200);
    });
    
    setPosition({ 
      x: (minX + maxX) / 2, 
      y: minY - 60
    });
  }, [selectedElementIds, hasSelection, selectedElements]);
  
  if (!hasSelection) return null;

  const currentFillColor = firstElement?.style?.backgroundColor || '#FFFFFF';
  const currentStrokeColor = firstElement?.style?.borderColor || '#000000';
  const currentColor = colorMode === 'fill' ? currentFillColor : currentStrokeColor;
  const safeColor = currentColor && currentColor !== "transparent" ? currentColor : "#000000";
  
  const handleColorChange = (details: { value: any; valueAsString: string }) => {
    const hex = details.valueAsString;
    if (colorMode === 'fill') {
      selectedElementIds.forEach(id => {
        updateElement(id, {
          style: {
            ...elements.find(el => el.id === id)?.style,
            backgroundColor: hex
          }
        });
      });
    } else {
      selectedElementIds.forEach(id => {
        updateElement(id, {
          style: {
            ...elements.find(el => el.id === id)?.style,
            borderColor: hex
          }
        });
      });
    }
    addRecentColor(hex);
    setRecentColors(getRecentColors());
  };

  const handlePresetClick = (color: string) => {
    if (colorMode === 'fill') {
      selectedElementIds.forEach(id => {
        updateElement(id, {
          style: {
            ...elements.find(el => el.id === id)?.style,
            backgroundColor: color
          }
        });
      });
    } else {
      selectedElementIds.forEach(id => {
        updateElement(id, {
          style: {
            ...elements.find(el => el.id === id)?.style,
            borderColor: color
          }
        });
      });
    }
    if (color !== "transparent") {
      addRecentColor(color);
      setRecentColors(getRecentColors());
    }
  };
  
  const toggleLock = () => {
    selectedElementIds.forEach(id => {
      const current = elements.find(el => el.id === id);
      updateElement(id, { locked: !current?.locked });
    });
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const toggleGroup = () => {
    setIsGrouped(!isGrouped);
  };

  const btnClass = `
    flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
    text-black hover:bg-[hsl(var(--panel))]
    focus:outline-none
  `;

  const separatorClass = "w-px h-6 bg-[hsl(var(--border))]";
  
  return (
    <div 
      className="fixed z-50 pointer-events-auto"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translateX(-50%)'
      }}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-[hsl(var(--border))] p-1.5">
        <div className="flex items-center gap-1">
          
          {/* More Menu (3 dots) */}
          <div className="relative">
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className={btnClass}
              title="المزيد"
            >
              <MoreHorizontal size={16} />
            </button>
            
            {isMoreMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsMoreMenuOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-[hsl(var(--border))] p-1.5 z-50">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-black hover:bg-[hsl(var(--panel))] rounded-lg">
                    <Copy size={14} />
                    <span>نسخ</span>
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-black hover:bg-[hsl(var(--panel))] rounded-lg">
                    <Scissors size={14} />
                    <span>قص</span>
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-black hover:bg-[hsl(var(--panel))] rounded-lg">
                    <ClipboardPaste size={14} />
                    <span>لصق</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <div className={separatorClass} />

          {/* Color Picker with Fill/Stroke using Ark UI */}
          <div className="relative">
            <button
              onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
              className={`${btnClass} relative`}
              title="الألوان"
            >
              {/* Stroke color box (back) */}
              <div 
                className="absolute w-4 h-4 rounded border-2 border-white"
                style={{ 
                  backgroundColor: currentStrokeColor,
                  top: '10px',
                  right: '10px'
                }}
              />
              {/* Fill color box (front) */}
              <div 
                className="absolute w-4 h-4 rounded border border-[hsl(var(--border))]"
                style={{ 
                  backgroundColor: currentFillColor,
                  top: '6px',
                  right: '14px'
                }}
              />
            </button>
            
            {isColorPickerOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsColorPickerOpen(false)} />
                <div className="absolute top-full right-0 mt-2 p-3 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-[hsl(var(--border))] z-50 min-w-[280px]">
                  {/* Fill/Stroke Toggle */}
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => setColorMode('fill')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] flex-1 justify-center ${
                        colorMode === 'fill' 
                          ? 'bg-[hsl(var(--ink))] text-white' 
                          : 'bg-[hsl(var(--panel))] text-black'
                      }`}
                    >
                      <div 
                        className="w-4 h-4 rounded border border-white/50"
                        style={{ backgroundColor: currentFillColor }}
                      />
                      <span>التعبئة</span>
                    </button>
                    <button
                      onClick={() => setColorMode('stroke')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] flex-1 justify-center ${
                        colorMode === 'stroke' 
                          ? 'bg-[hsl(var(--ink))] text-white' 
                          : 'bg-[hsl(var(--panel))] text-black'
                      }`}
                    >
                      <Square size={14} style={{ color: currentStrokeColor }} />
                      <span>الحد</span>
                    </button>
                  </div>
                  
                  {/* Ark UI Color Picker */}
                  <ColorPicker.Root value={parseColor(safeColor)} onValueChange={handleColorChange}>
                    <div className="space-y-3">
                      {/* Color Area */}
                      <ColorPicker.Area className="w-full h-32 rounded-md overflow-hidden relative">
                        <ColorPicker.AreaBackground className="w-full h-full" />
                        <ColorPicker.AreaThumb className="absolute w-3 h-3 bg-white border-2 border-white rounded-full shadow-sm -translate-x-1/2 -translate-y-1/2" />
                      </ColorPicker.Area>

                      {/* Eye Dropper and Sliders */}
                      <div className="flex items-center gap-3">
                        <ColorPicker.EyeDropperTrigger className="p-2 text-[hsl(var(--ink-60))] hover:text-[hsl(var(--ink))] border border-[hsl(var(--border))] hover:bg-[hsl(var(--panel))] transition-colors rounded-lg">
                          <PipetteIcon className="w-4 h-4" />
                        </ColorPicker.EyeDropperTrigger>

                        <div className="flex-1 space-y-2">
                          {/* Hue Slider */}
                          <ColorPicker.ChannelSlider channel="hue" className="relative w-full h-2 flex items-center">
                            <ColorPicker.ChannelSliderTrack
                              className="w-full h-2 rounded-full"
                              style={{
                                background: "linear-gradient(to right, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000)",
                              }}
                            />
                            <ColorPicker.ChannelSliderThumb className="absolute top-1/2 w-3 h-4 bg-current rounded-full -translate-y-1/2 -translate-x-1/2 border-2 border-white shadow-md" />
                          </ColorPicker.ChannelSlider>

                          {/* Alpha Slider */}
                          <ColorPicker.ChannelSlider channel="alpha" className="relative w-full h-2 flex items-center">
                            <ColorPicker.TransparencyGrid className="w-full h-2 rounded-full [--size:6px]" />
                            <ColorPicker.ChannelSliderTrack className="w-full h-2 rounded-full" />
                            <ColorPicker.ChannelSliderThumb className="absolute top-1/2 w-3 h-4 bg-current rounded-full -translate-y-1/2 -translate-x-1/2 border-2 border-white shadow-md" />
                          </ColorPicker.ChannelSlider>
                        </div>
                      </div>

                      {/* Input Fields */}
                      <div className="flex gap-2">
                        <ColorPicker.ChannelInput
                          channel="hex"
                          className="flex-1 text-sm text-center border border-[hsl(var(--border))] rounded-lg bg-transparent text-black focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-blue))] py-1.5 px-3"
                        />
                        <ColorPicker.ChannelInput
                          channel="alpha"
                          className="w-16 text-sm text-center border border-[hsl(var(--border))] rounded-lg bg-transparent text-black focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-blue))] py-1.5 px-2"
                        />
                      </div>

                      {/* Utility Colors */}
                      <div className="flex justify-start gap-2">
                        {UTILITY_COLORS.map(({ color, label }) => {
                          const isSelected = currentColor?.toLowerCase() === color.toLowerCase();
                          return (
                            <button
                              key={color}
                              type="button"
                              title={label}
                              onClick={() => handlePresetClick(color)}
                              className="w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform relative overflow-hidden flex items-center justify-center"
                              style={{
                                backgroundColor: color === "transparent" ? undefined : color,
                                border: "2px solid #E0E0E0",
                              }}
                            >
                              {color === "transparent" && (
                                <div
                                  className="absolute inset-0 rounded-full"
                                  style={{
                                    backgroundImage:
                                      "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                                    backgroundSize: "4px 4px",
                                    backgroundPosition: "0 0, 0 2px, 2px -2px, -2px 0px",
                                  }}
                                />
                              )}
                              {isSelected && (
                                <div className="w-1.5 h-1.5 rounded-full z-10 bg-white" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Supra Brand Colors */}
                      <div className="flex justify-start gap-2">
                        {SUPRA_COLORS.map(({ color, label }) => {
                          const isSelected = currentColor?.toLowerCase() === color.toLowerCase();
                          return (
                            <button
                              key={color}
                              type="button"
                              title={label}
                              onClick={() => handlePresetClick(color)}
                              className="w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform flex items-center justify-center"
                              style={{
                                backgroundColor: color,
                                border: "2px solid #E0E0E0",
                              }}
                            >
                              {isSelected && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Recent Colors */}
                      {recentColors.length > 0 && (
                        <div className="flex justify-start gap-2">
                          {recentColors.map((color, index) => {
                            const isSelected = currentColor?.toLowerCase() === color.toLowerCase();
                            return (
                              <button
                                key={`${color}-${index}`}
                                type="button"
                                onClick={() => handlePresetClick(color)}
                                className="w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform flex items-center justify-center"
                                style={{
                                  backgroundColor: color,
                                  border: "2px solid #E0E0E0",
                                }}
                              >
                                {isSelected && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <ColorPicker.HiddenInput />
                  </ColorPicker.Root>
                </div>
              </>
            )}
          </div>

          <div className={separatorClass} />
          
          {/* Layer Controls */}
          <div className="flex items-center gap-0.5">
            <button className={btnClass} title="رفع للأمام">
              <ArrowUp size={16} />
            </button>
            <button className={btnClass} title="خفض للخلف">
              <ArrowDown size={16} />
            </button>
          </div>

          <div className={separatorClass} />

          {/* Alignment */}
          <div className="flex items-center gap-0.5">
            <button className={btnClass} title="محاذاة عمودية">
              <AlignVerticalJustifyCenter size={16} />
            </button>
            <button className={btnClass} title="محاذاة أفقية">
              <AlignHorizontalJustifyCenter size={16} />
            </button>
          </div>

          <div className={separatorClass} />

          {/* Show/Hide */}
          <button
            onClick={toggleVisibility}
            className={btnClass}
            title={isVisible ? 'إخفاء' : 'إظهار'}
          >
            {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>

          {/* Group/Ungroup */}
          <button
            onClick={toggleGroup}
            className={btnClass}
            title={isGrouped ? 'فك التجميع' : 'تجميع'}
          >
            {isGrouped ? <Ungroup size={16} /> : <Group size={16} />}
          </button>

          <div className={separatorClass} />

          {/* Delete */}
          <button className={`${btnClass} hover:text-red-500 hover:bg-red-50`} title="حذف">
            <Trash2 size={16} />
          </button>

          {/* Lock */}
          <button
            onClick={toggleLock}
            className={`${btnClass} ${firstElement?.locked ? 'bg-[hsl(var(--ink))] text-white' : ''}`}
            title={firstElement?.locked ? 'إلغاء القفل' : 'قفل'}
          >
            {firstElement?.locked ? <Lock size={16} /> : <Unlock size={16} />}
          </button>

          <div className={separatorClass} />
          
          {/* AI Button (Disabled, icon only) */}
          <button
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--accent-green))] to-[hsl(var(--accent-blue))] opacity-50 cursor-not-allowed"
            title="الذكاء الاصطناعي (قريباً)"
            disabled
          >
            <Sparkles size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingEditBar;
