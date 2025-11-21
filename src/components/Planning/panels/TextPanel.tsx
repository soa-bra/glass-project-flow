import React from 'react';
import { Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, ArrowRightLeft, AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd } from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';
import { toast } from 'sonner';

const TextPanel: React.FC = () => {
  const { 
    toolSettings, 
    updateToolSettings, 
    setActiveTool,
    elements,
    updateTextStyle,
    editingTextId
  } = useCanvasStore();
  
  const [showFontSizes, setShowFontSizes] = React.useState(false);
  
  // الحصول على النص قيد التحرير
  const editingElement = React.useMemo(() => {
    if (editingTextId) {
      return elements.find(e => e.id === editingTextId);
    }
    return null;
  }, [editingTextId, elements]);
  
  // استخدام قيم النص قيد التحرير أو الإعدادات الافتراضية
  const currentFontSize = editingElement?.style?.fontSize || toolSettings.text.fontSize;
  const currentFontFamily = editingElement?.style?.fontFamily || toolSettings.text.fontFamily;
  const currentFontWeight = editingElement?.style?.fontWeight || toolSettings.text.fontWeight;
  const currentColor = editingElement?.style?.color || toolSettings.text.color;
  const currentAlignment = (editingElement?.style?.textAlign as 'left' | 'center' | 'right') || toolSettings.text.alignment;
  const currentDirection = (editingElement?.style?.direction as 'rtl' | 'ltr') || toolSettings.text.direction;
  const currentVerticalAlign = (editingElement?.style?.alignItems as 'flex-start' | 'center' | 'flex-end') || 
    (toolSettings.text.verticalAlign === 'top' ? 'flex-start' : toolSettings.text.verticalAlign === 'bottom' ? 'flex-end' : 'center');
  
  const handleSettingChange = (setting: string, value: any) => {
    // أولاً: التحقق من وجود نص مظلل داخل محرر نص نشط
    const currentEditor = (window as any).__currentTextEditor;
    const selection = window.getSelection();
    const selectedText = selection?.toString();
    
    // تحسين: التحقق المتقدم من أن التحديد موجود داخل المحرر النشط
    const isSelectionInEditor = !!(
      currentEditor &&
      selectedText &&
      selectedText.length > 0 &&
      selection?.anchorNode &&
      currentEditor.editorRef &&
      currentEditor.editorRef.contains(selection.anchorNode)
    );
    
    // console.log للتشخيص في بيئة التطوير
    if (process.env.NODE_ENV === 'development') {
      console.log('🎨 Text formatting:', {
        setting,
        value,
        hasEditor: !!currentEditor,
        hasSelection: !!selectedText,
        isInEditor: isSelectionInEditor,
        editingElement: !!editingElement
      });
    }
    
    // المحاذاة واتجاه النص والمحاذاة الرأسية تطبق دائماً على العنصر كله
    if (setting === 'textAlign' || setting === 'direction' || setting === 'verticalAlign') {
      if (editingElement) {
        if (setting === 'verticalAlign') {
          // تحويل القيمة إلى alignItems
          const alignItems = value === 'top' ? 'flex-start' : value === 'bottom' ? 'flex-end' : 'center';
          updateTextStyle(editingElement.id, { alignItems });
        } else {
          updateTextStyle(editingElement.id, { [setting]: value });
        }
      } else {
        if (setting === 'textAlign') {
          updateToolSettings('text', { alignment: value } as any);
        } else if (setting === 'direction') {
          updateToolSettings('text', { direction: value } as any);
        } else if (setting === 'verticalAlign') {
          updateToolSettings('text', { verticalAlign: value } as any);
        }
      }
      return;
    }
    
    // ✅ إضافة: إذا كان هناك عنصر قيد التحرير، تحديث style مباشرة
    if (editingElement && !isSelectionInEditor) {
      // تطبيق على العنصر بالكامل
      updateTextStyle(editingElement.id, { [setting]: value });
      return;
    }
    
    if (isSelectionInEditor) {
      // تطبيق التنسيق على النص المظلل فقط
      if (setting === 'fontFamily') {
        currentEditor.applyFormat('fontName', value);
      } else if (setting === 'fontSize') {
        // تطبيق حجم الخط باستخدام span
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const span = document.createElement('span');
          span.style.fontSize = `${value}px`;
          try {
            range.surroundContents(span);
            // تحديث المحتوى
            const newContent = currentEditor.editorRef.innerHTML;
            currentEditor.applyFormat('insertHTML', newContent);
          } catch (e) {
            console.warn('Failed to apply fontSize with surroundContents', e);
          }
        }
      } else if (setting === 'fontWeight') {
        currentEditor.applyFormat('bold');
      } else if (setting === 'color') {
        currentEditor.applyFormat('foreColor', value);
      }
      return;
    }
    
    // إذا لم يكن هناك تحديد في المحرر، تحديث الإعدادات الافتراضية
    updateToolSettings('text', { [setting]: value } as any);
  };
  
  const { fontSize, fontWeight, color, alignment, fontFamily } = toolSettings.text;

  const handleActivateTextTool = () => {
    setActiveTool('text_tool');
    toast.info('انقر على أي مكان في الكانفاس لإضافة نص');
  };

  return (
    <div className="space-y-6">
      {/* بانر توضيحي عند التحرير */}
      {editingElement && (
        <div className="p-3 bg-[hsl(var(--accent-green))]/10 border border-[hsl(var(--accent-green))]/30 rounded-[10px]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--accent-green))] animate-pulse" />
            <span className="text-[12px] font-semibold text-[hsl(var(--ink))]">
              وضع التحرير نشط
            </span>
          </div>
          <p className="text-[10px] text-[hsl(var(--ink-60))]">
            ظلّل أي جزء من النص لتغيير تنسيقه
          </p>
        </div>
      )}
      {/* Font Family */}
      <div>
        <label className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-2 block">
          نوع الخط
        </label>
        <select 
          value={currentFontFamily}
          onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
          className="w-full px-3 py-2 text-[12px] border border-[#DADCE0] rounded-[10px] outline-none focus:border-[hsl(var(--accent-green))] transition-colors bg-white"
        >
          <option value="IBM Plex Sans Arabic">IBM Plex Sans Arabic</option>
          <option value="Cairo">Cairo</option>
          <option value="Tajawal">Tajawal</option>
          <option value="Almarai">Almarai</option>
        </select>
      </div>

      {/* Font Weight */}
      <div>
        <label className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3 block">
          وزن الخط
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { value: 'normal', label: 'عادي' },
            { value: '500', label: 'متوسط' },
            { value: '600', label: 'نصف عريض' },
            { value: '700', label: 'عريض' },
          ].map((weight) => (
            <button
              key={weight.value}
              onClick={() => handleSettingChange('fontWeight', weight.value)}
              className={`px-3 py-2 rounded-[10px] text-[11px] font-medium transition-colors ${
                currentFontWeight === weight.value
                  ? 'bg-[hsl(var(--ink))] text-white'
                  : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-gray-200'
              }`}
              style={{ fontWeight: weight.value }}
            >
              {weight.label}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div>
        <label className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-2 block">
          حجم الخط
        </label>
        <div className="relative">
          <input
            type="number"
            min={8}
            max={200}
            value={currentFontSize}
            onChange={(e) => handleSettingChange('fontSize', Number(e.target.value))}
            onFocus={() => setShowFontSizes(true)}
            className="w-full px-3 py-2 pl-8 text-[12px] border border-[#DADCE0] rounded-[10px] outline-none focus:border-[hsl(var(--accent-green))] transition-colors bg-white"
            placeholder="حجم الخط"
          />
          <button
            type="button"
            onClick={() => setShowFontSizes(!showFontSizes)}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-[hsl(var(--ink-60))] hover:text-[hsl(var(--ink))] transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 4l4 4 4-4" />
            </svg>
          </button>
          
          {showFontSizes && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowFontSizes(false)}
              />
              <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-[#DADCE0] rounded-[10px] shadow-lg max-h-[200px] overflow-y-auto">
                {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      handleSettingChange('fontSize', size);
                      setShowFontSizes(false);
                    }}
                    className={`w-full px-3 py-2 text-right text-[12px] hover:bg-[hsl(var(--panel))] transition-colors ${
                      currentFontSize === size ? 'bg-[hsl(var(--accent-green))]/10 text-[hsl(var(--accent-green))] font-semibold' : 'text-[hsl(var(--ink))]'
                    }`}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Text Alignment */}
      <div>
        <label className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3 block">
          المحاذاة
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleSettingChange('textAlign', 'right')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-[10px] transition-colors ${
              currentAlignment === 'right'
                ? 'bg-[hsl(var(--ink))] text-white'
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-gray-200'
            }`}
          >
            <AlignRight size={16} />
            <span className="text-[11px] font-medium">يمين</span>
          </button>
          <button
            onClick={() => handleSettingChange('textAlign', 'center')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-[10px] transition-colors ${
              currentAlignment === 'center'
                ? 'bg-[hsl(var(--ink))] text-white'
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-gray-200'
            }`}
          >
            <AlignCenter size={16} />
            <span className="text-[11px] font-medium">وسط</span>
          </button>
          <button
            onClick={() => handleSettingChange('textAlign', 'left')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-[10px] transition-colors ${
              currentAlignment === 'left'
                ? 'bg-[hsl(var(--ink))] text-white'
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-gray-200'
            }`}
          >
            <AlignLeft size={16} />
            <span className="text-[11px] font-medium">يسار</span>
          </button>
        </div>
      </div>

      {/* Text Direction */}
      <div>
        <label className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3 block">
          اتجاه النص
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleSettingChange('direction', 'rtl')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-[10px] transition-colors ${
              currentDirection === 'rtl'
                ? 'bg-[hsl(var(--ink))] text-white'
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-gray-200'
            }`}
          >
            <ArrowRightLeft size={16} className="rotate-0" />
            <span className="text-[11px] font-medium">من اليمين لليسار</span>
          </button>
          <button
            onClick={() => handleSettingChange('direction', 'ltr')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-[10px] transition-colors ${
              currentDirection === 'ltr'
                ? 'bg-[hsl(var(--ink))] text-white'
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-gray-200'
            }`}
          >
            <ArrowRightLeft size={16} className="rotate-180" />
            <span className="text-[11px] font-medium">من اليسار لليمين</span>
          </button>
        </div>
      </div>

      {/* Vertical Alignment */}
      <div>
        <label className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3 block">
          المحاذاة الرأسية
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleSettingChange('verticalAlign', 'top')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-[10px] transition-colors ${
              currentVerticalAlign === 'flex-start'
                ? 'bg-[hsl(var(--ink))] text-white'
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-gray-200'
            }`}
          >
            <AlignVerticalJustifyStart size={16} />
            <span className="text-[11px] font-medium">أعلى</span>
          </button>
          <button
            onClick={() => handleSettingChange('verticalAlign', 'middle')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-[10px] transition-colors ${
              currentVerticalAlign === 'center'
                ? 'bg-[hsl(var(--ink))] text-white'
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-gray-200'
            }`}
          >
            <AlignVerticalJustifyCenter size={16} />
            <span className="text-[11px] font-medium">وسط</span>
          </button>
          <button
            onClick={() => handleSettingChange('verticalAlign', 'bottom')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-[10px] transition-colors ${
              currentVerticalAlign === 'flex-end'
                ? 'bg-[hsl(var(--ink))] text-white'
                : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))] hover:bg-gray-200'
            }`}
          >
            <AlignVerticalJustifyEnd size={16} />
            <span className="text-[11px] font-medium">أسفل</span>
          </button>
        </div>
      </div>

      {/* Text Color */}
      <div>
        <label className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3 block">
          لون النص
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={currentColor}
            onChange={(e) => handleSettingChange('color', e.target.value)}
            className="w-12 h-12 rounded-[10px] cursor-pointer border-2 border-[#DADCE0]"
          />
          <div className="flex-1">
            <input
              type="text"
              value={currentColor}
              onChange={(e) => handleSettingChange('color', e.target.value)}
              className="w-full px-3 py-2 text-[12px] border border-[#DADCE0] rounded-[10px] outline-none focus:border-[hsl(var(--accent-green))] transition-colors"
              placeholder="#0B0F12"
            />
          </div>
        </div>

        {/* Color Presets */}
        <div className="grid grid-cols-6 gap-2 mt-3">
          {['#0B0F12', '#3DBE8B', '#F6C445', '#E5564D', '#3DA8F5', '#9333EA'].map((c) => (
            <button
              key={c}
              onClick={() => handleSettingChange('color', c)}
              style={{ backgroundColor: c }}
              className={`w-full h-8 rounded-lg border-2 transition-all ${
                currentColor === c ? 'border-[hsl(var(--ink))] scale-105' : 'border-[#DADCE0]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Activate Tool Button */}
      <button
        onClick={handleActivateTextTool}
        className="w-full py-3 bg-[hsl(var(--accent-green))] text-white rounded-[10px] hover:opacity-90 transition-opacity text-[13px] font-semibold"
      >
        {editingElement ? 'حفظ التنسيق' : 'تفعيل أداة النص'}
      </button>

      {/* Keyboard Shortcuts */}
      <div className="pt-4 border-t border-[#DADCE0]">
        <h4 className="text-[12px] font-semibold text-[hsl(var(--ink-60))] mb-2">
          اختصارات الكيبورد
        </h4>
        <div className="space-y-1.5 text-[11px] text-[hsl(var(--ink-60))]">
          <div className="flex justify-between">
            <span>تفعيل الأداة</span>
            <code className="bg-[hsl(var(--panel))] px-1.5 py-0.5 rounded">T</code>
          </div>
          <div className="flex justify-between">
            <span>إبراز</span>
            <code className="bg-[hsl(var(--panel))] px-1.5 py-0.5 rounded">Cmd+B</code>
          </div>
          <div className="flex justify-between">
            <span>مائل</span>
            <code className="bg-[hsl(var(--panel))] px-1.5 py-0.5 rounded">Cmd+I</code>
          </div>
          <div className="flex justify-between">
            <span>تسطير</span>
            <code className="bg-[hsl(var(--panel))] px-1.5 py-0.5 rounded">Cmd+U</code>
          </div>
        </div>
        <p className="text-[10px] text-[hsl(var(--accent-green))] mt-2">
          💡 ظلّل جزء من النص ثم غيّر تنسيقه من هنا
        </p>
      </div>
    </div>
  );
};

export default TextPanel;
