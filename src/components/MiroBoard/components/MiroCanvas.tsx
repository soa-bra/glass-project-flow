import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MiroGridBackground } from './MiroGridBackground';

interface MiroCanvasProps {
  selectedTool: string;
  selectedElement: string | null;
  zoom: number;
  canvasPosition: { x: number; y: number };
  onElementSelect: (elementId: string | null) => void;
  onToolSelect: (tool: string) => void;
  onCanvasPositionChange: (position: { x: number; y: number }) => void;
  onPropertiesPanelToggle: () => void;
}

interface CanvasElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  color?: string;
}

export const MiroCanvas: React.FC<MiroCanvasProps> = ({
  selectedTool,
  selectedElement,
  zoom,
  canvasPosition,
  onElementSelect,
  onToolSelect,
  onCanvasPositionChange,
  onPropertiesPanelToggle
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elements, setElements] = useState<CanvasElement[]>([
    {
      id: '1',
      type: 'sticky',
      x: 200,
      y: 150,
      width: 200,
      height: 200,
      content: 'مرحباً بكم في لوحة التخطيط التشاركي',
      color: '#ffd966'
    },
    {
      id: '2',
      type: 'sticky',
      x: 450,
      y: 150,
      width: 200,
      height: 200,
      content: 'ابدأوا بإضافة أفكاركم هنا',
      color: '#9fc5e8'
    },
    {
      id: '3',
      type: 'sticky',
      x: 325,
      y: 400,
      width: 200,
      height: 200,
      content: 'يمكنكم التعاون معاً في الوقت الفعلي',
      color: '#b6d7a8'
    }
  ]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'hand' || e.button === 1) { // Middle mouse button or hand tool
      setIsDragging(true);
      setDragStart({ x: e.clientX - canvasPosition.x, y: e.clientY - canvasPosition.y });
      e.preventDefault();
    }
  }, [selectedTool, canvasPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      onCanvasPositionChange({ x: newX, y: newY });
    }
  }, [isDragging, dragStart, onCanvasPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleElementClick = useCallback((elementId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onElementSelect(elementId);
    onPropertiesPanelToggle();
  }, [onElementSelect, onPropertiesPanelToggle]);

  const handleCanvasClick = useCallback(() => {
    onElementSelect(null);
  }, [onElementSelect]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'sticky') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left - canvasPosition.x) / zoom;
        const y = (e.clientY - rect.top - canvasPosition.y) / zoom;
        
        const newElement: CanvasElement = {
          id: Date.now().toString(),
          type: 'sticky',
          x: x - 100,
          y: y - 100,
          width: 200,
          height: 200,
          content: 'ملاحظة جديدة',
          color: '#ffd966'
        };
        
        setElements(prev => [...prev, newElement]);
      }
    }
  }, [selectedTool, canvasPosition, zoom]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'v':
          onToolSelect('select');
          break;
        case 'h':
          onToolSelect('hand');
          break;
        case 's':
          onToolSelect('sticky');
          break;
        case 't':
          onToolSelect('text');
          break;
        case 'escape':
          onElementSelect(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToolSelect, onElementSelect]);

  return (
    <div
      ref={canvasRef}
      className={`w-full h-full relative overflow-hidden bg-gray-50 ${
        selectedTool === 'hand' || isDragging ? 'cursor-grab' : 'cursor-default'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCanvasClick}
      onDoubleClick={handleDoubleClick}
    >
      <MiroGridBackground zoom={zoom} position={canvasPosition} />
      
      {/* Canvas Content */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${zoom})`
        }}
      >
        {elements.map((element) => (
          <div
            key={element.id}
            className={`absolute cursor-pointer transition-all duration-200 ${
              selectedElement === element.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
            }`}
            style={{
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
              backgroundColor: element.color,
              transform: selectedElement === element.id ? 'scale(1.02)' : 'scale(1)'
            }}
            onClick={(e) => handleElementClick(element.id, e)}
          >
            {element.type === 'sticky' && (
              <div className="w-full h-full p-4 rounded-lg shadow-sm border border-black/10">
                <div 
                  className="w-full h-full text-sm font-medium text-gray-800 text-center flex items-center justify-center p-2"
                  dir="rtl"
                >
                  {element.content}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Cursor Helper */}
      {selectedTool !== 'select' && selectedTool !== 'hand' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-full text-sm z-10">
          {selectedTool === 'sticky' && 'انقر نقراً مزدوجاً لإضافة ملاحظة'}
          {selectedTool === 'text' && 'انقر لإضافة نص'}
          {selectedTool === 'pen' && 'اسحب للرسم'}
        </div>
      )}
    </div>
  );
};