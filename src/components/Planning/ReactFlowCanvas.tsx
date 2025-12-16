import React, { useMemo, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type NodeChange,
  type OnSelectionChangeParams,
  type NodeProps,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useCanvasStore } from "@/stores/canvasStore";
import type { CanvasElement } from "@/types/canvas";
import CanvasElementComponent from "./CanvasElement";

type Props = { boardId: string };

type SoaBraNodeData = {
  elementId: string;
};

const isArrowElement = (el: CanvasElement) => {
  const shapeType = (el as any)?.shapeType || (el as any)?.data?.shapeType || "";
  return el.type === "shape" && typeof shapeType === "string" && shapeType.startsWith("arrow_");
};

function elementsToNodes(elements: CanvasElement[], layers: any[]): Node<SoaBraNodeData>[] {
  return elements
    .filter((el) => {
      if (!el) return false;
      const layer = layers.find((l: any) => l.id === el.layerId);
      const isVisible = el.visible !== false && layer?.visible !== false;
      if (!isVisible) return false;

      // MVP: استبعاد الأسهم مؤقتًا
      if (isArrowElement(el)) return false;

      return true;
    })
    .map((el) => ({
      id: el.id,
      type: "soaBraNode",
      position: { x: el.position.x, y: el.position.y },
      data: { elementId: el.id },
      draggable: !el.locked,
      selectable: !el.locked,
    }));
}

const SoaBraNode: React.FC<NodeProps> = (props) => {
  const data = (props.data || {}) as any;
  const elementId: string | undefined = data.elementId;

  const element = useCanvasStore((s) => (elementId ? s.elements.find((e) => e.id === elementId) : undefined));
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

const nodeTypes: NodeTypes = { soaBraNode: SoaBraNode };

export default function ReactFlowCanvas({ boardId }: Props) {
  const elements = useCanvasStore((s) => s.elements);
  const layers = useCanvasStore((s) => s.layers);
  const selectElements = useCanvasStore((s) => s.selectElements);
  const updateElement = useCanvasStore((s) => s.updateElement);
  const pushHistory = useCanvasStore((s) => s.pushHistory);

  const nodes = useMemo(() => elementsToNodes(elements, layers), [elements, layers]);

  const onNodesChange = useCallback((_changes: NodeChange[]) => {
    // MVP: تجاهل التحديثات المستمرة أثناء السحب
  }, []);

  const onNodeDragStop = useCallback(
    (_e: any, node: any) => {
      if (!node?.id || !node?.position) return;
      updateElement(node.id, { position: { x: node.position.x, y: node.position.y } });
      pushHistory();
    },
    [updateElement, pushHistory],
  );

  const onSelectionChange = useCallback(
    (params: OnSelectionChangeParams) => {
      const ids = (params.nodes || []).map((n) => n.id).filter(Boolean);
      selectElements(ids);
    },
    [selectElements],
  );

  return (
    <div className="absolute inset-0" data-reactflow-canvas="true">
      <ReactFlow
        nodes={nodes as any}
        edges={[]}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
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
