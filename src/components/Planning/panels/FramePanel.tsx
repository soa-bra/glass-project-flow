import React, { useMemo, useState } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { toast } from 'sonner';
import { Unlink, Frame, Layers } from 'lucide-react';
import FramesNavigator from '../FramesNavigator';

export default function FramePanel() {
  const { 
    toolSettings, 
    updateToolSettings, 
    setActiveTool, 
    selectedElementIds, 
    elements, 
    ungroupFrame,
    detachElementFromFrame,
    getElementParentFrame 
  } = useCanvasStore();
  const frameSettings = toolSettings.frame;
  const [showNavigator, setShowNavigator] = useState(false);

  // الحصول على الإطار المحدد إذا وجد
  const selectedFrame = selectedElementIds.length === 1 
    ? elements.find(el => el.id === selectedElementIds[0] && el.type === 'frame')
    : null;

  const frameChildren = useMemo(
    () => selectedFrame 
      ? elements.filter(el => (selectedFrame as any).children?.includes(el.id))
      : [],
    [selectedFrame, elements]
  );

  // التحقق إذا كان العنصر المحدد داخل إطار (لغير الإطارات)
  const selectedElementInFrame = useMemo(() => {
    if (selectedElementIds.length !== 1) return null;
    const selectedId = selectedElementIds[0];
    const selectedEl = elements.find(el => el.id === selectedId);
    if (!selectedEl || selectedEl.type === 'frame') return null;
    
    const parentFrame = getElementParentFrame(selectedId);
    return parentFrame ? { element: selectedEl, frame: parentFrame } : null;
  }, [selectedElementIds, elements, getElementParentFrame]);

  const handleUngroup = () => {
    if (selectedFrame) {
      ungroupFrame(selectedFrame.id);
      toast.success('تم فك التجميع');
    }
  };

  const handleDetachElement = () => {
    if (selectedElementInFrame) {
      detachElementFromFrame(selectedElementInFrame.element.id);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateToolSettings('frame', { title: e.target.value });
  };

  const handleStrokeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateToolSettings('frame', { strokeWidth: parseInt(e.target.value) });
  };

  const handleActivateFrame = () => {
    setActiveTool('frame_tool');
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3">
          أداة الإطار
        </h4>
        
        {/* ✅ عنصر داخل إطار - خيار الفصل */}
        {selectedElementInFrame && (
          <div className="mb-4 p-3 bg-[hsl(var(--accent-blue))]/10 rounded-[10px] border border-[hsl(var(--accent-blue))]/20">
            <h5 className="text-[12px] font-semibold text-[hsl(var(--ink))] mb-2 flex items-center gap-2">
              <Unlink className="w-4 h-4" />
              عنصر داخل إطار
            </h5>
            <div className="space-y-1.5 text-[11px]">
              <p className="text-[hsl(var(--ink-60))]">
                <span className="font-medium">الإطار:</span> {(selectedElementInFrame.frame as any).title || 'بدون عنوان'}
              </p>
              <button
                onClick={handleDetachElement}
                className="w-full mt-2 py-1.5 bg-[hsl(var(--accent-blue))]/20 hover:bg-[hsl(var(--accent-blue))]/30 text-[hsl(var(--accent-blue))] rounded-lg text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <Unlink className="w-3.5 h-3.5" />
                فصل عن الإطار
              </button>
            </div>
          </div>
        )}
        
        {/* Frame Info - عرض فقط عند تحديد إطار */}
        {selectedFrame && (
          <div className="mb-4 p-3 bg-[hsl(var(--accent-green))]/10 rounded-[10px] border border-[hsl(var(--accent-green))]/20">
            <h5 className="text-[12px] font-semibold text-[hsl(var(--ink))] mb-2 flex items-center gap-2">
              <Frame className="w-4 h-4" />
              معلومات الإطار المحدد
            </h5>
            <div className="space-y-1.5 text-[11px]">
              <p className="text-[hsl(var(--ink-60))]">
                <span className="font-medium">العنوان:</span> {(selectedFrame as any).title || 'بدون عنوان'}
              </p>
              <p className="text-[hsl(var(--ink-60))]">
                <span className="font-medium">العناصر المجمّعة:</span> {frameChildren.length}
              </p>
              {frameChildren.length > 0 && (
                <button
                  onClick={handleUngroup}
                  className="w-full mt-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-[11px] font-medium transition-colors"
                >
                  فك التجميع
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* ✅ متصفح الإطارات */}
        <div className="mb-4">
          <button
            onClick={() => setShowNavigator(!showNavigator)}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-[hsl(var(--panel))] hover:bg-[hsl(var(--panel))]/80 rounded-[10px] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[hsl(var(--ink-60))]" />
              <span className="text-[12px] font-medium text-[hsl(var(--ink))]">
                متصفح الإطارات
              </span>
            </div>
            <span className="text-[10px] text-[hsl(var(--ink-60))] bg-white px-1.5 py-0.5 rounded">
              {elements.filter(el => el.type === 'frame').length}
            </span>
          </button>
          
          {showNavigator && (
            <div className="mt-2 border border-[hsl(var(--border))] rounded-[10px] overflow-hidden">
              <FramesNavigator onClose={() => setShowNavigator(false)} />
            </div>
          )}
        </div>
        
        {/* Info */}
        <div className="p-3 bg-[hsl(var(--panel))] rounded-[10px] mb-4">
          <p className="text-[11px] text-[hsl(var(--ink-60))]">
            استخدم الأداة لرسم إطار حول العناصر لتجميعها كسياق واحد
          </p>
        </div>

        {/* Frame Title */}
        <div className="mb-4">
          <label className="text-[12px] text-[hsl(var(--ink-60))] mb-2 block">
            عنوان الإطار (اختياري)
          </label>
          <input
            type="text"
            value={frameSettings.title}
            onChange={handleTitleChange}
            placeholder="إطار جديد"
            className="w-full px-3 py-2 text-[12px] border border-[#DADCE0] rounded-[10px] outline-none focus:border-[hsl(var(--accent-green))] transition-colors"
          />
        </div>

        {/* Stroke Width */}
        <div className="mb-4">
          <label className="text-[12px] text-[hsl(var(--ink-60))] mb-2 block">
            سمك الحافة: {frameSettings.strokeWidth}px
          </label>
          <input
            type="range"
            min="0"
            max="8"
            value={frameSettings.strokeWidth}
            onChange={handleStrokeWidthChange}
            className="w-full accent-[hsl(var(--ink))]"
          />
        </div>

        {/* Activate Button */}
        <button
          onClick={handleActivateFrame}
          className="w-full py-2.5 bg-[hsl(var(--accent-blue))] hover:bg-[hsl(var(--accent-blue))]/90 text-white rounded-lg transition-colors text-[13px] font-medium"
        >
          تفعيل أداة الإطار
        </button>
      </div>

      {/* Info */}
      <div className="pt-4 border-t border-[#DADCE0]">
        <h5 className="text-[12px] font-semibold text-[hsl(var(--ink-60))] mb-2">
          نصائح الاستخدام
        </h5>
        <ul className="space-y-1.5 text-[11px] text-[hsl(var(--ink-60))]">
          <li>• ارسم إطاراً حول العناصر لتجميعها</li>
          <li>• اضغط Shift للرسم بنسبة متساوية</li>
          <li>• اضغط Alt للرسم من المركز</li>
          <li>• العناصر داخل الإطار تتحرك معه</li>
          <li>• اضغط F لتفعيل أداة الإطار</li>
        </ul>
      </div>
    </div>
  );
}
