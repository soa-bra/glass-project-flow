import React from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { RectangleHorizontal, Square, Circle } from 'lucide-react';
import { toast } from 'sonner';

export default function FramePanel() {
  const { toolSettings, updateToolSettings, setActiveTool, selectedElementIds, elements, ungroupFrame } = useCanvasStore();
  const frameSettings = toolSettings.frame;

  // الحصول على الإطار المحدد إذا وجد
  const selectedFrame = selectedElementIds.length === 1 
    ? elements.find(el => el.id === selectedElementIds[0] && el.type === 'frame')
    : null;

  const frameChildren = selectedFrame 
    ? elements.filter(el => (selectedFrame as any).children?.includes(el.id))
    : [];

  const handleUngroup = () => {
    if (selectedFrame) {
      ungroupFrame(selectedFrame.id);
      toast.success('تم فك التجميع');
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateToolSettings('frame', { title: e.target.value });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateToolSettings('frame', { backgroundColor: e.target.value });
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateToolSettings('frame', { opacity: parseFloat(e.target.value) });
  };

  const handleStrokeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateToolSettings('frame', { strokeWidth: parseInt(e.target.value) });
  };

  const handleStyleChange = (style: 'rectangle' | 'rounded' | 'circle') => {
    updateToolSettings('frame', { frameStyle: style });
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

        {/* Frame Style */}
        <div className="mb-4">
          <label className="text-[12px] text-[hsl(var(--ink-60))] mb-2 block">
            نمط الإطار
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleStyleChange('rectangle')}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                frameSettings.frameStyle === 'rectangle'
                  ? 'bg-[hsl(var(--ink))] text-white'
                  : 'bg-[hsl(var(--panel))] hover:bg-[rgba(217,231,237,0.8)]'
              }`}
            >
              <RectangleHorizontal size={20} />
              <span className="text-[10px]">مستطيل</span>
            </button>
            <button
              onClick={() => handleStyleChange('rounded')}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                frameSettings.frameStyle === 'rounded'
                  ? 'bg-[hsl(var(--ink))] text-white'
                  : 'bg-[hsl(var(--panel))] hover:bg-[rgba(217,231,237,0.8)]'
              }`}
            >
              <Square size={20} />
              <span className="text-[10px]">دائري</span>
            </button>
            <button
              onClick={() => handleStyleChange('circle')}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                frameSettings.frameStyle === 'circle'
                  ? 'bg-[hsl(var(--ink))] text-white'
                  : 'bg-[hsl(var(--panel))] hover:bg-[rgba(217,231,237,0.8)]'
              }`}
            >
              <Circle size={20} />
              <span className="text-[10px]">بيضاوي</span>
            </button>
          </div>
        </div>

        {/* Background Color */}
        <div className="mb-4">
          <label className="text-[12px] text-[hsl(var(--ink-60))] mb-2 block">
            لون الخلفية
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={frameSettings.backgroundColor}
              onChange={handleColorChange}
              className="w-12 h-10 rounded-lg border border-[hsl(var(--border))] cursor-pointer"
            />
            <input
              type="text"
              value={frameSettings.backgroundColor}
              onChange={handleColorChange}
              className="flex-1 px-3 py-2 bg-[hsl(var(--panel))] rounded-lg text-[12px] font-mono"
            />
          </div>
        </div>

        {/* Opacity */}
        <div className="mb-4">
          <label className="text-[12px] text-[hsl(var(--ink-60))] mb-2 block">
            شفافية الخلفية: {Math.round(frameSettings.opacity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={frameSettings.opacity}
            onChange={handleOpacityChange}
            className="w-full accent-[hsl(var(--ink))]"
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
