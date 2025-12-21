// InfiniteCanvas - v2 optimized connection handling
import React, { useRef, useCallback, useEffect, useMemo, useState } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { useInteractionStore, selectPanningData, selectBoxSelectData } from '@/stores/interactionStore';
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
import { useTouchGestures } from '@/hooks/useTouchGestures';
import { canvasKernel, getContainerRect } from '@/core/canvasKernel';
import { getCursorForMode } from '@/core/interactionStateMachine';
import { selectionCoordinator } from '@/core/selectionCoordinator';
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
  
  // Canvas Store
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
  } = useCanvasStore();
  
  // ✅ Interaction Store - استخدام State Machine
  const { 
    mode: interactionMode, 
    cursor: interactionCursor,
    startPanning,
    startBoxSelect,
    updateBoxSelect,
    resetToIdle,
    isMode
  } = useInteractionStore();
  
  // بيانات الحالات الخاصة
  const panningData = useInteractionStore(selectPanningData);
  const boxSelectData = useInteractionStore(selectBoxSelectData);
  
  const {
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp
  } = useToolInteraction(containerRef);

  // ✅ Sprint 4: استخدام Selection Box hook
  const { finishSelection } = useSelectionBox();

  // Enable keyboard shortcuts
  useKeyboardShortcuts();
  
  // ✅ Sprint 18: Touch Gestures للأجهزة اللمسية
  useTouchGestures({
    containerRef: containerRef as React.RefObject<HTMLElement>,
    onLongPress: (point) => {
      // يمكن إضافة قائمة سياقية هنا
      console.log('Long press at:', point);
    }
  });
  
  // ✅ Sprint 17: هوية المستخدم المحفوظة للتعاون
  const collaborationUser = useCollaborationUser();

  // ✅ Refs للـ Panning (للحفاظ على الموقع بين الأحداث)
  const lastPanPositionRef = useRef({ x: 0, y: 0 });
  
  // ✅ Sprint 5: Snap Guides State
  const [snapGuides, setSnapGuides] = useState<SnapLine[]>([]);
  
  // ✅ Mind Map Connection State - استخدام ref للأداء + state للـ UI
  const mindMapConnectionRef = useRef<{
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
  
  // State للـ UI فقط (للـ re-render عند الحاجة)
  const [mindMapConnectionUI, setMindMapConnectionUI] = useState<{
    isConnecting: boolean;
    startPosition: { x: number; y: number } | null;
    currentPosition: { x: number; y: number } | null;
    nearestAnchor: NodeAnchorPoint | null;
  }>({
    isConnecting: false,
    startPosition: null,
    currentPosition: null,
    nearestAnchor: null
  });
  
  // تحديث الـ UI بشكل مُحسَّن (throttled)
  const updateUIRef = useRef<number | null>(null);
  const updateConnectionUI = useCallback(() => {
    if (updateUIRef.current) return; // تجنب التحديثات المتكررة
    updateUIRef.current = requestAnimationFrame(() => {
      const conn = mindMapConnectionRef.current;
      setMindMapConnectionUI({
        isConnecting: conn.isConnecting,
        startPosition: conn.startPosition,
        currentPosition: conn.currentPosition,
        nearestAnchor: conn.nearestAnchor
      });
      updateUIRef.current = null;
    });
  }, []);
  
  // Mind Map: بدء التوصيل من عقدة
  const handleStartConnection = useCallback((
    nodeId: string, 
    anchor: 'top' | 'bottom' | 'left' | 'right', 
    position: { x: number; y: number }
  ) => {
    mindMapConnectionRef.current = {
      isConnecting: true,
      sourceNodeId: nodeId,
      sourceAnchor: anchor,
      startPosition: position,
      currentPosition: position,
      nearestAnchor: null
    };
    updateConnectionUI();
  }, [updateConnectionUI]);
  
  // Mind Map: إنهاء التوصيل في عقدة
  const handleEndConnection = useCallback((
    nodeId: string, 
    anchor: 'top' | 'bottom' | 'left' | 'right'
  ) => {
    const conn = mindMapConnectionRef.current;
    if (!conn.isConnecting || !conn.sourceNodeId) return;
    if (conn.sourceNodeId === nodeId) return;
    
    const sourceNode = elements.find(el => el.id === conn.sourceNodeId);
    if (!sourceNode) return;
    
    const targetNode = elements.find(el => el.id === nodeId);
    if (!targetNode) return;
    
    const connectorBounds = calculateConnectorBounds(sourceNode, targetNode);
    
    useCanvasStore.getState().addElement({
      type: 'mindmap_connector',
      position: connectorBounds.position,
      size: connectorBounds.size,
      data: {
        startNodeId: conn.sourceNodeId,
        endNodeId: nodeId,
        startAnchor: { nodeId: conn.sourceNodeId, anchor: conn.sourceAnchor },
        endAnchor: { nodeId, anchor },
        curveStyle: 'bezier',
        color: sourceNode.data?.color || '#3DA8F5',
        strokeWidth: 2
      } as MindMapConnectorData
    });
    
    mindMapConnectionRef.current = {
      isConnecting: false,
      sourceNodeId: null,
      sourceAnchor: null,
      startPosition: null,
      currentPosition: null,
      nearestAnchor: null
    };
    updateConnectionUI();
  }, [elements, updateConnectionUI]);
  
  // Mind Map: تحديث موقع السحب والبحث عن أقرب عقدة (محسّن للأداء)
  const updateConnectionPosition = useCallback((clientX: number, clientY: number) => {
    const conn = mindMapConnectionRef.current;
    if (!conn.isConnecting) return;
    
    const containerRect = getContainerRect(containerRef);
    if (!containerRect) return;
    
    const canvasPoint = canvasKernel.screenToWorld(clientX, clientY, viewport, containerRect);
    
    const connectableElements = elements.filter(el => {
      if (el.id === conn.sourceNodeId) return false;
      if (el.type === 'mindmap_connector' || el.type === 'visual_connector') return false;
      return ['mindmap_node', 'visual_node', 'shape', 'text', 'image', 'sticky', 'frame', 'smart', 'file'].includes(el.type);
    });
    
    let nearest: NodeAnchorPoint | null = null;
    let nearestDistance = 60;
    
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
    
    // تحديث الـ ref مباشرة (بدون re-render)
    mindMapConnectionRef.current.currentPosition = canvasPoint;
    mindMapConnectionRef.current.nearestAnchor = nearest;
    
    // تحديث UI بشكل مُحسَّن
    updateConnectionUI();
  }, [elements, viewport, updateConnectionUI]);
  
  // إلغاء التوصيل عند النقر على الكانفس
  const cancelConnection = useCallback(() => {
    if (mindMapConnectionRef.current.isConnecting) {
      mindMapConnectionRef.current = {
        isConnecting: false,
        sourceNodeId: null,
        sourceAnchor: null,
        startPosition: null,
        currentPosition: null,
        nearestAnchor: null
      };
      updateConnectionUI();
    }
  }, [updateConnectionUI]);

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
      
      if (el.type === 'mindmap_connector') return true;
      
      return el.position.x + el.size.width >= viewportBounds.x - padding && 
             el.position.x <= viewportBounds.x + viewportBounds.width + padding && 
             el.position.y + el.size.height >= viewportBounds.y - padding && 
             el.position.y <= viewportBounds.y + viewportBounds.height + padding;
    });
  }, [elements, viewportBounds, layers]);

  // ✅ استخدام Canvas Kernel للمحاذاة
  const snapToGrid = useCallback((x: number, y: number) => {
    return canvasKernel.snapToGrid({ x, y }, settings.gridSize, settings.snapToGrid);
  }, [settings.snapToGrid, settings.gridSize]);

  // Handle Wheel (Zoom)
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      const delta = -e.deltaY * 0.001;
      const newZoom = viewport.zoom * (1 + delta);
      setZoom(newZoom);
    } else {
      setPan(viewport.pan.x - e.deltaX, viewport.pan.y - e.deltaY);
    }
  }, [viewport, setZoom, setPan]);

  // ✅ Handle Mouse Down - استخدام State Machine + Selection Coordinator
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Middle mouse or Alt+Click = Pan
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      startPanning(
        { x: e.clientX, y: e.clientY },
        { x: viewport.pan.x, y: viewport.pan.y }
      );
      lastPanPositionRef.current = { x: e.clientX, y: e.clientY };
      
      if (containerRef.current) {
        containerRef.current.style.cursor = 'grabbing';
      }
      e.preventDefault();
      return;
    }
    
    // ✅ المرحلة 3: استخدام Selection Coordinator لتحديد نوع الهدف
    const target = selectionCoordinator.identifyTarget(e.target as HTMLElement);
    
    // Selection Box with selection tool on empty space
    if (e.button === 0 && activeTool === 'selection_tool' && 
        target.type === 'canvas') {
      
      if (!e.shiftKey) {
        clearSelection();
      }
      
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;
      
      // ✅ استخدام State Machine للـ Box Select
      const worldPoint = canvasKernel.screenToWorld(
        e.clientX, 
        e.clientY, 
        viewport, 
        containerRect
      );
      startBoxSelect(worldPoint, e.shiftKey);
      
      return;
    }
    
    // ✅ تجاهل إذا كان على BoundingBox (يتولى السحب بنفسه)
    if (target.type === 'bounding-box' || target.type === 'resize-handle') {
      return;
    }
    
    // ✅ إصلاح: إغلاق محرر النص عند النقر على الكانفس
    if (e.button === 0 && activeTool === 'text_tool' && target.type === 'canvas') {
      const { editingTextId, stopEditingText } = useCanvasStore.getState();
      if (editingTextId) {
        // إغلاق المحرر الحالي فقط، لا ننشئ عنصراً جديداً
        stopEditingText();
        return;
      }
    }
    
    // تفويض للأداة النشطة
    if (e.button === 0 && (
      activeTool === 'file_uploader' || 
      activeTool === 'frame_tool' || 
      activeTool === 'smart_pen' || 
      activeTool === 'shapes_tool' || 
      activeTool === 'text_tool' || 
      activeTool === 'smart_element_tool'
    )) {
      handleCanvasMouseDown(e);
      return;
    }
    
    // Left click on empty space = Always clear selection
    if (e.button === 0 && target.type === 'canvas') {
      clearSelection();
    }
  }, [activeTool, handleCanvasMouseDown, clearSelection, viewport, startPanning, startBoxSelect]);

  // ✅ Handle Mouse Move - استخدام State Machine
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // تحديث خط اتصال الخريطة الذهنية أثناء السحب
    if (mindMapConnectionRef.current.isConnecting) {
      updateConnectionPosition(e.clientX, e.clientY);
    }
    
    // ✅ Panning باستخدام State Machine
    if (isMode('panning')) {
      const deltaX = e.clientX - lastPanPositionRef.current.x;
      const deltaY = e.clientY - lastPanPositionRef.current.y;
      setPan(viewport.pan.x + deltaX, viewport.pan.y + deltaY);
      lastPanPositionRef.current = { x: e.clientX, y: e.clientY };
      return;
    }
    
    // ✅ Box Select باستخدام State Machine
    if (isMode('boxSelect') && boxSelectData) {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (containerRect) {
        const worldPoint = canvasKernel.screenToWorld(
          e.clientX, 
          e.clientY, 
          viewport, 
          containerRect
        );
        updateBoxSelect(worldPoint);
      }
      return;
    }
    
    handleCanvasMouseMove(e);
  }, [
    viewport, 
    setPan, 
    handleCanvasMouseMove, 
    updateConnectionPosition,
    isMode,
    boxSelectData,
    updateBoxSelect
  ]);

  // ✅ Handle Mouse Up - استخدام State Machine
  const handleMouseUp = useCallback(() => {
    // ✅ إنشاء الموصل فقط عند وجود snap (السناب = اتصال مشروط بالإفلات)
    // عند وجود snap، الإفلات في أي مكان يُكمل التوصيل
    const conn = mindMapConnectionRef.current;
    if (conn.isConnecting && conn.sourceNodeId) {
      if (conn.nearestAnchor) {
        // يوجد snap - إنشاء الموصل مباشرة بغض النظر عن موقع الإفلات
        handleEndConnection(
          conn.nearestAnchor.nodeId, 
          conn.nearestAnchor.anchor
        );
      } else {
        // لا يوجد snap - إلغاء التوصيل
        cancelConnection();
      }
    }
    
    // ✅ إنهاء Panning
    if (isMode('panning')) {
      resetToIdle();
      if (containerRef.current) {
        containerRef.current.style.cursor = 'default';
      }
    }

    // ✅ Handle Selection Box completion using State Machine
    if (isMode('boxSelect') && boxSelectData) {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (containerRect) {
        // تحويل من World إلى Screen للـ finishSelection
        const startScreen = canvasKernel.worldToScreen(
          boxSelectData.startWorld.x,
          boxSelectData.startWorld.y,
          viewport,
          containerRect
        );
        const endScreen = canvasKernel.worldToScreen(
          boxSelectData.currentWorld.x,
          boxSelectData.currentWorld.y,
          viewport,
          containerRect
        );
        
        // حساب الإحداثيات النسبية للـ container
        const startX = startScreen.x - containerRect.left;
        const startY = startScreen.y - containerRect.top;
        const endX = endScreen.x - containerRect.left;
        const endY = endScreen.y - containerRect.top;
        
        const boxWidth = Math.abs(endX - startX);
        const boxHeight = Math.abs(endY - startY);

        // إذا كان الصندوق صغيراً جداً (< 5px)، اعتباره نقرة
        if (boxWidth >= 5 || boxHeight >= 5) {
          finishSelection(startX, startY, endX, endY, boxSelectData.additive);
        }
      }
      
      resetToIdle();
    }
    
    handleCanvasMouseUp();
  }, [
    handleCanvasMouseUp, 
    handleEndConnection,
    cancelConnection,
    isMode,
    boxSelectData,
    resetToIdle,
    viewport,
    finishSelection
  ]);

  // Wheel event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Handle file drop on canvas
  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    const containerRect = getContainerRect(containerRef);
    if (!containerRect) return;
    const canvasPoint = canvasKernel.screenToWorld(e.clientX, e.clientY, viewport, containerRect);
    
    // التحقق من السحب للعناصر الذكية أولاً
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
    
    // معالجة إسقاط الملفات
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    const file = e.dataTransfer.files[0];
    
    if (file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      useCanvasStore.getState().addElement({
        type: 'image',
        position: canvasPoint,
        size: { width: 300, height: 200 },
        src: imageUrl,
        alt: file.name
      });
      toast.success(`تم إدراج الصورة: ${file.name}`);
    } else {
      useCanvasStore.getState().addElement({
        type: 'file',
        position: canvasPoint,
        size: { width: 250, height: 120 },
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

  // ✅ تحديد نوع المؤشر حسب الأداة النشطة والحالة
  const getCursorStyle = useCallback(() => {
    // إذا كانت هناك حالة تفاعل نشطة، استخدم مؤشرها
    if (interactionMode.kind !== 'idle') {
      return getCursorForMode(interactionMode);
    }
    
    // وإلا استخدم مؤشر الأداة
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
  }, [activeTool, interactionMode]);
  
  // ✅ حساب بيانات Selection Box من State Machine
  const selectionBoxData = useMemo(() => {
    if (!boxSelectData) return null;
    
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return null;
    
    const startScreen = canvasKernel.worldToScreen(
      boxSelectData.startWorld.x,
      boxSelectData.startWorld.y,
      viewport,
      containerRect
    );
    const currentScreen = canvasKernel.worldToScreen(
      boxSelectData.currentWorld.x,
      boxSelectData.currentWorld.y,
      viewport,
      containerRect
    );
    
    return {
      startX: startScreen.x - containerRect.left,
      startY: startScreen.y - containerRect.top,
      currentX: currentScreen.x - containerRect.left,
      currentY: currentScreen.y - containerRect.top
    };
  }, [boxSelectData, viewport]);

  return (
    <div 
      ref={containerRef} 
      data-canvas-container="true" 
      className={`relative w-full h-full overflow-hidden infinite-canvas-container ${
        activeTool === 'text_tool' ? 'text-tool-active' : ''
      }`}
      onMouseDown={handleMouseDown} 
      onMouseMove={handleMouseMove} 
      onMouseUp={handleMouseUp} 
      onMouseLeave={handleMouseUp} 
      onDrop={handleFileDrop} 
      onDragOver={handleFileDragOver} 
      style={{
        backgroundColor: settings.background,
        cursor: getCursorStyle()
      }}
    >
      {/* Grid Layer */}
      <CanvasGridLayer />
      
      {/* Canvas Container - الطبقة المتحركة للعناصر */}
      <div 
        ref={canvasRef} 
        className="absolute inset-0 origin-top-left" 
        style={{
          transform: `translate(${viewport.pan.x}px, ${viewport.pan.y}px) scale(${viewport.zoom})`,
          transition: 'none'
        }}
      >
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
            isConnecting={mindMapConnectionUI.isConnecting}
            nearestAnchor={mindMapConnectionUI.nearestAnchor}
          />
        ))}
        
        {/* Mind Map Connection Line (during drag) */}
        {mindMapConnectionUI.isConnecting && mindMapConnectionUI.startPosition && mindMapConnectionUI.currentPosition && (
          <MindMapConnectionLine
            startPosition={mindMapConnectionUI.startPosition}
            endPosition={mindMapConnectionUI.nearestAnchor?.position || mindMapConnectionUI.currentPosition}
            startAnchor={mindMapConnectionRef.current.sourceAnchor || 'right'}
            color={elements.find(el => el.id === mindMapConnectionRef.current.sourceNodeId)?.data?.color}
            isSnapped={!!mindMapConnectionUI.nearestAnchor}
          />
        )}
        
        {/* BoundingBox for selected elements with Snap Engine */}
        <BoundingBox onGuidesChange={setSnapGuides} />
        
        {/* Drawing Preview */}
        {tempElement && <DrawingPreview element={tempElement} />}
      </div>
      
      {/* Selection Box - من State Machine */}
      {isMode('boxSelect') && selectionBoxData && (
        <SelectionBox 
          startX={selectionBoxData.startX} 
          startY={selectionBoxData.startY} 
          currentX={selectionBoxData.currentX} 
          currentY={selectionBoxData.currentY} 
        />
      )}
      
      
      {/* Snap Guides */}
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
      
      {/* Real-time Collaboration Sync Manager */}
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
    </div>
  );
};

export default InfiniteCanvas;
