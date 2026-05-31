import React, { useRef, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';
import { selectViewport, selectSettings } from '@/features/planning/state/slices/viewportSlice';

const Minimap: React.FC = () => {
  // استخدام selectors محددة لتجنب rerenders غير ضرورية
  const elements = useCanvasStore(state => state.elements);
  const viewport = useCanvasStore(selectViewport);
  const { showMinimap } = useCanvasStore(selectSettings);
  const toggleMinimap = useCanvasStore(state => state.toggleMinimap);
  const setPan = useCanvasStore(state => state.setPan);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  
  const minimapScale = 0.1; // 10% of actual size
  const minimapWidth = 200;
  const minimapHeight = 150;
  
  useEffect(() => {
    if (!showMinimap || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, minimapWidth, minimapHeight);
    
    // Draw elements
    ctx.save();
    ctx.scale(minimapScale, minimapScale);
    
    elements.forEach(element => {
      if (!element.visible) return;
      
      ctx.fillStyle = element.style?.backgroundColor || '#FFFFFF';
      ctx.strokeStyle = element.style?.borderColor || '#000000';
      ctx.lineWidth = 1 / minimapScale;
      
      ctx.fillRect(
        element.position.x,
        element.position.y,
        element.size.width,
        element.size.height
      );
      ctx.strokeRect(
        element.position.x,
        element.position.y,
        element.size.width,
        element.size.height
      );
    });
    
    ctx.restore();
    
    // Draw viewport rectangle
    const viewportRect = {
      x: -viewport.pan.x * minimapScale,
      y: -viewport.pan.y * minimapScale,
      width: (window.innerWidth / viewport.zoom) * minimapScale,
      height: (window.innerHeight / viewport.zoom) * minimapScale
    };
    
    ctx.strokeStyle = '#3DBE8B';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      viewportRect.x,
      viewportRect.y,
      viewportRect.width,
      viewportRect.height
    );
    
  }, [elements, viewport, showMinimap, minimapScale]);
  
  const handleMinimapClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // تحويل إحداثيات الخريطة المصغرة إلى إحداثيات الكانفس
    const targetX = x / minimapScale;
    const targetY = y / minimapScale;
    
    // حساب pan الجديد ليكون المركز عند النقطة المحددة
    const newPanX = -(targetX - window.innerWidth / viewport.zoom / 2);
    const newPanY = -(targetY - window.innerHeight / viewport.zoom / 2);
    
    setPan(newPanX, newPanY);
  }, [viewport.zoom, setPan, minimapScale]);
  
  if (!showMinimap) return null;
  
  return (
    <div 
      className="fixed bottom-32 right-6 z-40 bg-white rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-sb-border p-3"
      style={{ width: minimapWidth + 24 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[12px] font-semibold text-sb-ink">الخريطة المصغرة</h4>
        <button
          onClick={toggleMinimap}
          className="p-1 hover:bg-sb-panel-bg rounded transition-colors"
        >
          <X size={14} className="text-sb-ink-40" />
        </button>
      </div>
      
      <canvas
        ref={canvasRef}
        width={minimapWidth}
        height={minimapHeight}
        onClick={handleMinimapClick}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseMove={(e) => isDragging && handleMinimapClick(e)}
        className="border border-sb-border rounded cursor-pointer bg-sb-panel-bg"
      />
      
      <p className="text-[10px] text-sb-ink-40 mt-2 text-center">
        انقر للتنقل السريع
      </p>
    </div>
  );
};

export default Minimap;
