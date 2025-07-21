import React, { useMemo, useCallback } from 'react';
import { CanvasElement } from '../types';
import { CanvasGrid } from './CanvasGrid';
import { CanvasElement as CanvasElementComponent } from './CanvasElement';
import { CanvasDrawingPreview } from './CanvasDrawingPreview';
import { CanvasStatusBar } from './CanvasStatusBar';
import { useCanvasPerformance } from '../../../hooks/useCanvasPerformance';

interface VirtualizedCanvasProps {
  showGrid: boolean;
  snapEnabled: boolean;
  zoom: number;
  canvasPosition: { x: number; y: number };
  elements: CanvasElement[];
  selectedElementId: string | null;
  selectedTool: string;
  canvasRef: React.RefObject<HTMLDivElement>;
  isDrawing: boolean;
  drawStart: { x: number; y: number } | null;
  drawEnd: { x: number; y: number } | null;
  isDragging: boolean;
  isResizing: boolean;
  isSelecting?: boolean;
  selectionBox?: { start: { x: number; y: number }; end: { x: number; y: number } } | null;
  canvasSize: { width: number; height: number };
  enableVirtualization?: boolean;
  onCanvasClick: (e: React.MouseEvent) => void;
  onCanvasMouseDown: (e: React.MouseEvent) => void;
  onCanvasMouseMove: (e: React.MouseEvent) => void;
  onCanvasMouseUp: () => void;
  onElementSelect: (id: string) => void;
  onElementMouseDown: (e: React.MouseEvent, elementId: string) => void;
  onElementMouseMove: (e: React.MouseEvent) => void;
  onElementMouseUp: () => void;
  onResizeMouseDown: (e: React.MouseEvent, handle: string) => void;
  onResizeMouseMove: (e: React.MouseEvent) => void;
  onToggleGrid: () => void;
  onToggleSnap: () => void;
}

