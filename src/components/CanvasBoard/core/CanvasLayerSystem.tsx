import React, { useRef, useEffect } from 'react';
import { ElementRenderer } from './ElementRenderer';

interface Layer {
  id: string;
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  content?: string;
  color?: string;
  locked?: boolean;
  hidden?: boolean;
  authorId?: string;
}

interface CanvasLayerSystemProps {
  projectId: string;
  userId: string;
  selectedTool: string;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  layers: Layer[];
  setLayers: (layers: Layer[]) => void;
  enableSmartGrid?: boolean;
  enableElementLocking?: boolean;
  enableCollaborationIndicators?: boolean;
  showGrid?: boolean;
  snapEnabled?: boolean;
}

export const CanvasLayerSystem: React.FC<CanvasLayerSystemProps> = ({
  projectId,
  userId,
  selectedTool,
  selectedElementId,
  onSelectElement,
  layers,
  setLayers,
  enableSmartGrid = true,
  enableElementLocking = true,
  enableCollaborationIndicators = true,
  showGrid = true,
  snapEnabled = true
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // محاكاة حالة التعاون
  const isElementLockedByOther = (elementId: string) => {
    // محاكاة فحص إذا كان العنصر محجوز من مستخدم آخر
    return false;
  };

  const handleElementSelect = (elementId: string) => {
    onSelectElement(elementId);
  };

  const handleElementDrag = (elementId: string, newPos: { x: number; y: number }) => {
    setLayers(layers.map(layer => 
      layer.id === elementId 
        ? { ...layer, x: newPos.x, y: newPos.y }
        : layer
    ));
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // إلغاء التحديد عند النقر على مساحة فارغة
    onSelectElement(null);

    // إضافة عنصر جديد حسب الأداة المحددة
    if (selectedTool === 'text') {
      const newElement: Layer = {
        id: `text-${Date.now()}`,
        type: 'text',
        x: snapEnabled ? Math.round(x / 20) * 20 : x,
        y: snapEnabled ? Math.round(y / 20) * 20 : y,
        width: 120,
        height: 60,
        content: 'نص جديد',
        authorId: userId
      };
      setLayers([...layers, newElement]);
    } else if (selectedTool === 'sticky') {
      const newElement: Layer = {
        id: `sticky-${Date.now()}`,
        type: 'sticky',
        x: snapEnabled ? Math.round(x / 20) * 20 : x,
        y: snapEnabled ? Math.round(y / 20) * 20 : y,
        width: 150,
        height: 120,
        content: 'ملاحظة لاصقة',
        color: '#fef3c7',
        authorId: userId
      };
      setLayers([...layers, newElement]);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-white">
      {/* الشبكة الذكية */}
      {enableSmartGrid && showGrid && (
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(0, 0, 0, 0.3) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            backgroundPosition: '10px 10px'
          }}
        />
      )}

      {/* منطقة الرسم */}
      <div
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair"
        onClick={handleCanvasClick}
      >
        {/* العناصر */}
        {layers
          .filter(layer => !layer.hidden)
          .map(element => (
            <ElementRenderer
              key={element.id}
              element={element}
              selected={element.id === selectedElementId}
              lockedByOther={enableElementLocking && isElementLockedByOther(element.id)}
              onSelect={() => handleElementSelect(element.id)}
              onDrag={(newPos) => handleElementDrag(element.id, newPos)}
            />
          ))}
      </div>

      {/* مؤشرات التعاون */}
      {enableCollaborationIndicators && (
        <div className="absolute top-4 right-4 flex gap-2">
          {/* محاكاة مؤشرات المستخدمين النشطين */}
        </div>
      )}
    </div>
  );
};