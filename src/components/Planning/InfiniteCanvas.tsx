// src/components/Planning/InfiniteCanvas.tsx
import React, { useRef, useCallback, useEffect, useMemo, useState } from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import CanvasElement from "./CanvasElement";
import DrawingPreview from "./DrawingPreview";
import SelectionBox from "./SelectionBox";
import StrokesLayer from "./StrokesLayer";
import PenInputLayer from "./PenInputLayer";
import FrameInputLayer from "./FrameInputLayer";
import { BoundingBox } from "./BoundingBox";
import { useToolInteraction } from "@/hooks/useToolInteraction";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { screenToCanvasCoordinates } from "@/utils/canvasCoordinates";
import { toast } from "sonner";
import { PenFloatingToolbar } from "@/components/ui/pen-floating-toolbar";
import ReactFlowCanvas from "./ReactFlowCanvas";

interface InfiniteCanvasProps {
  boardId: string;
}

const InfiniteCanvas: React.FC<InfiniteCanvasProps> = ({ boardId }) => {
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
    ungroupElements,
  } = useCanvasStore();

  const { handleCanvasMouseDown, handleCanvasMouseMove, handleCanvasMouseUp } = useToolInteraction(containerRef);

  useKeyboardShortcuts();

  const [engine] = useState<"native" | "reactflow">(() => {
    const stored =
      typeof window !== "undefined" && window.localStorage
        ? (localStorage.getItem("soabra_canvas_engine") as "native" | "reactflow" | null)
        : null;
    return stored === "reactflow" || stored === "native" ? stored : "native";
  });

  // Pan State
  const isPanningRef = useRef(false);
  const lastPanPositionRef = useRef({ x: 0, y: 0 });

  // Selection Box State (native only)
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const [selectionCurrent, setSelectionCurrent] = useState<{ x: number; y: number } | null>(null);

  // Viewport bounds for virtualization (native only)
  const viewportBounds = useMemo(
    () => ({
      x: -viewport.pan.x / viewport.zoom,
      y: -viewport.pan.y / viewport.zoom,
      width: (containerRef.current?.clientWidth || window.innerWidth) / viewport.zoom,
      height: (containerRef.current?.clientHeight || window.innerHeight) / viewport.zoom,
    }),
    [viewport],
  );

  // Virtualized elements (only render visible ones) (native only)
  const visibleElements = useMemo(() => {
    const padding = 200;
    return elements.filter((el) => {
      const layer = layers.find((l) => l.id === el.layerId);
      if (!layer?.visible || !el.visible) return false;
      return (
        el.position.x + el.size.width >= viewportBounds.x - padding &&
        el.position.x <= viewportBounds.x + viewportBounds.width + padding &&
        el.position.y + el.size.height >= viewportBounds.y - padding &&
        el.position.y <= viewportBounds.y + viewportBounds.height + padding
      );
    });
  }, [elements, viewportBounds, layers]);

  // Grid Lines (native only)
  const gridLines = useMemo(() => {
    if (!settings.gridEnabled) return [];
    const lines: React.CSSProperties[] = [];
    const gridSize = settings.gridSize;
    const startX = Math.floor(viewportBounds.x / gridSize) * gridSize;
    const startY = Math.floor(viewportBounds.y / gridSize) * gridSize;
    const endX = Math.ceil((viewportBounds.x + viewportBounds.width) / gridSize) * gridSize;
    const endY = Math.ceil((viewportBounds.y + viewportBounds.height) / gridSize) * gridSize;

    for (let x = startX; x <= endX; x += gridSize) {
      lines.push({
        position: "absolute",
        left: `${x}px`,
        top: `${startY}px`,
        width: "1px",
        height: `${endY - startY}px`,
        backgroundColor: "rgba(11, 15, 18, 0.08)",
        pointerEvents: "none",
      });
    }

    for (let y = startY; y <= endY; y += gridSize) {
      lines.push({
        position: "absolute",
        left: `${startX}px`,
        top: `${y}px`,
        width: `${endX - startX}px`,
        height: "1px",
        backgroundColor: "rgba(11, 15, 18, 0.08)",
        pointerEvents: "none",
      });
    }

    return lines;
  }, [settings.gridEnabled, settings.gridSize, viewportBounds]);

  // Snap to Grid Function
  const snapToGrid = useCallback(
    (x: number, y: number) => {
      if (!settings.snapToGrid) return { x, y };
      const gridSize = settings.gridSize;
      return {
        x: Math.round(x / gridSize) * gridSize,
        y: Math.round(y / gridSize) * gridSize,
      };
    },
    [settings.snapToGrid, settings.gridSize],
  );

  // Handle Wheel (Zoom)
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      if (engine === "reactflow") {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        const delta = -e.deltaY * 0.001;
        const newZoom = viewport.zoom * (1 + delta);
        setZoom(newZoom);
      } else {
        setPan(viewport.pan.x - e.deltaX, viewport.pan.y - e.deltaY);
      }
    },
    [engine, viewport, setZoom, setPan],
  );

  // Handle Mouse Down (Start Pan or Selection)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (engine === "reactflow") return;

      if (e.button === 1 || (e.button === 0 && e.altKey)) {
        isPanningRef.current = true;
        lastPanPositionRef.current = { x: e.clientX, y: e.clientY };
        if (containerRef.current) {
          containerRef.current.style.cursor = "grabbing";
        }
        e.preventDefault();
      } else if (
        e.button === 0 &&
        activeTool === "selection_tool" &&
        !(e.target as HTMLElement).closest('[data-canvas-element="true"]') &&
        !(e.target as HTMLElement).closest(".bounding-box")
      ) {
        if (!e.shiftKey) {
          clearSelection();
        }
        setIsSelecting(true);

        const containerRect = containerRef.current?.getBoundingClientRect();
        const relativeX = e.clientX - (containerRect?.left || 0);
        const relativeY = e.clientY - (containerRect?.top || 0);

        setSelectionStart({ x: relativeX, y: relativeY } as any);
        (setSelectionStart as any)((prev: any) => ({ ...(prev || {}), shiftKey: e.shiftKey }));

        setSelectionCurrent({ x: relativeX, y: relativeY });
      } else if (
        e.button === 0 &&
        (activeTool === "file_uploader" ||
          activeTool === "frame_tool" ||
          activeTool === "smart_pen" ||
          activeTool === "shapes_tool" ||
          activeTool === "text_tool" ||
          activeTool === "smart_element_tool")
      ) {
        handleCanvasMouseDown(e);
      } else if (
        e.button === 0 &&
        !(e.target as HTMLElement).closest('[data-canvas-element="true"]') &&
        !(e.target as HTMLElement).closest(".bounding-box")
      ) {
        clearSelection();
      }
    },
    [engine, activeTool, handleCanvasMouseDown, clearSelection],
  );

  // Handle Mouse Move (Pan or Drawing or Selection)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (engine === "reactflow") return;

      if (isPanningRef.current) {
        const deltaX = e.clientX - lastPanPositionRef.current.x;
        const deltaY = e.clientY - lastPanPositionRef.current.y;
        setPan(viewport.pan.x + deltaX, viewport.pan.y + deltaY);
        lastPanPositionRef.current = { x: e.clientX, y: e.clientY };
      } else if (isSelecting) {
        const containerRect = containerRef.current?.getBoundingClientRect();
        const relativeX = e.clientX - (containerRect?.left || 0);
        const relativeY = e.clientY - (containerRect?.top || 0);

        setSelectionCurrent({ x: relativeX, y: relativeY });
      } else {
        handleCanvasMouseMove(e);
      }
    },
    [engine, viewport, setPan, handleCanvasMouseMove, isSelecting],
  );

  // Handle Mouse Up (Stop Pan or Drawing or Selection)
  const handleMouseUp = useCallback(() => {
    if (engine === "reactflow") return;

    isPanningRef.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = "default";
    }

    if (isSelecting && selectionStart && selectionCurrent) {
      const minX = Math.min(selectionStart.x, selectionCurrent.x);
      const maxX = Math.max(selectionStart.x, selectionCurrent.x);
      const minY = Math.min(selectionStart.y, selectionCurrent.y);
      const maxY = Math.max(selectionStart.y, selectionCurrent.y);

      const boxWidth = maxX - minX;
      const boxHeight = maxY - minY;

      if (boxWidth < 5 && boxHeight < 5) {
        if (!(selectionStart as any).shiftKey) {
          clearSelection();
        }
      } else {
        const selectedIds: string[] = [];
        elements.forEach((el) => {
          const elScreenPos = {
            x: el.position.x * viewport.zoom + viewport.pan.x,
            y: el.position.y * viewport.zoom + viewport.pan.y,
            width: el.size.width * viewport.zoom,
            height: el.size.height * viewport.zoom,
          };

          if (
            elScreenPos.x < maxX &&
            elScreenPos.x + elScreenPos.width > minX &&
            elScreenPos.y < maxY &&
            elScreenPos.y + elScreenPos.height > minY
          ) {
            selectedIds.push(el.id);
          }
        });

        if (selectedIds.length > 0) {
          const currentSelection = useCanvasStore.getState().selectedElementIds;
          const finalSelection = (selectionStart as any).shiftKey
            ? [...new Set([...currentSelection, ...selectedIds])]
            : selectedIds;

          useCanvasStore.getState().selectElements(finalSelection);
        }
      }

      setIsSelecting(false);
      setSelectionStart(null);
      setSelectionCurrent(null);
    }

    handleCanvasMouseUp();
  }, [engine, handleCanvasMouseUp, isSelecting, selectionStart, selectionCurrent, elements, viewport, clearSelection]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const typingMode = useCanvasStore.getState().typingMode;
      if (typingMode) return;

      if (engine === "reactflow") return;

      if ((e.ctrlKey || e.metaKey) && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        useCanvasStore.getState().zoomIn();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        useCanvasStore.getState().zoomOut();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        useCanvasStore.getState().resetViewport();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z") {
        e.preventDefault();
        redo();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        e.preventDefault();
        copyElements(selectedElementIds);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        e.preventDefault();
        pasteElements();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "x") {
        e.preventDefault();
        cutElements(selectedElementIds);
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedElementIds.length > 0) {
          e.preventDefault();
          deleteElements(selectedElementIds);
          toast.success("تم حذف العناصر المحددة");
        }
      }

      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        if (selectedElementIds.length === 0) return;
        e.preventDefault();

        let deltaX = 0;
        let deltaY = 0;
        const step = e.shiftKey ? 10 : 1;

        switch (e.key) {
          case "ArrowLeft":
            deltaX = -step;
            break;
          case "ArrowRight":
            deltaX = step;
            break;
          case "ArrowUp":
            deltaY = -step;
            break;
          case "ArrowDown":
            deltaY = step;
            break;
        }

        moveElements(selectedElementIds, deltaX, deltaY);
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        const allElementIds = elements.map((el) => el.id);
        selectElements(allElementIds);
        if (allElementIds.length > 0) {
          toast.success(`تم تحديد ${allElementIds.length} عنصر`);
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "g" && !e.shiftKey) {
        e.preventDefault();
        if (selectedElementIds.length > 1) {
          groupElements(selectedElementIds);
          toast.success(`تم تجميع ${selectedElementIds.length} عنصر`);
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "G") {
        e.preventDefault();
        const selectedElements = elements.filter((el) => selectedElementIds.includes(el.id));
        const groupIds = [...new Set(selectedElements.map((el) => el.metadata?.groupId).filter(Boolean))];

        groupIds.forEach((groupId) => {
          if (groupId) ungroupElements(groupId);
        });

        if (groupIds.length > 0) {
          toast.success("تم فك التجميع");
        }
      }

      if (e.key === "g" && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        e.preventDefault();
        toggleGrid();
      }

      if (e.key === "v" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        useCanvasStore.getState().setActiveTool("selection_tool");
      }
      if (e.key === "t" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        useCanvasStore.getState().setActiveTool("text_tool");
      }
      if (e.key === "r" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        useCanvasStore.getState().setActiveTool("shapes_tool");
      }
      if (e.key === "p" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        useCanvasStore.getState().setActiveTool("smart_pen");
      }
      if (e.key === "f" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        useCanvasStore.getState().setActiveTool("frame_tool");
      }
      if (e.key === "u" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        useCanvasStore.getState().setActiveTool("file_uploader");
      }
      if (e.key === "s" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        useCanvasStore.getState().setActiveTool("smart_element_tool");
      }

      if (e.key === "Escape") {
        clearSelection();
        useCanvasStore.getState().setActiveTool("selection_tool");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    engine,
    undo,
    redo,
    toggleGrid,
    selectedElementIds,
    copyElements,
    pasteElements,
    cutElements,
    deleteElements,
    clearSelection,
    moveElements,
    groupElements,
    ungroupElements,
    elements,
    selectElements,
  ]);

  // Wheel event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Handle file drop on canvas (native only)
  const handleFileDrop = useCallback(
    (e: React.DragEvent) => {
      if (engine === "reactflow") return;

      e.preventDefault();
      if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

      const file = e.dataTransfer.files[0];
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const canvasPoint = screenToCanvasCoordinates(e.clientX, e.clientY, viewport, containerRect);

      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        useCanvasStore.getState().addElement({
          type: "image",
          position: canvasPoint,
          size: { width: 300, height: 200 },
          src: imageUrl,
          alt: file.name,
        });
        toast.success(`تم إدراج الصورة: ${file.name}`);
      } else {
        useCanvasStore.getState().addElement({
          type: "file",
          position: canvasPoint,
          size: { width: 250, height: 120 },
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileUrl: URL.createObjectURL(file),
        });
        toast.success(`تم إدراج الملف: ${file.name}`);
      }
    },
    [engine, viewport],
  );

  const handleFileDragOver = useCallback(
    (e: React.DragEvent) => {
      if (engine === "reactflow") return;
      e.preventDefault();
    },
    [engine],
  );

  const getCursorStyle = () => {
    if (engine === "reactflow") return "default";
    switch (activeTool) {
      case "text_tool":
        return "text";
      case "smart_pen":
        return "crosshair";
      case "shapes_tool":
        return "crosshair";
      case "frame_tool":
        return "crosshair";
      case "file_uploader":
        return "copy";
      case "smart_element_tool":
        return "crosshair";
      default:
        return "default";
    }
  };

  return (
    <div
      ref={containerRef}
      data-canvas-container="true"
      className="relative w-full h-full overflow-hidden infinite-canvas-container"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDrop={handleFileDrop}
      onDragOver={handleFileDragOver}
      style={{
        backgroundColor: settings.background,
        cursor: getCursorStyle(),
      }}
    >
      {engine === "native" ? (
        <>
          {/* Canvas Container */}
          <div
            ref={canvasRef}
            className="absolute inset-0 origin-top-left"
            style={{
              transform: `translate(${viewport.pan.x}px, ${viewport.pan.y}px) scale(${viewport.zoom})`,
              transition: isPanningRef.current ? "none" : "transform 0.1s ease-out",
            }}
          >
            {/* Grid Lines */}
            {settings.gridEnabled && (
              <div
                className="absolute"
                style={{
                  left: viewportBounds.x - 200,
                  top: viewportBounds.y - 200,
                  width: viewportBounds.width + 400,
                  height: viewportBounds.height + 400,
                }}
              >
                {gridLines.map((lineStyle, index) => (
                  <div key={index} style={lineStyle} />
                ))}
              </div>
            )}

            {/* Pen Strokes Layer */}
            <StrokesLayer />

            {/* Canvas Elements */}
            {visibleElements.map((element) => (
              <CanvasElement
                key={element.id}
                element={element}
                isSelected={selectedElementIds.includes(element.id)}
                onSelect={(multiSelect) => selectElement(element.id, multiSelect)}
                snapToGrid={settings.snapToGrid ? snapToGrid : undefined}
                activeTool={activeTool}
              />
            ))}

            {/* BoundingBox for selected elements */}
            <BoundingBox />

            {/* Drawing Preview */}
            {tempElement && <DrawingPreview element={tempElement} />}
          </div>

          {/* Selection Box */}
          {isSelecting && selectionStart && selectionCurrent && (
            <SelectionBox
              startX={selectionStart.x}
              startY={selectionStart.y}
              currentX={selectionCurrent.x}
              currentY={selectionCurrent.y}
            />
          )}

          {/* Pen Input Layer */}
          <PenInputLayer containerRef={containerRef} active={activeTool === "smart_pen"} />

          {/* Frame Input Layer */}
          <FrameInputLayer containerRef={containerRef} active={activeTool === "frame_tool"} />

          {/* Pen Floating Toolbar */}
          <PenFloatingToolbar position={{ x: window.innerWidth / 2, y: 80 }} isVisible={activeTool === "smart_pen"} />
        </>
      ) : (
        <ReactFlowCanvas boardId={boardId} />
      )}
    </div>
  );
};

export default InfiniteCanvas;
