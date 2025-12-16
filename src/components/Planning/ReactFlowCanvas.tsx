// src/components/Planning/ReactFlowCanvas.tsx
import React, { useMemo, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type OnSelectionChangeParams
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useCanvasStore } from "@/stores/canvasStore";
import type { CanvasElement } from "@/types/canvas";
import CanvasElementComponent from "./CanvasElement";

type Props = { boardId: string };

const isArrowElement = (el: CanvasElement) =>
  el.type === "shape" && ((el.shapeType || el.data?.shapeType || "").startsWith("arrow_"));

function elementsToNodes(elements: CanvasElement[], layers: any[]): Node[] {
  return elements
    .filter((el) => {
      const layer = layers.find((l: any) => l.id === el.layerId);
      const isVisible = el.visible !== false && layer?.visible !== false;

      if (isArrowElement(el)) return false;
      if (!isVisible) return false;

      return true;
    })
    .map((el) => ({
      id: el.id,
      type: "soaBraNode",
      position: { x: el.position.x, y: el.position.y },
      data: { elementId: el.id },
      draggable: !el.locked,
      selectable: !el.locked
    }));
}

const SoaBraNode = ({ data }: { data: { elementId: string } }) => {
  const elementId = data?.elementId;

  const element = useCanvasStore((s) => s.elements.find((e) => e.id === elementId));
  const selectedIds = useCanvasStore((s) => s.selectedElementIds);
  const activeTool = useCanvasStore((s) => s.activeTool);
  const selectElement = useCanvasStore((s) => s.selectElement);

  if (!element) return null;

  return (
    <div style={{ width: element.size.width, height: element.size.height }}>
      <CanvasElementComponent
        element={element}
        isSelected={selectedIds.includes(element.id)}
        onSelect={(multi) => selectElement(element.id, multi)}
        activeTool={activeTool}
        disableDrag
      />
    </div>
  );
};

const nodeTypes = { soaBraNode: SoaBraNode };

export default function ReactFlowCanvas({ boardId }: Props) {
  const elements = useCanvasStore((s) => s.elements);
  const layers = useCanvasStore((s) => s.layers);
  const selectElements = useCanvasStore((s) => s.selectElements);
  const updateElement = useCanvasStore((s) => s.updateElement);
  const pushHistory = useCanvasStore((s) => s.pushHistory);

  const nodes = useMemo(() => elementsToNodes(elements, layers), [elements, layers]);

  const onNodeDragStop = useCallback(
    (_e: any, node: any) => {
      updateElement(node.id, { position: { x: node.position.x, y: node.position.y } });
      pushHistory();
    },
    [updateElement, pushHistory]
  );

  const onSelectionChange = useCallback(
    (params: OnSelectionChangeParams) => {
      const ids = (params.nodes || []).map((n) => n.id);
      selectElements(ids);
    },
    [selectElements]
  );

  return (
    <div className="absolute inset-0">
      <ReactFlow
        nodes={nodes}
        edges={[]}
        nodeTypes={nodeTypes as any}
        onNodeDragStop={onNodeDragStop}
        onSelectionChange={onSelectionChange}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
