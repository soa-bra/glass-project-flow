"use client";
import React, { useEffect, useRef, useState } from "react";
import { useCanvas } from "@/src/features/planning/hooks/useCanvas";
import { useSelection } from "@/src/features/planning/hooks/useSelection";

type Ctx = { x: number; y: number; target: "canvas" | "widget" | "frame" } | null;

const ContextMenus: React.FC = () => {
  const { insertShape, pasteFromClipboard, copySelection, cutSelection, deleteSelection, newFrame } = useCanvas();
  const { selection } = useSelection();
  const [ctx, setCtx] = useState<Ctx>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onCtx = (e: MouseEvent) => {
      const targetType: Ctx["target"] = selection?.ids.length ? "widget" : "canvas";
      e.preventDefault();
      setCtx({ x: e.clientX, y: e.clientY, target: targetType });
    };
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setCtx(null);
    };
    document.addEventListener("contextmenu", onCtx);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("contextmenu", onCtx);
      document.removeEventListener("click", onClick);
    };
  }, [selection?.ids.length]);

  if (!ctx) return null;

  return (
    <div
      ref={ref}
      role="menu"
      className="fixed z-50 bg-white border rounded shadow w-56 p-1"
      style={{ left: ctx.x, top: ctx.y }}
    >
      {ctx.target === "canvas" && (
        <>
          <Item onClick={() => insertShape("sticky")}>🗒 New Sticky</Item>
          <Item onClick={() => newFrame()}>▭ New Frame</Item>
          <Sep/>
          <Item onClick={() => pasteFromClipboard()}>📋 Paste</Item>
        </>
      )}
      {ctx.target === "widget" && (
        <>
          <Item onClick={() => copySelection()}>📄 Copy</Item>
          <Item onClick={() => cutSelection()}>✂️ Cut</Item>
          <Item danger onClick={() => deleteSelection()}>🗑 Delete</Item>
          <Sep/>
          <Item onClick={() => insertShape("connector")}>🔗 Create Connector</Item>
        </>
      )}
    </div>
  );
};

const Item: React.FC<React.PropsWithChildren<{ onClick: () => void; danger?: boolean }>> = ({ onClick, children, danger }) => (
  <button
    role="menuitem"
    onClick={onClick}
    className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-50 ${danger ? "text-red-600" : ""}`}
  >
    {children}
  </button>
);
const Sep = () => <div className="h-px bg-gray-200 my-1" />;

export default ContextMenus;
