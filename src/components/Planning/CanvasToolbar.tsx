import React from "react";
import { addNewElement, canvasStore } from "@/stores/canvasStore";

export default function CanvasToolbar() {
  return (
    <div className="absolute top-3 left-3 z-50 bg-white border rounded-xl shadow-sm px-2 py-2 flex gap-2">
      <button
        className="px-3 py-2 text-sm border rounded-lg hover:bg-neutral-50"
        onClick={() => addNewElement("note", { x: 0, y: 0 })}
      >
        + Note
      </button>
      <button
        className="px-3 py-2 text-sm border rounded-lg hover:bg-neutral-50"
        onClick={() => addNewElement("rect", { x: 50, y: 50 })}
      >
        + Rect
      </button>

      <button
        className="px-3 py-2 text-sm border rounded-lg hover:bg-neutral-50"
        onClick={() => canvasStore.actions.clearSelection()}
      >
        Clear
      </button>
    </div>
  );
}
