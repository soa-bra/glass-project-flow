import React, { useRef, useCallback, useEffect, useMemo, useState } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { useSmartElementsStore } from '@/stores/smartElementsStore';
import CanvasElement from './CanvasElement';
import DrawingPreview from './DrawingPreview';
import SelectionBox, { useSelectionBox } from './SelectionBox';
import StrokesLayer from './StrokesLayer';
import PenInputLayer from './PenInputLayer';
import FrameInputLayer from './FrameInputLayer';
import { BoundingBox } from './BoundingBox';
import { SnapGuides } from './SnapGuides';
import { useToolInteraction } from '@/hooks/useToolInteraction';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { canvasKernel, getContainerRect } from '@/core/canvasKernel';
import { toast } from 'sonner';
import { PenFloatingToolbar } from '@/components/ui/pen-floating-toolbar';
import { CanvasGridLayer } from './CanvasGridLayer';
import { RealtimeSyncManager } from './collaboration';
import { useCollaborationUser } from '@/hooks/useCollaborationUser';
import MindMapConnectionLine from './MindMapConnectionLine';
import MindMapToolbar from './MindMapToolbar';
import { findNearestAnchor, calculateConnectorBounds, type NodeAnchorPoint, type MindMapConnectorData } from '@/types/mindmap-canvas';
import type { SnapLine } from '@/core/snapEngine';

