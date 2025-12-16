// src/components/Planning/CanvasElement.tsx
import React, { useRef, useCallback, useEffect, useState } from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import type { CanvasElement as CanvasElementType } from "@/types/canvas";
import { SmartElementRenderer } from "./SmartElements/SmartElementRenderer";
import { ResizeHandle } from "./ResizeHandle";
import { TextEditor } from "./TextEditor";
import { ShapeRenderer } from "./ShapeRenderer";
import { ArrowControlPoints } from "./ArrowControlPoints";
import { ArrowLabels } from "./ArrowLabels";
import type { CanvasSmartElement } from "@/types/canvas-elements";

const isArrowShape = (shapeType: string | undefined): boolean => {
  if (!shapeType) return false;
  return shapeType.startsWith("arrow_");
};

const isElementArrow = (element: CanvasElementType): boolean => {
  if (element.type !== "shape") return false;
  const shapeType = element.shapeType || element.data?.shapeType;
  return isArrowShape(shapeType);
};

interface CanvasElementProps {
  element: CanvasElementType;
  isSelected: boolean;
  onSelect: (multiSelect: boolean) => void;
  snapToGrid?: (x: number, y: number) => { x: number; y: number };
  activeTool: string;
  disableDrag?: boolean;
}

const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  isSelected,
  onSelect,
  snapToGrid,
  activeTool,
  disableDrag,
}) => {
  const {
    updateElement,
    viewport,
    updateFrameTitle,
    editingTextId,
    startEditingText,
    stopEditingText,
    updateTextContent,
  } = useCanvasStore();

  const elementRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, elementX: 0, elementY: 0 });
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const titleInputRef = useRef<HTMLInputElement>(null);

  const isEditingThisText = element.type === "text" && editingTextId === element.id;

  const layers = useCanvasStore((state) => state.layers);
  const elementLayer = layers.find((l) => l.id === element.layerId);
  const isVisible = element.visible !== false && elementLayer?.visible !== false;
  const isLocked = element.locked || elementLayer?.locked;

  if (!isVisible) return null;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isLocked) return;

      e.stopPropagation();

      if (disableDrag) {
        if (activeTool !== "selection_tool") return;
        const multiSelect = e.shiftKey || e.ctrlKey || e.metaKey;
        onSelect(multiSelect);
        return;
      }

      const target = e.target as HTMLElement;
      if (target.classList.contains("resize-handle")) return;
      if (activeTool !== "selection_tool") return;

      const multiSelect = e.shiftKey || e.ctrlKey || e.metaKey;

      if (multiSelect && isSelected) {
        const currentSelection = useCanvasStore.getState().selectedElementIds;
        const newSelection = currentSelection.filter((id) => id !== element.id);
        useCanvasStore.getState().selectElements(newSelection);
        return;
      }

      onSelect(multiSelect);

      if (isEditingThisText) return;

      isDraggingRef.current = true;
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        elementX: element.position.x,
        elementY: element.position.y,
      };
    },
    [element, onSelect, isLocked, isSelected, activeTool, isEditingThisText, disableDrag],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current || isLocked || useCanvasStore.getState().isInternalDrag) return;

      const deltaX = (e.clientX - dragStartRef.current.x) / viewport.zoom;
      const deltaY = (e.clientY - dragStartRef.current.y) / viewport.zoom;

      let newX = dragStartRef.current.elementX + deltaX;
      let newY = dragStartRef.current.elementY + deltaY;

      if (snapToGrid) {
        const snapped = snapToGrid(newX, newY);
        newX = snapped.x;
        newY = snapped.y;
      }

      updateElement(element.id, {
        position: { x: newX, y: newY },
      });
    },
    [element, updateElement, snapToGrid, viewport, isLocked],
  );

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  useEffect(() => {
    if (isDraggingRef.current) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={elementRef}
      data-canvas-element="true"
      onMouseDown={handleMouseDown}
      className="absolute select-none"
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
      }}
    >
      {element.type === "shape" && (
        <>
          <ShapeRenderer
            shapeType={element.shapeType || element.data?.shapeType || "rectangle"}
            width={element.size.width}
            height={element.size.height}
            fillColor={element.style?.backgroundColor || element.data?.fillColor || "#3DBE8B"}
            strokeColor={element.strokeColor || element.data?.strokeColor || "#000000"}
            strokeWidth={element.strokeWidth || element.data?.strokeWidth || 2}
            opacity={element.style?.opacity || 1}
            borderRadius={element.style?.borderRadius || 0}
            iconName={element.iconName || element.data?.iconName}
            stickyText={element.stickyText || element.data?.stickyText}
            arrowData={element.data?.arrowData}
          />
          {isElementArrow(element) && element.data?.arrowData && <ArrowLabels arrowData={element.data.arrowData} />}
        </>
      )}

      {element.type === "smart" && (
        <SmartElementRenderer
          element={element as CanvasSmartElement}
          onUpdate={(data) => updateElement(element.id, { data })}
        />
      )}

      {isSelected && !isLocked && !disableDrag && (
        <>
          {element.type === "shape" && isArrowShape(element.shapeType || element.data?.shapeType) ? (
            <ArrowControlPoints element={element} viewport={viewport} />
          ) : (
            <>
              <ResizeHandle position="nw" elementId={element.id} />
              <ResizeHandle position="ne" elementId={element.id} />
              <ResizeHandle position="sw" elementId={element.id} />
              <ResizeHandle position="se" elementId={element.id} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CanvasElement;
