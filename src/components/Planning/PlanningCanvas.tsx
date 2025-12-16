import React, { useEffect, useMemo, useRef, useState } from "react";
import InfiniteCanvas from "./InfiniteCanvas";
import { CanvasElement } from "./CanvasElement";
import CanvasToolbar from "./CanvasToolbar";
import CanvasPropertiesPopover from "./CanvasPropertiesPopover";
import { addNewElement, canvasStore, useCamera, useOrderedElements, useSelection } from "./canvasStore";
import { worldToScreen } from "./canvasCoordinates";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function PlanningCanvas() {
  const elements = useOrderedElements();
  const selection = useSelection();
  const camera = useCamera();

  const viewportRef = useRef<HTMLDivElement>(null);

  // Example: create a default element if empty
  useEffect(() => {
    if (elements.length === 0) {
      addNewElement("note", { x: 0, y: 0, w: 260, h: 160, name: "ملاحظة" });
    }
  }, [elements.length]);

  const selectedElement = useMemo(() => {
    const primary = selection.primaryId;
    if (!primary) return null;
    return elements.find((e) => e.id === primary) ?? null;
  }, [elements, selection.primaryId]);

  const [popoverPos, setPopoverPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    if (!selectedElement) {
      setPopoverPos(null);
      return;
    }

    const rect = vp.getBoundingClientRect();

    // Anchor point: right-center of element in world space
    const anchorWorld = {
      x: selectedElement.x + selectedElement.w,
      y: selectedElement.y + selectedElement.h / 2,
    };

    // Convert to screen space (relative to viewport)
    const anchorScreen = worldToScreen(anchorWorld, camera);

    // Convert to page (fixed) coordinates
    const baseX = rect.left + anchorScreen.x + 12; // offset
    const baseY = rect.top + anchorScreen.y - 10;

    // Clamp inside viewport (avoid going off-screen)
    const popW = 240;
    const popH = 280;

    const x = clamp(baseX, rect.left + 8, rect.right - popW - 8);
    const y = clamp(baseY, rect.top + 8, rect.bottom - popH - 8);

    setPopoverPos({ x, y });
  }, [selectedElement, camera.x, camera.y, camera.zoom]);

  return (
    <div ref={viewportRef} className="w-full h-full relative">
      <CanvasToolbar />

      <InfiniteCanvas>
        {elements.map((el) => (
          <CanvasElement
            key={el.id}
            element={el}
            isSelected={selection.ids.includes(el.id)}
            isPrimary={selection.primaryId === el.id}
            onPointerDown={(id, e) => {
              // Block if panning intent
              if (e.button === 1) return;
              if (e.button === 0 && e.shiftKey) return;

              const additive = e.metaKey || e.ctrlKey;
              if (!additive) {
                canvasStore.actions.setSelection([id], id);
              } else {
                const next = Array.from(new Set([...selection.ids, id]));
                canvasStore.actions.setSelection(next, id);
              }
            }}
          />
        ))}
      </InfiniteCanvas>

      {selectedElement && popoverPos && (
        <CanvasPropertiesPopover
          element={selectedElement}
          screenX={popoverPos.x}
          screenY={popoverPos.y}
          onChange={(patch) => canvasStore.actions.updateElement(selectedElement.id, patch)}
          onClose={() => canvasStore.actions.clearSelection()}
        />
      )}
    </div>
  );
}