const VirtualizedCanvas: React.FC<VirtualizedCanvasProps> = ({
  showGrid,
  snapEnabled,
  zoom,
  canvasPosition,
  elements,
  selectedElementId,
  selectedTool,
  canvasRef,
  isDrawing,
  drawStart,
  drawEnd,
  isDragging,
  isResizing,
  isSelecting = false,
  selectionBox = null,
  canvasSize,
  enableVirtualization = true,
  onCanvasClick,
  onCanvasMouseDown,
  onCanvasMouseMove,
  onCanvasMouseUp,
  onElementSelect,
  onElementMouseDown,
  onElementMouseMove,
  onElementMouseUp,
  onResizeMouseDown,
  onResizeMouseMove,
  onToggleGrid,
  onToggleSnap
}) => {
  // حساب viewport الحالي
  const viewport = useMemo(() => {
    const rect = canvasRef.current?.getBoundingClientRect();
    return {
      x: -canvasPosition.x,
      y: -canvasPosition.y,
      width: rect?.width || canvasSize.width,
      height: rect?.height || canvasSize.height,
      zoom,
      margin: 200 // هامش إضافي للـ smooth scrolling
    };
  }, [canvasPosition, canvasSize, zoom, canvasRef.current]);

  // استخدام performance hook
  const {
    visibleElements,
    performanceMetrics,
    isElementVisible,
    optimizePerformance
  } = useCanvasPerformance({
    elements,
    canvasSize,
    viewport,
    enableCulling: enableVirtualization
  });

  // تحسين cursor style
  const getCursorStyle = useCallback(() => {
    if (selectedTool === 'smart-element') return 'crosshair';
    if (selectedTool === 'smart-pen') return 'crosshair';
    if (selectedTool === 'hand') return 'grab';
    if (selectedTool === 'zoom') return 'zoom-in';
    if (selectedTool === 'select' && isDragging) return 'grabbing';
    if (selectedTool === 'select') return 'default';
    if (['shape', 'text', 'sticky'].includes(selectedTool)) return 'crosshair';
    return 'default';
  }, [selectedTool, isDragging]);

  // تحسين العناصر مع memoization
  const MemoizedElements = useMemo(() => {
    const elementsToRender = enableVirtualization ? visibleElements : elements;
    
    return elementsToRender.map((element) => (
      <CanvasElementComponent
        key={element.id}
        element={element}
        selectedElementId={selectedElementId}
        selectedTool={selectedTool}
        onElementSelect={onElementSelect}
        onElementMouseDown={onElementMouseDown}
        onElementMouseMove={onElementMouseMove}
        onElementMouseUp={onElementMouseUp}
        onResizeMouseDown={onResizeMouseDown}
      />
    ));
  }, [
    enableVirtualization,
    visibleElements,
    elements,
    selectedElementId,
    selectedTool,
    onElementSelect,
    onElementMouseDown,
    onElementMouseMove,
    onElementMouseUp,
    onResizeMouseDown
  ]);

  // عرض تحذيرات الأداء
  const performanceWarnings = optimizePerformance();

  return (
    <div className="relative w-full h-full bg-white overflow-hidden">
      {/* Performance warnings */}
      {performanceWarnings.shouldOptimize && (
        <div className="absolute top-2 right-2 z-50 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded text-xs">
          <div className="font-semibold">تحذير الأداء:</div>
          <div>العناصر المرئية: {performanceMetrics.visibleElements} / {performanceMetrics.totalElements}</div>
          <div>وقت الرسم: {performanceMetrics.renderTime.toFixed(2)}ms</div>
        </div>
      )}

      {/* الشبكة النقطية الشفافة */}
      <CanvasGrid showGrid={showGrid} />

      {/* منطقة الرسم */}
      <div
        ref={canvasRef}
        className="absolute inset-0"
        style={{
          transform: `scale(${zoom / 100}) translate(${canvasPosition.x}px, ${canvasPosition.y}px)`,
          cursor: getCursorStyle()
        }}
        onClick={onCanvasClick}
        onMouseDown={onCanvasMouseDown}
        onMouseMove={(e) => {
          onCanvasMouseMove(e);
          if (isDragging || isResizing) {
            if (isDragging) {
              onElementMouseMove(e);
            }
            if (isResizing) {
              onResizeMouseMove(e);
            }
          }
        }}
        onMouseUp={() => {
          onCanvasMouseUp();
          onElementMouseUp();
        }}
      >
        {/* عرض العناصر المحسنة */}
        {MemoizedElements}

        {/* معاينات الرسم */}
        <CanvasDrawingPreview
          isDrawing={isDrawing}
          drawStart={drawStart}
          drawEnd={drawEnd}
          selectedTool={selectedTool}
          isSelecting={isSelecting}
          selectionBox={selectionBox}
        />
      </div>

      {/* شريط الحالة السفلي */}
      <CanvasStatusBar
        elements={elements}
        selectedElementId={selectedElementId}
        zoom={zoom}
        selectedTool={selectedTool}
        showGrid={showGrid}
        snapEnabled={snapEnabled}
        onToggleGrid={onToggleGrid}
        onToggleSnap={onToggleSnap}
      />

      {/* معلومات الأداء (في وضع التطوير) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white p-2 rounded text-xs font-mono">
          <div>إجمالي العناصر: {performanceMetrics.totalElements}</div>
          <div>عناصر مرئية: {performanceMetrics.visibleElements}</div>
          <div>عناصر مخفية: {performanceMetrics.culledElements}</div>
          <div>وقت الرسم: {performanceMetrics.renderTime.toFixed(2)}ms</div>
          <div>الذاكرة: {performanceMetrics.memoryUsage.toFixed(1)}KB</div>
          <div>Virtualization: {enableVirtualization ? 'ON' : 'OFF'}</div>
        </div>
      )}
    </div>
  );
};

export default VirtualizedCanvas;