interface InfiniteCanvasProps {
  boardId: string;
}
const InfiniteCanvas: React.FC<InfiniteCanvasProps> = ({
  boardId
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    elements,
    viewport,
    settings,
    selectedElementIds,
    layers,
    activeTool,
    tempElement,
    setPan,
    setZoom,
    clearSelection,
    selectElement,
    selectElements,
    undo,
    redo,
    toggleGrid,
    deleteElements,
    copyElements,
    pasteElements,
    cutElements,
    moveElements,
    groupElements,
    ungroupElements
  } = useCanvasStore();
  const {
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp
  } = useToolInteraction(containerRef);

  // ✅ Sprint 4: استخدام Selection Box hook
  const { finishSelection } = useSelectionBox();

  // Enable keyboard shortcuts
  useKeyboardShortcuts();
  
  // ✅ Sprint 17: هوية المستخدم المحفوظة للتعاون
  const collaborationUser = useCollaborationUser();

  // Pan State
  const isPanningRef = useRef(false);
  const lastPanPositionRef = useRef({
    x: 0,
    y: 0
  });

  // Selection Box State
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectionCurrent, setSelectionCurrent] = useState<{
    x: number;
    y: number;
  } | null>(null);
  
  // ✅ Sprint 5: Snap Guides State
  const [snapGuides, setSnapGuides] = useState<SnapLine[]>([]);
  
  // ✅ Mind Map Connection State
  const [mindMapConnection, setMindMapConnection] = useState<{
    isConnecting: boolean;
    sourceNodeId: string | null;
    sourceAnchor: 'top' | 'bottom' | 'left' | 'right' | null;
    startPosition: { x: number; y: number } | null;
    currentPosition: { x: number; y: number } | null;
    nearestAnchor: NodeAnchorPoint | null;
  }>({
    isConnecting: false,
    sourceNodeId: null,
    sourceAnchor: null,
    startPosition: null,
    currentPosition: null,
    nearestAnchor: null
  });
  
  // Mind Map: بدء التوصيل من عقدة
  const handleStartConnection = useCallback((
    nodeId: string, 
    anchor: 'top' | 'bottom' | 'left' | 'right', 
    position: { x: number; y: number }
  ) => {
    setMindMapConnection({
      isConnecting: true,
      sourceNodeId: nodeId,
      sourceAnchor: anchor,
      startPosition: position,
      currentPosition: position,
      nearestAnchor: null
    });
  }, []);
  
  // Mind Map: إنهاء التوصيل في عقدة
  const handleEndConnection = useCallback((
    nodeId: string, 
    anchor: 'top' | 'bottom' | 'left' | 'right'
  ) => {
    if (!mindMapConnection.isConnecting || !mindMapConnection.sourceNodeId) return;
    if (mindMapConnection.sourceNodeId === nodeId) return; // لا يمكن الربط بنفس العقدة
    
    const sourceNode = elements.find(el => el.id === mindMapConnection.sourceNodeId);
    if (!sourceNode) return;
    
    // ✅ البحث عن العنصر الهدف (أي نوع وليس فقط mindmap_node)
    const targetNode = elements.find(el => el.id === nodeId);
    if (!targetNode) return;
    
    const connectorBounds = calculateConnectorBounds(sourceNode, targetNode);
    
    useCanvasStore.getState().addElement({
      type: 'mindmap_connector',
      position: connectorBounds.position,
      size: connectorBounds.size,
      data: {
        startNodeId: mindMapConnection.sourceNodeId,
        endNodeId: nodeId,
        startAnchor: { nodeId: mindMapConnection.sourceNodeId, anchor: mindMapConnection.sourceAnchor },
        endAnchor: { nodeId, anchor },
        curveStyle: 'bezier',
        color: sourceNode.data?.color || '#3DA8F5',
        strokeWidth: 2
      } as MindMapConnectorData
    });
    
    // إعادة تعيين حالة التوصيل
    setMindMapConnection({
      isConnecting: false,
      sourceNodeId: null,
      sourceAnchor: null,
      startPosition: null,
      currentPosition: null,
      nearestAnchor: null
    });
  }, [mindMapConnection, elements]);
  
  // Mind Map: تحديث موقع السحب والبحث عن أقرب عقدة
  const updateConnectionPosition = useCallback((clientX: number, clientY: number) => {
    if (!mindMapConnection.isConnecting) return;
    
    const containerRect = getContainerRect(containerRef);
    if (!containerRect) return;
    
    const canvasPoint = canvasKernel.screenToWorld(clientX, clientY, viewport, containerRect);
    
    // ✅ البحث عن أقرب عنصر قابل للربط (جميع الأنواع)
    const connectableElements = elements.filter(el => {
      // استثناء العقدة المصدر
      if (el.id === mindMapConnection.sourceNodeId) return false;
      // استثناء الـ connectors
      if (el.type === 'mindmap_connector' || el.type === 'visual_connector') return false;
      // قبول جميع أنواع العناصر الأخرى
      return ['mindmap_node', 'visual_node', 'shape', 'text', 'image', 'sticky', 'frame', 'smart', 'file'].includes(el.type);
    });
    
    let nearest: NodeAnchorPoint | null = null;
    let nearestDistance = 60; // عتبة الـ snap أكبر للسهولة
    
    for (const node of connectableElements) {
      const result = findNearestAnchor(canvasPoint, node.position, node.size);
      if (result.distance < nearestDistance) {
        nearestDistance = result.distance;
        nearest = {
          id: `${node.id}-${result.anchor}`,
          nodeId: node.id,
          anchor: result.anchor,
          position: result.position
        };
      }
    }
    
    setMindMapConnection(prev => ({
      ...prev,
      currentPosition: canvasPoint,
      nearestAnchor: nearest
    }));
  }, [mindMapConnection.isConnecting, mindMapConnection.sourceNodeId, elements, viewport]);
  
  // إلغاء التوصيل عند النقر على الكانفس
  const cancelConnection = useCallback(() => {
    if (mindMapConnection.isConnecting) {
      setMindMapConnection({
        isConnecting: false,
        sourceNodeId: null,
        sourceAnchor: null,
        startPosition: null,
        currentPosition: null,
        nearestAnchor: null
      });
    }
  }, [mindMapConnection.isConnecting]);

  // ✅ استخدام Canvas Kernel لحساب حدود العرض
  const viewportBounds = useMemo(() => {
    const containerWidth = containerRef.current?.clientWidth || window.innerWidth;
    const containerHeight = containerRef.current?.clientHeight || window.innerHeight;
    return canvasKernel.getVisibleBounds(viewport, containerWidth, containerHeight);
  }, [viewport]);

  // Virtualized elements (only render visible ones)
  const visibleElements = useMemo(() => {
    const padding = 200;
    return elements.filter(el => {
      const layer = layers.find(l => l.id === el.layerId);
      if (!layer?.visible || !el.visible) return false;
      
      // ✅ الـ connectors دائماً مرئية - لديها منطق خاص للرؤية داخل المكون
      if (el.type === 'mindmap_connector') return true;
      
      return el.position.x + el.size.width >= viewportBounds.x - padding && el.position.x <= viewportBounds.x + viewportBounds.width + padding && el.position.y + el.size.height >= viewportBounds.y - padding && el.position.y <= viewportBounds.y + viewportBounds.height + padding;
    });
  }, [elements, viewportBounds, layers]);

  // ✅ Grid rendering moved to CanvasGridLayer component (Sprint 2)

  // ✅ استخدام Canvas Kernel للمحاذاة
  const snapToGrid = useCallback((x: number, y: number) => {
    return canvasKernel.snapToGrid({ x, y }, settings.gridSize, settings.snapToGrid);
  }, [settings.snapToGrid, settings.gridSize]);

  // Handle Wheel (Zoom)
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const delta = -e.deltaY * 0.001;
      const newZoom = viewport.zoom * (1 + delta);
      setZoom(newZoom);
    } else {
      // Pan
      setPan(viewport.pan.x - e.deltaX, viewport.pan.y - e.deltaY);
    }
  }, [viewport, setZoom, setPan]);

  // Handle Mouse Down (Start Pan or Selection)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || e.button === 0 && e.altKey) {
      // Middle mouse or Alt+Click = Pan
      isPanningRef.current = true;
      lastPanPositionRef.current = {
        x: e.clientX,
        y: e.clientY
      };
      if (containerRef.current) {
        containerRef.current.style.cursor = 'grabbing';
      }
      e.preventDefault();
    } else if (e.button === 0 && activeTool === 'selection_tool' && 
               !(e.target as HTMLElement).closest('[data-canvas-element="true"]') &&
               !(e.target as HTMLElement).closest('.bounding-box')) {
      // Selection Box with selection tool on empty space
      if (!e.shiftKey) {
        clearSelection();
      }
      setIsSelecting(true);
      
      // حساب الإحداثيات النسبية للـ container
      const containerRect = containerRef.current?.getBoundingClientRect();
      const relativeX = e.clientX - (containerRect?.left || 0);
      const relativeY = e.clientY - (containerRect?.top || 0);
      
      setSelectionStart({
        x: relativeX,
        y: relativeY,
        shiftKey: e.shiftKey
      } as any);
      setSelectionCurrent({
        x: relativeX,
        y: relativeY
      });
    } else if (e.button === 0 && (activeTool === 'file_uploader' || activeTool === 'frame_tool' || activeTool === 'smart_pen' || activeTool === 'shapes_tool' || activeTool === 'text_tool' || activeTool === 'smart_element_tool')) {
      // تفويض للأداة النشطة
      handleCanvasMouseDown(e);
    } else if (e.button === 0 && !(e.target as HTMLElement).closest('[data-canvas-element="true"]') && !(e.target as HTMLElement).closest('.bounding-box')) {
      // Left click on empty space = Always clear selection
      clearSelection();
    }
  }, [activeTool, handleCanvasMouseDown, clearSelection]);

  // Handle Mouse Move (Pan or Drawing or Selection)
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // ✅ تحديث خط اتصال الخريطة الذهنية أثناء السحب
    if (mindMapConnection.isConnecting) {
      updateConnectionPosition(e.clientX, e.clientY);
    }
    
    if (isPanningRef.current) {
      const deltaX = e.clientX - lastPanPositionRef.current.x;
      const deltaY = e.clientY - lastPanPositionRef.current.y;
      setPan(viewport.pan.x + deltaX, viewport.pan.y + deltaY);
      lastPanPositionRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    } else if (isSelecting) {
      // حساب الإحداثيات النسبية للـ container
      const containerRect = containerRef.current?.getBoundingClientRect();
      const relativeX = e.clientX - (containerRect?.left || 0);
      const relativeY = e.clientY - (containerRect?.top || 0);
      
      setSelectionCurrent({
        x: relativeX,
        y: relativeY
      });
    } else {
      handleCanvasMouseMove(e);
    }
  }, [viewport, setPan, handleCanvasMouseMove, isSelecting, mindMapConnection.isConnecting, updateConnectionPosition]);

  // Handle Mouse Up (Stop Pan or Drawing or Selection)
  const handleMouseUp = useCallback(() => {
    // ✅ إلغاء اتصال الخريطة الذهنية عند الإفلات (سواء تم التوصيل أم لا)
    if (mindMapConnection.isConnecting) {
      cancelConnection();
    }
    
    isPanningRef.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = 'default';
    }

    // ✅ Sprint 4: Handle Selection Box completion using Canvas Kernel
    if (isSelecting && selectionStart && selectionCurrent) {
      const boxWidth = Math.abs(selectionCurrent.x - selectionStart.x);
      const boxHeight = Math.abs(selectionCurrent.y - selectionStart.y);

      // إذا كان الصندوق صغيراً جداً (< 5px)، اعتباره نقرة وليس تحديد
      if (boxWidth < 5 && boxHeight < 5) {
        if (!(selectionStart as any).shiftKey) {
          clearSelection();
        }
      } else {
        // ✅ استخدام finishSelection من useSelectionBox
        finishSelection(
          selectionStart.x,
          selectionStart.y,
          selectionCurrent.x,
          selectionCurrent.y,
          (selectionStart as any).shiftKey
        );
      }
      
      setIsSelecting(false);
      setSelectionStart(null);
      setSelectionCurrent(null);
    }
    handleCanvasMouseUp();
  }, [handleCanvasMouseUp, isSelecting, selectionStart, selectionCurrent, finishSelection, clearSelection, mindMapConnection.isConnecting, cancelConnection]);

  // ✅ تم نقل جميع Keyboard Shortcuts إلى useKeyboardShortcuts hook
  // لتجنب التكرار والتعارض - الآن هناك مصدر واحد فقط للاختصارات

  // Wheel event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('wheel', handleWheel, {
      passive: false
    });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Handle file drop on canvas
  // ✅ استخدام Canvas Kernel لإسقاط الملفات والعناصر الذكية
  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    const containerRect = getContainerRect(containerRef);
    if (!containerRect) return;
    const canvasPoint = canvasKernel.screenToWorld(e.clientX, e.clientY, viewport, containerRect);
    
    // ✅ التحقق من السحب للعناصر الذكية أولاً
    const smartElementData = e.dataTransfer.getData('application/smart-element');
    if (smartElementData) {
      try {
        const { type, name } = JSON.parse(smartElementData);
        const { addSmartElement } = useSmartElementsStore.getState();
        addSmartElement(type, canvasPoint, { title: name });
        toast.success(`تم إدراج ${name}`);
        return;
      } catch (err) {
        console.error('Failed to parse smart element data:', err);
      }
    }
    
    // ✅ معالجة إسقاط الملفات
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    const file = e.dataTransfer.files[0];
    
    if (file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      useCanvasStore.getState().addElement({
        type: 'image',
        position: canvasPoint,
        size: {
          width: 300,
          height: 200
        },
        src: imageUrl,
        alt: file.name
      });
      toast.success(`تم إدراج الصورة: ${file.name}`);
    } else {
      useCanvasStore.getState().addElement({
        type: 'file',
        position: canvasPoint,
        size: {
          width: 250,
          height: 120
        },
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileUrl: URL.createObjectURL(file)
      });
      toast.success(`تم إدراج الملف: ${file.name}`);
    }
  }, [viewport]);
  const handleFileDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // تحديد نوع المؤشر حسب الأداة النشطة
  const getCursorStyle = () => {
    switch (activeTool) {
      case 'text_tool':
        return 'text';
      case 'smart_pen':
        return 'crosshair';
      case 'shapes_tool':
        return 'crosshair';
      case 'frame_tool':
        return 'crosshair';
      case 'file_uploader':
        return 'copy';
      case 'smart_element_tool':
        return 'crosshair';
      default:
        return 'default';
    }
  };
  return <div ref={containerRef} data-canvas-container="true" className="relative w-full h-full overflow-hidden infinite-canvas-container" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onDrop={handleFileDrop} onDragOver={handleFileDragOver} style={{
    backgroundColor: settings.background,
    cursor: getCursorStyle()
  }}>
      {/* ✅ Grid Layer - خارج الطبقة المتحركة لتغطية كامل الشاشة */}
      <CanvasGridLayer />
      
      {/* Canvas Container - الطبقة المتحركة للعناصر فقط */}
      <div ref={canvasRef} className="absolute inset-0 origin-top-left" style={{
      transform: `translate(${viewport.pan.x}px, ${viewport.pan.y}px) scale(${viewport.zoom})`,
      transition: 'none'
    }}>
        {/* Pen Strokes Layer */}
        <StrokesLayer />
        
        {/* Canvas Elements */}
        {visibleElements.map(element => (
          <CanvasElement 
            key={element.id} 
            element={element} 
            isSelected={selectedElementIds.includes(element.id)} 
            onSelect={multiSelect => selectElement(element.id, multiSelect)} 
            snapToGrid={settings.snapToGrid ? snapToGrid : undefined} 
            activeTool={activeTool}
            onStartConnection={handleStartConnection}
            onEndConnection={handleEndConnection}
            isConnecting={mindMapConnection.isConnecting}
            nearestAnchor={mindMapConnection.nearestAnchor}
          />
        ))}
        
        {/* Mind Map Connection Line (during drag) */}
        {mindMapConnection.isConnecting && mindMapConnection.startPosition && mindMapConnection.currentPosition && (
          <MindMapConnectionLine
            startPosition={mindMapConnection.startPosition}
            endPosition={mindMapConnection.nearestAnchor?.position || mindMapConnection.currentPosition}
            startAnchor={mindMapConnection.sourceAnchor || 'right'}
            color={elements.find(el => el.id === mindMapConnection.sourceNodeId)?.data?.color}
          />
        )}
        
        {/* BoundingBox for selected elements with Snap Engine */}
        <BoundingBox onGuidesChange={setSnapGuides} />
        
        {/* Drawing Preview */}
        {tempElement && <DrawingPreview element={tempElement} />}
      </div>
      
      {/* Selection Box */}
      {isSelecting && selectionStart && selectionCurrent && <SelectionBox startX={selectionStart.x} startY={selectionStart.y} currentX={selectionCurrent.x} currentY={selectionCurrent.y} />}
      
      {/* ✅ Sprint 5: Snap Guides */}
      <SnapGuides guides={snapGuides} containerRef={containerRef} />
      
      {/* Pen Input Layer */}
      <PenInputLayer 
        containerRef={containerRef} 
        active={activeTool === 'smart_pen'} 
      />
      
      {/* Frame Input Layer */}
      <FrameInputLayer 
        containerRef={containerRef} 
        active={activeTool === 'frame_tool'} 
      />
      
      {/* Pen Floating Toolbar */}
      <PenFloatingToolbar
        position={{ x: window.innerWidth / 2, y: 80 }}
        isVisible={activeTool === 'smart_pen'}
      />
      
      {/* Mind Map Floating Toolbar */}
      {selectedElementIds.length > 0 && elements.some(el => 
        selectedElementIds.includes(el.id) && el.type === 'mindmap_node'
      ) && (
        <MindMapToolbar selectedNodeIds={selectedElementIds.filter(id => 
          elements.find(el => el.id === id)?.type === 'mindmap_node'
        )} />
      )}
      
      {/* ✅ Sprint 17: Real-time Collaboration Sync Manager */}
      <RealtimeSyncManager
        boardId={boardId}
        userId={collaborationUser.id}
        userName={collaborationUser.name}
        enabled={true}
        viewport={viewport}
        onSyncStatusChange={(status) => {
          console.log('Sync status:', status);
        }}
      />
      
    </div>;
};
export default InfiniteCanvas;