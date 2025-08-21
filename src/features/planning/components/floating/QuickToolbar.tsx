"use client";
import React, { useEffect, useState } from "react";
import { useSelection } from "@/src/features/planning/hooks/useSelection";
import { useCanvas } from "@/src/features/planning/hooks/useCanvas";

const QuickToolbar: React.FC = () => {
  const { selection } = useSelection();
  const { duplicateSelection, deleteSelection, setFill, setStroke } = useCanvas();
  const [pos, setPos] = useState<{left:number;top:number}|null>(null);

  useEffect(() => {
    if (!selection?.bounds) { setPos(null); return; }
    const b = selection.bounds;
    setPos({ left: b.x + b.w/2, top: b.y - 40 }); // will be positioned via CSS transform from canvas coords
  }, [selection?.bounds]);

  if (!pos) return null;

  return (
    <div
      className="pointer-events-auto fixed z-40"
      style={{ transform: `translate(${pos.left}px, ${pos.top}px)` }}
      role="toolbar"
      aria-label="Quick Toolbar"
    >
      <div className="flex items-center gap-1 bg-white border rounded shadow px-2 py-1">
        <button className="btn" onClick={duplicateSelection} title="Duplicate">⎘</button>
        <button className="btn" onClick={deleteSelection} title="Delete">🗑</button>
        <label className="btn">
          🎨
          <input type="color" className="ml-1" onChange={(e)=>setFill(e.target.value)} />
        </label>
        <label className="btn">
          🖌️
          <input type="color" className="ml-1" onChange={(e)=>setStroke(e.target.value)} />
        </label>
      </div>
      <style jsx>{`.btn{@apply px-2 py-1 text-xs border rounded bg-white hover:bg-gray-50;}`}</style>
    </div>
  );
};
export default QuickToolbar;
