import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MiroGridBackground } from './MiroGridBackground';
import { useCanvasBasicState, useRefactoredCanvasInteraction, useCanvasElementManagement, useCanvasHistory } from '@/components/CanvasBoard/hooks';

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
  
  // Use canvas history for undo/redo
  const { saveToHistory } = useCanvasHistory();
  
  // Use element management
  const { elements, addElement, updateElement, deleteElement } = useCanvasElementManagement(saveToHistory);
  
  // Use basic state for selection
  const { selectedElements, setSelectedElements } = useCanvasBasicState();
  
  // Use refactored interaction handling
  const {
    isSelecting,
    selectionBox,
    isDragging,
    isResizing,
    handleSelectionStart,
    handleSelectionMove,
    handleSelectionEnd,
    handleElementMouseDown,
    handleElementMouseMove,
    handleElementMouseUp,
    handleTextClick
  } = useRefactoredCanvasInteraction(canvasRef);

  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Initialize with sample elements
  useEffect(() => {
    const sampleElements = [
      {
        id: '1',
        type: 'sticky',
        position: { x: 200, y: 150 },
        size: { width: 200, height: 200 },
        properties: {
          content: 'مرحباً بكم في لوحة التخطيط التشاركي',
          color: '#ffd966'
        }
      },
      {
        id: '2',
        type: 'sticky',
        position: { x: 450, y: 150 },
        size: { width: 200, height: 200 },
        properties: {
          content: 'ابدأوا بإضافة أفكاركم هنا',
          color: '#9fc5e8'
        }
      },
      {
        id: '3',
        type: 'sticky',
        position: { x: 325, y: 400 },
        size: { width: 200, height: 200 },
        properties: {
          content: 'يمكنكم التعاون معاً في الوقت الفعلي',
          color: '#b6d7a8'
        }
      }
    ];
    
    // Add sample elements if none exist
    if (elements.length === 0) {
      sampleElements.forEach(element => {
        addElement(element.type, element.position.x, element.position.y, element.size.width, element.size.height, element.properties.content);
      });
    }
  }, [elements.length, addElement]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'select') {
      handleSelectionStart(e, zoom, canvasPosition);
    } else if (selectedTool === 'hand' || e.button === 1) {
      setDragStart({ x: e.clientX - canvasPosition.x, y: e.clientY - canvasPosition.y });
      e.preventDefault();
    }
  }, [selectedTool, canvasPosition, zoom, handleSelectionStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isSelecting) {
      handleSelectionMove(e, zoom, canvasPosition);
    } else if (selectedTool === 'hand' && dragStart) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      onCanvasPositionChange({ x: newX, y: newY });
    }
    
    handleElementMouseMove(e, selectedElements, zoom, canvasPosition, updateElement);
  }, [isSelecting, selectedTool, dragStart, zoom, canvasPosition, handleSelectionMove, handleElementMouseMove, selectedElements, updateElement, onCanvasPositionChange]);

  const handleMouseUp = useCallback(() => {
    if (isSelecting) {
      handleSelectionEnd(elements, (ids: string[]) => {
        setSelectedElements(ids);
        if (ids.length > 0) {
          onElementSelect(ids[0]);
        }
      });
    }
    handleElementMouseUp();
    setDragStart({ x: 0, y: 0 });
  }, [isSelecting, elements, handleSelectionEnd, handleElementMouseUp, setSelectedElements, onElementSelect]);

  const handleElementClick = useCallback((elementId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (e.ctrlKey || e.metaKey) {
      // Multi-select
      setSelectedElements(prev => 
        prev.includes(elementId) 
          ? prev.filter(id => id !== elementId)
          : [...prev, elementId]
      );
    } else {
      setSelectedElements([elementId]);
      onElementSelect(elementId);
      onPropertiesPanelToggle();
    }
    
    handleElementMouseDown(e, elementId, selectedTool, elements, zoom, canvasPosition, onElementSelect, selectedElements, setSelectedElements);
  }, [selectedTool, elements, zoom, canvasPosition, selectedElements, setSelectedElements, onElementSelect, onPropertiesPanelToggle, handleElementMouseDown]);

  const handleCanvasClick = useCallback(() => {
    if (!isSelecting) {
      onElementSelect(null);
      setSelectedElements([]);
    }
  }, [isSelecting, onElementSelect, setSelectedElements]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'sticky') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left - canvasPosition.x) / zoom;
        const y = (e.clientY - rect.top - canvasPosition.y) / zoom;
        
        addElement('sticky', x - 100, y - 100, 200, 200, 'ملاحظة جديدة');
      }
    } else if (selectedTool === 'text') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left - canvasPosition.x) / zoom;
        const y = (e.clientY - rect.top - canvasPosition.y) / zoom;
        addElement('text', x, y, 200, 50, 'نص جديد');
      }
    }
  }, [selectedTool, canvasPosition, zoom, addElement, handleTextClick]);

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
              selectedElements.includes(element.id) ? 'ring-2 ring-blue-500 ring-offset-2' : ''
            }`}
            style={{
              left: element.position.x,
              top: element.position.y,
              width: element.size.width,
              height: element.size.height,
              backgroundColor: element.type === 'sticky' ? '#ffd966' : '#ffffff',
              transform: selectedElements.includes(element.id) ? 'scale(1.02)' : 'scale(1)'
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

        {/* Selection Box */}
        {isSelecting && selectionBox && (
          <div
            className="absolute border-2 border-blue-500 bg-blue-500/10 pointer-events-none"
            style={{
              left: Math.min(selectionBox.start.x, selectionBox.end.x),
              top: Math.min(selectionBox.start.y, selectionBox.end.y),
              width: Math.abs(selectionBox.end.x - selectionBox.start.x),
              height: Math.abs(selectionBox.end.y - selectionBox.start.y)
            }}
          />
        )}
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