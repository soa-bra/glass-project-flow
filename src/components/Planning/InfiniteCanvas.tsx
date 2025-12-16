import React, { useRef } from "react";
import PureCanvasBoard from "./PureCanvasBoard";
import { useOptimizedCanvas } from "./useOptimizedCanvas";
import SelectionBoxOverlay from "./SelectionBoxOverlay";

type Props = {
  children?: React.ReactNode;
};

export default function InfiniteCanvas({ children }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);

  const { onPointerDown, onPointerMove, onPointerUp, onElementLayerPointerDown, selectionBox } =
    useOptimizedCanvas(viewportRef);

  return (
    <div
      ref={viewportRef}
      className="w-full h-full"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <PureCanvasBoard overlay={<SelectionBoxOverlay rect={selectionBox} />}>
        <div className="absolute inset-0" onPointerDown={onElementLayerPointerDown}>
          {children}
        </div>
      </PureCanvasBoard>
    </div>
  );
}
