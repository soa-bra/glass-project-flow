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
  Image,
  Crop,
  Replace,
  Group,
  Ungroup,
  ChevronDown,
  Plus,
  Loader2,
  ArrowRightLeft,
} from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// قائمة الخطوط المتاحة
const FONT_FAMILIES = [
  { value: 'IBM Plex Sans Arabic', label: 'IBM Plex Sans Arabic' },
  { value: 'Cairo', label: 'Cairo' },
  { value: 'Tajawal', label: 'Tajawal' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Times New Roman', label: 'Times New Roman' },
];

// أحجام الخطوط المتاحة
const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72];

type SelectionType = 'element' | 'text' | 'image' | 'multiple' | null;

interface ToolbarButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
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
  const baseClass = "flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    default: isActive 
      ? "bg-[hsl(var(--ink))] text-white" 
      : "text-[hsl(var(--ink))] hover:bg-[hsl(var(--panel))]",
    destructive: "text-[hsl(var(--ink))] hover:text-[#E5564D] hover:bg-red-50",
    ai: "bg-gradient-to-br from-[#3DBE8B] to-[#3DA8F5] text-white hover:opacity-90",
  };

  return (
    <button
      onClick={onClick}
      className={cn(baseClass, variantClasses[variant])}
      title={title}
      disabled={disabled}
    >
      {icon}
    </button>
  );
};

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
  } = useCanvasStore();

  const { addSmartElement } = useSmartElementsStore();
  const { analyzeSelection, transformElements, isLoading: isAILoading } = useSmartElementAI();

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [imageName, setImageName] = useState('');
  
  // حساب العناصر المحددة
  const selectedElements = useMemo(
    () => elements.filter(el => selectedElementIds.includes(el.id)),
    [elements, selectedElementIds]
  );

  const hasSelection = selectedElements.length > 0;
  const firstElement = selectedElements[0];
  const selectionCount = selectedElements.length;

  // تحديد نوع التحديد
  const selectionType = useMemo((): SelectionType => {
    if (!hasSelection) return null;
    if (selectionCount > 1) return 'multiple';
    
    const type = firstElement?.type;
    if (type === 'text') return 'text';
    if (type === 'image') return 'image';
    return 'element';
  }, [hasSelection, selectionCount, firstElement?.type]);

  // حالات العناصر
  const groupId = useMemo(() => {
    for (const el of selectedElements) {
      if (el.metadata?.groupId) return el.metadata.groupId as string;
    }
    return null;
  }, [selectedElements]);

  const areElementsGrouped = !!groupId;
  const areElementsVisible = selectedElements.every(el => el.visible !== false);
  const areElementsLocked = selectedElements.some(el => el.locked === true);

  // حساب موقع الشريط
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

  useEffect(() => {
    if (!selectionBounds) return;
    
    const selectionCenterX = (selectionBounds.minX + selectionBounds.maxX) / 2;
    const screenCenterX = selectionCenterX * viewport.zoom + viewport.pan.x;
    const screenTopY = selectionBounds.minY * viewport.zoom + viewport.pan.y - 60;
    
    const newX = screenCenterX;
    const newY = Math.max(70, screenTopY);
    
    if (Math.abs(newX - position.x) > 2 || Math.abs(newY - position.y) > 2) {
      setPosition({ x: newX, y: newY });
    }
  }, [selectionBounds, viewport.zoom, viewport.pan.x, viewport.pan.y]);

  // تحديث اسم الصورة عند التحديد
  useEffect(() => {
    if (selectionType === 'image' && firstElement) {
      setImageName(firstElement.content || 'صورة');
    }
  }, [selectionType, firstElement]);

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

  const handleAI = () => {
    toast.info('قريباً: الذكاء الاصطناعي');
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
    const centerX = selectionBounds ? (selectionBounds.minX + selectionBounds.maxX) / 2 : 100;
    const centerY = selectionBounds ? selectionBounds.maxY + 50 : 100;
    
    addElement({
      type: 'text',
      position: { x: centerX, y: centerY },
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
  const handleTextFormat = (format: string) => {
    document.execCommand(format, false);
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    selectedElementIds.forEach(id => {
      updateElement(id, { style: { ...firstElement?.style, fontFamily } });
    });
  };

  const handleFontSizeChange = (fontSize: string) => {
    selectedElementIds.forEach(id => {
      updateElement(id, { style: { ...firstElement?.style, fontSize: parseInt(fontSize) } });
    });
  };

  const handleTextAlign = (align: 'left' | 'center' | 'right' | 'justify') => {
    selectedElementIds.forEach(id => {
      updateElement(id, { style: { ...firstElement?.style, textAlign: align } });
    });
  };

  const handleVerticalAlign = (align: 'flex-start' | 'center' | 'flex-end') => {
    selectedElementIds.forEach(id => {
      updateElement(id, { style: { ...firstElement?.style, justifyContent: align } });
    });
  };

  const handleTextDirection = (direction: 'rtl' | 'ltr') => {
    selectedElementIds.forEach(id => {
      updateElement(id, { style: { ...firstElement?.style, direction } });
    });
  };

  const handleClearFormatting = () => {
    document.execCommand('removeFormat', false);
    toast.success('تم مسح التنسيقات');
  };

  const handleAddLink = () => {
    const url = prompt('أدخل الرابط:');
    if (url) {
      document.execCommand('createLink', false, url);
      toast.success('تم إضافة الرابط');
    }
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

  // ===== الأزرار المشتركة =====
  const CommonActions = () => (
    <>
      {/* تكرار */}
      <ToolbarButton icon={<Files size={16} />} onClick={handleDuplicate} title="تكرار" />
      
      {/* إظهار/إخفاء */}
      <ToolbarButton 
        icon={areElementsVisible ? <Eye size={16} /> : <EyeOff size={16} />} 
        onClick={handleToggleVisibility} 
        title={areElementsVisible ? 'إخفاء' : 'إظهار'}
        isActive={!areElementsVisible}
      />
      
      {/* قفل/فك القفل */}
      <ToolbarButton 
        icon={areElementsLocked ? <Lock size={16} /> : <Unlock size={16} />} 
        onClick={handleToggleLock} 
        title={areElementsLocked ? 'فك القفل' : 'قفل'}
        isActive={areElementsLocked}
      />
      
      {/* تعليق */}
      <ToolbarButton icon={<MessageSquare size={16} />} onClick={handleComment} title="ترك تعليق" />
      
      {/* حذف */}
      <ToolbarButton icon={<Trash2 size={16} />} onClick={handleDelete} title="حذف" variant="destructive" />
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      {/* زر الذكاء الاصطناعي */}
      <ToolbarButton icon={<Sparkles size={16} />} onClick={handleAI} title="الذكاء الاصطناعي" variant="ai" />
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      {/* قائمة المزيد */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-[hsl(var(--panel))] text-[hsl(var(--ink))]">
            <MoreVertical size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white z-[100]">
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
          
          {/* تغيير الطبقة */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Layers size={14} className="ml-2" />
              تغيير الطبقة
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-white z-[110]">
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
      {/* نوع الخط */}
      <Select 
        value={firstElement?.style?.fontFamily || 'IBM Plex Sans Arabic'} 
        onValueChange={handleFontFamilyChange}
      >
        <SelectTrigger className="h-8 w-[120px] text-xs">
          <SelectValue placeholder="الخط" />
        </SelectTrigger>
        <SelectContent className="bg-white z-[100]">
          {FONT_FAMILIES.map((font) => (
            <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
              {font.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* حجم الخط */}
      <Select 
        value={String(firstElement?.style?.fontSize || 16)} 
        onValueChange={handleFontSizeChange}
      >
        <SelectTrigger className="h-8 w-[70px] text-xs">
          <SelectValue placeholder="16" />
        </SelectTrigger>
        <SelectContent className="bg-white z-[100]">
          {FONT_SIZES.map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      {/* عريض */}
      <ToolbarButton icon={<Bold size={16} />} onClick={() => handleTextFormat('bold')} title="عريض" />
      
      {/* مائل */}
      <ToolbarButton icon={<Italic size={16} />} onClick={() => handleTextFormat('italic')} title="مائل" />
      
      {/* تحته خط */}
      <ToolbarButton icon={<Underline size={16} />} onClick={() => handleTextFormat('underline')} title="تحته خط" />
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      {/* محاذاة النص */}
      <ToolbarButton icon={<AlignRight size={16} />} onClick={() => handleTextAlign('right')} title="محاذاة لليمين" />
      <ToolbarButton icon={<AlignCenter size={16} />} onClick={() => handleTextAlign('center')} title="محاذاة للوسط" />
      <ToolbarButton icon={<AlignLeft size={16} />} onClick={() => handleTextAlign('left')} title="محاذاة لليسار" />
      <ToolbarButton icon={<AlignJustify size={16} />} onClick={() => handleTextAlign('justify')} title="ضبط" />
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      {/* المحاذاة الرأسية */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-[hsl(var(--panel))] text-[hsl(var(--ink))]" title="المحاذاة الرأسية">
            <AlignVerticalJustifyCenter size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white z-[100]">
          <DropdownMenuItem onClick={() => handleVerticalAlign('flex-start')}>
            <AlignVerticalJustifyStart size={14} className="ml-2" />
            أعلى
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleVerticalAlign('center')}>
            <AlignVerticalJustifyCenter size={14} className="ml-2" />
            وسط
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleVerticalAlign('flex-end')}>
            <AlignVerticalJustifyEnd size={14} className="ml-2" />
            أسفل
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* اتجاه النص */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-[hsl(var(--panel))] text-[hsl(var(--ink))]" title="اتجاه النص">
            <ArrowRightLeft size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white z-[100]">
          <DropdownMenuItem onClick={() => handleTextDirection('rtl')}>
            من اليمين لليسار (RTL)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleTextDirection('ltr')}>
            من اليسار لليمين (LTR)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      {/* قائمة نقطية */}
      <ToolbarButton icon={<List size={16} />} onClick={() => document.execCommand('insertUnorderedList')} title="قائمة نقطية" />
      
      {/* قائمة رقمية */}
      <ToolbarButton icon={<ListOrdered size={16} />} onClick={() => document.execCommand('insertOrderedList')} title="قائمة رقمية" />
      
      {/* مسح التنسيقات */}
      <ToolbarButton icon={<RemoveFormatting size={16} />} onClick={handleClearFormatting} title="مسح التنسيقات" />
      
      {/* إضافة رابط */}
      <ToolbarButton icon={<Link size={16} />} onClick={handleAddLink} title="إضافة رابط" />
      
      <Separator orientation="vertical" className="h-6 mx-1" />
    </>
  );

  // ===== أزرار الصور =====
  const ImageActions = () => (
    <>
      {/* اسم الصورة */}
      <Input
        value={imageName}
        onChange={(e) => handleImageRename(e.target.value)}
        className="h-8 w-[120px] text-xs"
        placeholder="اسم الصورة"
      />
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      {/* كروب */}
      <ToolbarButton icon={<Crop size={16} />} onClick={handleCrop} title="كروب" />
      
      {/* تبديل الصورة */}
      <ToolbarButton icon={<Replace size={16} />} onClick={handleReplaceImage} title="تبديل الصورة" />
      
      {/* إضافة رابط */}
      <ToolbarButton icon={<Link size={16} />} onClick={handleAddLink} title="إضافة رابط" />
      
      <Separator orientation="vertical" className="h-6 mx-1" />
    </>
  );

  // ===== أزرار التحديد المتعدد =====
  const MultipleActions = () => (
    <>
      {/* عدد العناصر المحددة */}
      <div className="flex items-center gap-1 px-2 py-1 bg-[hsl(var(--panel))] rounded-lg text-xs font-medium text-[hsl(var(--ink))]">
        <span>{selectionCount}</span>
        <span>عناصر محددة</span>
      </div>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      {/* المحاذاة الأفقية */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-[hsl(var(--panel))] text-[hsl(var(--ink))]" title="المحاذاة الأفقية">
            <AlignHorizontalJustifyCenter size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white z-[100]">
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
      
      {/* المحاذاة العمودية */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-[hsl(var(--panel))] text-[hsl(var(--ink))]" title="المحاذاة العمودية">
            <AlignVerticalJustifyCenter size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white z-[100]">
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
      
      {/* تجميع/فك التجميع */}
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
      className="fixed z-50 pointer-events-auto"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translateX(-50%)'
      }}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-[hsl(var(--border))] p-1.5">
        <div className="flex items-center gap-1">
          {/* أزرار خاصة بالنوع */}
          {selectionType === 'text' && <TextActions />}
          {selectionType === 'image' && <ImageActions />}
          {selectionType === 'multiple' && <MultipleActions />}
          
          {/* الأزرار المشتركة */}
          <CommonActions />
        </div>
      </div>
    </motion.div>,
    document.body
  );
};

export default UnifiedFloatingToolbar;
