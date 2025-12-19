import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowUp, 
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  Sparkles,
  Lock,
  Unlock,
  Trash2,
  Eye,
  EyeOff,
  Group,
  Ungroup,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyEnd,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyEnd,
  MoreHorizontal,
  Copy,
  Scissors,
  ClipboardPaste,
  PipetteIcon,
  Square,
  ChevronDown,
  Loader2,
  X,
  LayoutGrid,
  Network,
  Calendar,
  Table2,
  Zap,
  Files
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCanvasStore } from '@/stores/canvasStore';
import { useSmartElementsStore } from '@/stores/smartElementsStore';
import { useSmartElementAI } from '@/hooks/useSmartElementAI';
import { ColorPicker, parseColor } from "@ark-ui/react/color-picker";
import { toast } from 'sonner';
import type { SmartElementType } from '@/types/smart-elements';

// Smart element transform options
const TRANSFORM_OPTIONS = [
  { type: 'kanban' as SmartElementType, label: 'لوحة كانبان', icon: LayoutGrid, description: 'تحويل إلى أعمدة ومهام' },
  { type: 'mind_map' as SmartElementType, label: 'خريطة ذهنية', icon: Network, description: 'تنظيم كخريطة مترابطة' },
  { type: 'timeline' as SmartElementType, label: 'خط زمني', icon: Calendar, description: 'ترتيب على محور زمني' },
  { type: 'decisions_matrix' as SmartElementType, label: 'مصفوفة قرارات', icon: Table2, description: 'تقييم ومقارنة الخيارات' },
  { type: 'brainstorming' as SmartElementType, label: 'عصف ذهني', icon: Zap, description: 'تجميع كأفكار للنقاش' },
];

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
    duplicateElement,
    unlockElements,
    viewport
  } = useCanvasStore();
  
  const { addSmartElement } = useSmartElementsStore();
  const { analyzeSelection, transformElements, isLoading: isAILoading } = useSmartElementAI();
  
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [colorMode, setColorMode] = useState<'fill' | 'stroke'>('fill');
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [isAIMenuOpen, setIsAIMenuOpen] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [isVerticalAlignOpen, setIsVerticalAlignOpen] = useState(false);
  const [isHorizontalAlignOpen, setIsHorizontalAlignOpen] = useState(false);
  
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
  
  // Check if elements are grouped (belong to same parent or are a frame)
  const areElementsGrouped = useMemo(() => {
    if (selectedElements.length === 1) {
      return firstElement?.type === 'frame' && (firstElement as any).children?.length > 0;
    }
    // Check if all selected elements have the same parentId
    const firstParent = selectedElements[0]?.parentId;
    if (!firstParent) return false;
    return selectedElements.every(el => el.parentId && el.parentId === firstParent);
  }, [selectedElements, firstElement]);
  
  // Check if elements are visible
  const areElementsVisible = useMemo(() => {
    return selectedElements.every(el => el.visible !== false);
  }, [selectedElements]);
  
  // Check if elements are locked
  const areElementsLocked = useMemo(() => {
    return selectedElements.some(el => el.locked === true);
  }, [selectedElements]);
  
  // Calculate selection bounds with useMemo for performance
  const selectionBounds = useMemo(() => {
    if (!hasSelection) return null;
    
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    selectedElements.forEach(el => {
      const x = el.position.x;
      const y = el.position.y;
      const width = el.size?.width || 200;
      const height = el.size?.height || 100;
      
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x + width > maxX) maxX = x + width;
      if (y + height > maxY) maxY = y + height;
    });
    
    return { minX, minY, maxX, maxY };
  }, [selectedElements, hasSelection]);
  
  // Calculate position centered on selection - only update when significant change
  useEffect(() => {
    if (!selectionBounds) return;
    
    // Calculate center of selection in canvas coordinates
    const selectionCenterX = (selectionBounds.minX + selectionBounds.maxX) / 2;
    
    // Convert to screen coordinates
    const screenCenterX = selectionCenterX * viewport.zoom + viewport.pan.x;
    const screenTopY = selectionBounds.minY * viewport.zoom + viewport.pan.y - 60;
    
    const newX = screenCenterX;
    const newY = Math.max(70, screenTopY);
    
    // Only update if change is significant (> 2px) to prevent jitter
    if (Math.abs(newX - position.x) > 2 || Math.abs(newY - position.y) > 2) {
      setPosition({ x: newX, y: newY });
    }
  }, [selectionBounds, viewport.zoom, viewport.pan.x, viewport.pan.y]);
  
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

  // Layer controls - reorder elements in array for proper rendering order
  const handleBringForward = () => {
    const { elements: currentElements } = useCanvasStore.getState();
    const newElements = [...currentElements];
    // Process in reverse to handle multiple selections correctly
    [...selectedElementIds].reverse().forEach(id => {
      const idx = newElements.findIndex(el => el.id === id);
      if (idx >= 0 && idx < newElements.length - 1) {
        [newElements[idx], newElements[idx + 1]] = [newElements[idx + 1], newElements[idx]];
      }
    });
    useCanvasStore.setState({ elements: newElements });
    setIsMoreMenuOpen(false);
    toast.success('تم رفع العنصر');
  };

  const handleSendBackward = () => {
    const { elements: currentElements } = useCanvasStore.getState();
    const newElements = [...currentElements];
    // Process in order to handle multiple selections correctly
    selectedElementIds.forEach(id => {
      const idx = newElements.findIndex(el => el.id === id);
      if (idx > 0) {
        [newElements[idx], newElements[idx - 1]] = [newElements[idx - 1], newElements[idx]];
      }
    });
    useCanvasStore.setState({ elements: newElements });
    setIsMoreMenuOpen(false);
    toast.success('تم خفض العنصر');
  };

  const handleBringToFront = () => {
    const { elements: currentElements } = useCanvasStore.getState();
    const selectedSet = new Set(selectedElementIds);
    const selected = currentElements.filter(el => selectedSet.has(el.id));
    const others = currentElements.filter(el => !selectedSet.has(el.id));
    useCanvasStore.setState({ elements: [...others, ...selected] });
    setIsMoreMenuOpen(false);
    toast.success('تم نقل العنصر للأمام');
  };

  const handleSendToBack = () => {
    const { elements: currentElements } = useCanvasStore.getState();
    const selectedSet = new Set(selectedElementIds);
    const selected = currentElements.filter(el => selectedSet.has(el.id));
    const others = currentElements.filter(el => !selectedSet.has(el.id));
    useCanvasStore.setState({ elements: [...selected, ...others] });
    setIsMoreMenuOpen(false);
    toast.success('تم نقل العنصر للخلف');
  };

  // Alignment actions
  const handleAlignVerticalTop = () => {
    alignElements(selectedElementIds, 'top');
    setIsVerticalAlignOpen(false);
    toast.success('تمت المحاذاة للأعلى');
  };

  const handleAlignVerticalMiddle = () => {
    alignElements(selectedElementIds, 'middle');
    setIsVerticalAlignOpen(false);
    toast.success('تمت المحاذاة للوسط عمودياً');
  };

  const handleAlignVerticalBottom = () => {
    alignElements(selectedElementIds, 'bottom');
    setIsVerticalAlignOpen(false);
    toast.success('تمت المحاذاة للأسفل');
  };

  const handleAlignHorizontalLeft = () => {
    alignElements(selectedElementIds, 'left');
    setIsHorizontalAlignOpen(false);
    toast.success('تمت المحاذاة لليسار');
  };

  const handleAlignHorizontalCenter = () => {
    alignElements(selectedElementIds, 'center');
    setIsHorizontalAlignOpen(false);
    toast.success('تمت المحاذاة للوسط أفقياً');
  };

  const handleAlignHorizontalRight = () => {
    alignElements(selectedElementIds, 'right');
    setIsHorizontalAlignOpen(false);
    toast.success('تمت المحاذاة لليمين');
  };

  // Duplicate action
  const handleDuplicate = () => {
    selectedElementIds.forEach(id => duplicateElement(id));
    toast.success('تم تكرار العناصر');
  };

  // AI Smart Element functions
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
        setIsAIMenuOpen(false);
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء التحويل');
    } finally {
      setIsTransforming(false);
    }
  };

  const btnClass = `
    flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200
    text-black hover:bg-[hsl(var(--panel))]
    focus:outline-none active:bg-transparent
  `;
  
  // Button class without hover (for locked state)
  const btnClassNoHover = `
    flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200
    focus:outline-none active:bg-transparent
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
                <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-[hsl(var(--border))] p-1.5 z-50">
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
                  
                  <div className="w-full h-px bg-[hsl(var(--border))] my-1.5" />
                  
                  {/* Layer controls in menu */}
                  <button 
                    onClick={handleBringToFront}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-black hover:bg-[hsl(var(--panel))] rounded-lg"
                  >
                    <ChevronsUp size={14} />
                    <span>نقل للأمام</span>
                  </button>
                  <button 
                    onClick={handleBringForward}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-black hover:bg-[hsl(var(--panel))] rounded-lg"
                  >
                    <ArrowUp size={14} />
                    <span>رفع طبقة</span>
                  </button>
                  <button 
                    onClick={handleSendBackward}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-black hover:bg-[hsl(var(--panel))] rounded-lg"
                  >
                    <ArrowDown size={14} />
                    <span>خفض طبقة</span>
                  </button>
                  <button 
                    onClick={handleSendToBack}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-black hover:bg-[hsl(var(--panel))] rounded-lg"
                  >
                    <ChevronsDown size={14} />
                    <span>نقل للخلف</span>
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

          {/* Duplicate Button */}
          <button
            onClick={handleDuplicate}
            className={btnClass}
            title="تكرار"
          >
            <Files size={16} />
          </button>

          <div className={separatorClass} />

          {/* Vertical Alignment Dropdown */}
          <div className="relative">
            <button 
              onClick={() => {
                setIsVerticalAlignOpen(!isVerticalAlignOpen);
                setIsHorizontalAlignOpen(false);
              }}
              className={`${btnClass} ${isVerticalAlignOpen ? 'bg-[hsl(var(--panel))]' : ''}`}
              title="محاذاة عمودية"
            >
              <AlignVerticalJustifyCenter size={16} />
            </button>
            
            {isVerticalAlignOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsVerticalAlignOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-[hsl(var(--border))] p-1.5 z-50">
                  <button 
                    onClick={handleAlignVerticalTop}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-black hover:bg-[hsl(var(--panel))] rounded-lg"
                  >
                    <AlignVerticalJustifyStart size={14} />
                    <span>للأعلى</span>
                  </button>
                  <button 
                    onClick={handleAlignVerticalMiddle}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-black hover:bg-[hsl(var(--panel))] rounded-lg"
                  >
                    <AlignVerticalJustifyCenter size={14} />
                    <span>للوسط</span>
                  </button>
                  <button 
                    onClick={handleAlignVerticalBottom}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-black hover:bg-[hsl(var(--panel))] rounded-lg"
                  >
                    <AlignVerticalJustifyEnd size={14} />
                    <span>للأسفل</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Horizontal Alignment Dropdown */}
          <div className="relative">
            <button 
              onClick={() => {
                setIsHorizontalAlignOpen(!isHorizontalAlignOpen);
                setIsVerticalAlignOpen(false);
              }}
              className={`${btnClass} ${isHorizontalAlignOpen ? 'bg-[hsl(var(--panel))]' : ''}`}
              title="محاذاة أفقية"
            >
              <AlignHorizontalJustifyCenter size={16} />
            </button>
            
            {isHorizontalAlignOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsHorizontalAlignOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-[hsl(var(--border))] p-1.5 z-50">
                  <button 
                    onClick={handleAlignHorizontalRight}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-black hover:bg-[hsl(var(--panel))] rounded-lg"
                  >
                    <AlignHorizontalJustifyEnd size={14} />
                    <span>لليمين</span>
                  </button>
                  <button 
                    onClick={handleAlignHorizontalCenter}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-black hover:bg-[hsl(var(--panel))] rounded-lg"
                  >
                    <AlignHorizontalJustifyCenter size={14} />
                    <span>للوسط</span>
                  </button>
                  <button 
                    onClick={handleAlignHorizontalLeft}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-black hover:bg-[hsl(var(--panel))] rounded-lg"
                  >
                    <AlignHorizontalJustifyStart size={14} />
                    <span>لليسار</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <div className={separatorClass} />

          {/* Show/Hide - نفس نمط القفل */}
          <button
            onClick={handleToggleVisibility}
            className={`${!areElementsVisible ? btnClassNoHover : btnClass} ${!areElementsVisible ? 'bg-[hsl(var(--ink))] text-white' : ''}`}
            title={areElementsVisible ? 'إخفاء' : 'إظهار'}
          >
            {areElementsVisible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>

          {/* Group/Ungroup - نفس نمط القفل */}
          <button
            onClick={handleToggleGroup}
            className={`${areElementsGrouped ? btnClassNoHover : btnClass} ${areElementsGrouped ? 'bg-[hsl(var(--ink))] text-white' : ''}`}
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
            className={`${areElementsLocked ? btnClassNoHover : btnClass} ${areElementsLocked ? 'bg-[hsl(var(--ink))] text-white' : ''}`}
            title={areElementsLocked ? 'إلغاء القفل' : 'قفل'}
          >
            {areElementsLocked ? <Lock size={16} /> : <Unlock size={16} />}
          </button>

          <div className={separatorClass} />
          
          {/* AI Button with Smart Menu */}
          <div className="relative">
            <button
              onClick={() => setIsAIMenuOpen(!isAIMenuOpen)}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#3DBE8B] to-[#3DA8F5] hover:opacity-90 transition-opacity"
              title="الذكاء الاصطناعي"
            >
              {isAILoading || isTransforming ? (
                <Loader2 size={16} className="text-white animate-spin" />
              ) : (
                <Sparkles size={16} className="text-white" />
              )}
            </button>
            
            <AnimatePresence>
              {isAIMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsAIMenuOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-[hsl(var(--border))] overflow-hidden z-50"
                  >
                    {/* Quick Generate Button */}
                    <div className="p-2 border-b border-[hsl(var(--border))]">
                      <button
                        onClick={handleQuickGenerate}
                        disabled={isAILoading || isTransforming}
                        className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-white bg-gradient-to-r from-[#3DBE8B] to-[#3DA8F5] hover:opacity-90 rounded-lg disabled:opacity-50"
                      >
                        {isAILoading || isTransforming ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Sparkles size={14} />
                        )}
                        <span>إنشاء عنصر ذكي تلقائياً</span>
                      </button>
                    </div>
                    
                    {/* Transform Options */}
                    <div className="p-2 space-y-1">
                      <div className="text-[10px] text-[hsl(var(--ink-60))] px-2 py-1">
                        تحويل إلى:
                      </div>
                      {TRANSFORM_OPTIONS.map((option) => (
                        <button
                          key={option.type}
                          onClick={() => handleTransform(option.type)}
                          disabled={isAILoading || isTransforming}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[hsl(var(--panel))] transition-colors text-right disabled:opacity-50"
                        >
                          <span className="text-[#3DBE8B]">
                            <option.icon size={16} />
                          </span>
                          <div className="flex-1">
                            <div className="text-[12px] font-medium text-black">
                              {option.label}
                            </div>
                            <div className="text-[10px] text-[hsl(var(--ink-60))]">
                              {option.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {/* Selection Info */}
                    <div className="px-3 py-2 border-t border-[hsl(var(--border))] text-[10px] text-[hsl(var(--ink-60))] text-center">
                      {selectedElements.length} عنصر محدد
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingEditBar;