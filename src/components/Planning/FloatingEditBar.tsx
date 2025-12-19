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
import { ColorPicker, parseColor } from "@ark-ui/react/color-picker";
import { toast } from 'sonner';

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
    unlockElements
  } = useCanvasStore();
  
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [colorMode, setColorMode] = useState<'fill' | 'stroke'>('fill');
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
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
  
  // Check if selection is a group
  const isGroup = useMemo(() => {
    return firstElement?.type === 'frame' && (firstElement as any).children?.length > 0;
  }, [firstElement]);
  
  // Check if elements are visible
  const areElementsVisible = useMemo(() => {
    return selectedElements.every(el => el.visible !== false);
  }, [selectedElements]);
  
  // Check if elements are locked
  const areElementsLocked = useMemo(() => {
    return selectedElements.some(el => el.locked === true);
  }, [selectedElements]);
  
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
  
  // Copy action
  const handleCopy = () => {
    copyElements(selectedElementIds);
    setIsMoreMenuOpen(false);
    toast.success('تم نسخ العناصر');
  };

  // Cut action
  const handleCut = () => {
    cutElements(selectedElementIds);
    setIsMoreMenuOpen(false);
    toast.success('تم قص العناصر');
  };

  // Paste action
  const handlePaste = () => {
    if (clipboard.length > 0) {
      pasteElements();
      setIsMoreMenuOpen(false);
      toast.success('تم لصق العناصر');
    } else {
      toast.error('الحافظة فارغة');
    }
  };

  // Delete action
  const handleDelete = () => {
    deleteElements(selectedElementIds);
    toast.success('تم حذف العناصر');
  };
  
  // Lock/Unlock action
  const handleToggleLock = () => {
    if (areElementsLocked) {
      unlockElements(selectedElementIds);
      toast.success('تم إلغاء قفل العناصر');
    } else {
      lockElements(selectedElementIds);
      toast.success('تم قفل العناصر');
    }
  };

  // Visibility toggle
  const handleToggleVisibility = () => {
    selectedElementIds.forEach(id => {
      const current = elements.find(el => el.id === id);
      updateElement(id, { visible: current?.visible === false ? true : false });
    });
    toast.success(areElementsVisible ? 'تم إخفاء العناصر' : 'تم إظهار العناصر');
  };

  // Group/Ungroup action
  const handleToggleGroup = () => {
    if (isGroup && firstElement) {
      ungroupElements(firstElement.id);
      toast.success('تم فك التجميع');
    } else if (selectedElementIds.length > 1) {
      groupElements(selectedElementIds);
      toast.success('تم تجميع العناصر');
    } else {
      toast.error('حدد عنصرين أو أكثر للتجميع');
    }
  };

  // Layer controls
  const handleBringForward = () => {
    selectedElementIds.forEach(id => {
      const current = elements.find(el => el.id === id);
      const maxZIndex = Math.max(...elements.map(el => el.zIndex || 0));
      updateElement(id, { zIndex: (current?.zIndex || 0) + 1 });
    });
  };

  const handleSendBackward = () => {
    selectedElementIds.forEach(id => {
      const current = elements.find(el => el.id === id);
      updateElement(id, { zIndex: Math.max(0, (current?.zIndex || 0) - 1) });
    });
  };

  // Alignment actions
  const handleAlignVertical = () => {
    alignElements(selectedElementIds, 'middle');
    toast.success('تمت المحاذاة العمودية');
  };

  const handleAlignHorizontal = () => {
    alignElements(selectedElementIds, 'center');
    toast.success('تمت المحاذاة الأفقية');
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
                  <button 
                    onClick={handleCopy}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-black hover:bg-[hsl(var(--panel))] rounded-lg"
                  >
                    <Copy size={14} />
                    <span>نسخ</span>
                  </button>
                  <button 
                    onClick={handleCut}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-black hover:bg-[hsl(var(--panel))] rounded-lg"
                  >
                    <Scissors size={14} />
                    <span>قص</span>
                  </button>
                  <button 
                    onClick={handlePaste}
                    disabled={clipboard.length === 0}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-black hover:bg-[hsl(var(--panel))] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
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
            <button 
              onClick={handleBringForward}
              className={btnClass} 
              title="رفع للأمام"
            >
              <ArrowUp size={16} />
            </button>
            <button 
              onClick={handleSendBackward}
              className={btnClass} 
              title="خفض للخلف"
            >
              <ArrowDown size={16} />
            </button>
          </div>

          <div className={separatorClass} />

          {/* Alignment */}
          <div className="flex items-center gap-0.5">
            <button 
              onClick={handleAlignVertical}
              className={btnClass} 
              title="محاذاة عمودية"
            >
              <AlignVerticalJustifyCenter size={16} />
            </button>
            <button 
              onClick={handleAlignHorizontal}
              className={btnClass} 
              title="محاذاة أفقية"
            >
              <AlignHorizontalJustifyCenter size={16} />
            </button>
          </div>

          <div className={separatorClass} />

          {/* Show/Hide */}
          <button
            onClick={handleToggleVisibility}
            className={`${btnClass} ${!areElementsVisible ? 'bg-[hsl(var(--panel))]' : ''}`}
            title={areElementsVisible ? 'إخفاء' : 'إظهار'}
          >
            {areElementsVisible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>

          {/* Group/Ungroup */}
          <button
            onClick={handleToggleGroup}
            className={`${btnClass} ${isGroup ? 'bg-[hsl(var(--panel))]' : ''}`}
            title={isGroup ? 'فك التجميع' : 'تجميع'}
          >
            {isGroup ? <Ungroup size={16} /> : <Group size={16} />}
          </button>

          <div className={separatorClass} />

          {/* Delete */}
          <button 
            onClick={handleDelete}
            className={`${btnClass} hover:text-[#E5564D] hover:bg-red-50`} 
            title="حذف"
          >
            <Trash2 size={16} />
          </button>

          {/* Lock */}
          <button
            onClick={handleToggleLock}
            className={`${btnClass} ${areElementsLocked ? 'bg-[hsl(var(--ink))] text-white' : ''}`}
            title={areElementsLocked ? 'إلغاء القفل' : 'قفل'}
          >
            {areElementsLocked ? <Lock size={16} /> : <Unlock size={16} />}
          </button>

          <div className={separatorClass} />
          
          {/* AI Button (Disabled, matching AIAssistantPopover style) */}
          <button
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#3DBE8B] to-[#3DA8F5] opacity-50 cursor-not-allowed"
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