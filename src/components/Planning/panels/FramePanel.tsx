import React, { useMemo } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { toast } from 'sonner';

export default function FramePanel() {
  const { toolSettings, updateToolSettings, setActiveTool, selectedElementIds, elements, ungroupFrame } = useCanvasStore();
  const frameSettings = toolSettings.frame;

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

  const handleUngroup = () => {
    if (selectedFrame) {
      ungroupFrame(selectedFrame.id);
      toast.success('تم فك التجميع');
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
        
        {/* Frame Info - عرض فقط عند تحديد إطار */}
        {selectedFrame && (
          <div className="mb-4 p-3 bg-[hsl(var(--accent-green))]/10 rounded-[10px] border border-[hsl(var(--accent-green))]/20">
            <h5 className="text-[12px] font-semibold text-[hsl(var(--ink))] mb-2">
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
