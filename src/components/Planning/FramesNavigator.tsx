/**
 * Frames Navigator - متصفح الإطارات
 * يعرض قائمة بجميع الإطارات مع إمكانية التنقل السريع
 */

import React, { useMemo } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { Frame, ChevronRight, Eye, Layers } from 'lucide-react';
import type { CanvasElement } from '@/types/canvas';

interface FramesNavigatorProps {
  onClose?: () => void;
}

export default function FramesNavigator({ onClose }: FramesNavigatorProps) {
  const { elements, viewport, setPan, selectElements, selectedElementIds } = useCanvasStore();
  
  // الحصول على جميع الإطارات
  const frames = useMemo(() => 
    elements.filter(el => el.type === 'frame') as (CanvasElement & { 
      title?: string; 
      children?: string[] 
    })[],
    [elements]
  );
  
  // التنقل إلى إطار معين
  const navigateToFrame = (frame: CanvasElement) => {
    const centerX = frame.position.x + frame.size.width / 2;
    const centerY = frame.position.y + frame.size.height / 2;
    
    // حساب الـ pan الجديد لتوسيط الإطار
    const newPanX = -centerX + (window.innerWidth / 2) / viewport.zoom;
    const newPanY = -centerY + (window.innerHeight / 2) / viewport.zoom;
    
    setPan(newPanX, newPanY);
    
    // تحديد الإطار
    selectElements([frame.id]);
  };
  
  if (frames.length === 0) {
    return (
      <div className="p-4 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[hsl(var(--panel))] flex items-center justify-center">
          <Layers className="w-6 h-6 text-[hsl(var(--ink-30))]" />
        </div>
        <p className="text-[13px] text-[hsl(var(--ink-60))]">
          لا توجد إطارات
        </p>
        <p className="text-[11px] text-[hsl(var(--ink-30))] mt-1">
          استخدم أداة الإطار (F) لإنشاء إطار جديد
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {/* العنوان */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[hsl(var(--border))]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[hsl(var(--ink-60))]" />
          <span className="text-[13px] font-semibold text-[hsl(var(--ink))]">
            الإطارات
          </span>
          <span className="text-[11px] text-[hsl(var(--ink-60))] bg-[hsl(var(--panel))] px-1.5 py-0.5 rounded">
            {frames.length}
          </span>
        </div>
      </div>
      
      {/* قائمة الإطارات */}
      <div className="space-y-1 px-2 max-h-[300px] overflow-y-auto">
        {frames.map((frame) => {
          const isSelected = selectedElementIds.includes(frame.id);
          const childCount = frame.children?.length || 0;
          
          return (
            <button
              key={frame.id}
              onClick={() => navigateToFrame(frame)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all text-right ${
                isSelected 
                  ? 'bg-[hsl(var(--accent-blue))]/10 border border-[hsl(var(--accent-blue))]/30' 
                  : 'hover:bg-[hsl(var(--panel))] border border-transparent'
              }`}
            >
              {/* أيقونة الإطار */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isSelected 
                  ? 'bg-[hsl(var(--accent-blue))] text-white' 
                  : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink-60))]'
              }`}>
                <Frame className="w-4 h-4" />
              </div>
              
              {/* معلومات الإطار */}
              <div className="flex-1 min-w-0">
                <p className={`text-[12px] font-medium truncate ${
                  isSelected ? 'text-[hsl(var(--accent-blue))]' : 'text-[hsl(var(--ink))]'
                }`}>
                  {frame.title || 'إطار بدون عنوان'}
                </p>
                <p className="text-[10px] text-[hsl(var(--ink-60))]">
                  {childCount > 0 ? `${childCount} عنصر` : 'فارغ'}
                </p>
              </div>
              
              {/* زر المعاينة */}
              <div className="flex items-center gap-1 text-[hsl(var(--ink-30))]">
                <Eye className="w-3.5 h-3.5" />
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}
      </div>
      
      {/* نصيحة */}
      <div className="px-3 py-2 border-t border-[hsl(var(--border))]">
        <p className="text-[10px] text-[hsl(var(--ink-30))]">
          انقر على إطار للانتقال إليه وتحديده
        </p>
      </div>
    </div>
  );
}
