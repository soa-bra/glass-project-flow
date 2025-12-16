import React, { memo, useMemo } from "react";
import type { CanvasElementRenderProps } from "./canvas-component-props";
import type { CanvasElementModel } from "./canvas-elements";

function elementBg(el: CanvasElementModel) {
  if (el.type === "note") return "#FEF08A";
  if (el.type === "frame") return "transparent";
  return el.style?.fill ?? "#ffffff";
}

function elementBorder(el: CanvasElementModel) {
  if (el.type === "frame") return el.style?.stroke ?? "#93c5fd";
  return el.style?.stroke ?? "#e5e7eb";
}

function CanvasElementImpl({
  element,
  isSelected,
  isPrimary,
  onPointerDown,
}: CanvasElementRenderProps) {
  const style = useMemo(() => {
    const rot = element.rotation ?? 0;
    const z = element.style?.zIndex ?? 0;

    return {
      width: element.w,
      height: element.h,
      transform: `translate3d(${element.x}px, ${element.y}px, 0) rotate(${rot}deg)`,
      zIndex: z,
      opacity: element.style?.opacity ?? 1,
      pointerEvents: element.locked ? ("none" as const) : ("auto" as const),
    };
  }, [element.x, element.y, element.w, element.h, element.rotation, element.style?.zIndex, element.style?.opacity, element.locked]);

  const border = isSelected
    ? isPrimary
      ? "2px solid #2563eb"
      : "2px solid #60a5fa"
    : `${element.style?.strokeWidth ?? 1}px solid ${elementBorder(element)}`;

  const bg = elementBg(element);

  return (
    <div
      className="absolute select-none will-change-transform"
      style={style}
      onPointerDown={(e) => onPointerDown?.(element.id, e)}
      data-element-id={element.id}
    >
      <div
        className="w-full h-full rounded-xl shadow-sm"
        style={{
          background: bg,
          border,
          borderRadius: element.style?.radius ?? 12,
          boxSizing: "border-box",
        }}
      >
        <Header element={element} />
        <Body element={element} />
      </div>
    </div>
  );
}

function Header({ element }: { element: CanvasElementModel }) {
  const title = element.name?.trim();
  if (!title) return null;
  return (
    <div className="px-2 pt-2 text-xs font-medium text-neutral-700 truncate">
      {title}
    </div>
  );
}

function Body({ element }: { element: CanvasElementModel }) {
  if (element.type === "text") {
    return (
      <div
        className="px-2 py-2 text-sm whitespace-pre-wrap"
        style={{
          color: element.style?.textColor ?? "#111827",
          fontSize: element.style?.fontSize ?? 14,
          fontWeight: element.style?.fontWeight ?? 500,
        }}
      >
        {(element as any).text ?? ""}
      </div>
    );
  }

  if (element.type === "note") {
    return (
      <div
        className="px-2 py-2 text-sm whitespace-pre-wrap"
        style={{
          color: element.style?.textColor ?? "#111827",
          fontSize: element.style?.fontSize ?? 14,
          fontWeight: element.style?.fontWeight ?? 500,
        }}
      >
        {(element as any).text ?? ""}
      </div>
    );
  }

  if (element.type === "image") {
    const src = (element as any).src as string;
    return (
      <div className="w-full h-full overflow-hidden rounded-xl">
        {src ? (
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-xs text-neutral-500">
            صورة
          </div>
        )}
      </div>
    );
  }

  if (element.type === "frame") {
    return (
      <div className="w-full h-full" />
    );
  }

  return (
    <div className="w-full h-full grid place-items-center text-xs text-neutral-500">
      {element.type}
    </div>
  );
}

export const CanvasElement = memo(CanvasElementImpl);
