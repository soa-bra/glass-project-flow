import React from 'react';
import { useCanvasStore, type ToolId } from '@/stores/canvasStore';

const toolInstructions: Record<ToolId, string> = {
  selection_tool: 'انقر لتحديد • اسحب لتحديد متعدد • Shift للتحديد المتعدد',
  text_tool: 'انقر في أي مكان لإضافة نص',
  shapes_tool: 'انقر واسحب لرسم الشكل • Shift للنسب المتساوية',
  smart_pen: 'اضغط واسحب للرسم الحر • Alt للوضع الذكي (تحويل لأشكال)',
  frame_tool: 'انقر واسحب لإنشاء إطار حاوية',
  file_uploader: 'انقر لاختيار ملف • أو اسحب وأفلت الملفات هنا',
  smart_element_tool: 'اختر عنصراً ذكياً من اللوحة الجانبية ثم انقر لإضافته',
};

export default function InstructionsOverlay() {
  const { activeTool } = useCanvasStore();
  
  // لا نعرض التعليمات لأداة التحديد (الافتراضية)
  if (activeTool === 'selection_tool') return null;
  
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[hsl(var(--ink))]/90 backdrop-blur-sm rounded-[10px] px-4 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.24)] text-[12px] text-white pointer-events-none z-50">
      {toolInstructions[activeTool]}
    </div>
  );
}
