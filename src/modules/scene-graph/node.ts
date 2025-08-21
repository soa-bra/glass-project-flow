import type { ID } from "@/src/features/planning/types/canvas";

export type NodeKind = "frame"|"widget"|"connector"|"group";
export type SGNode = {
  id: ID;
  kind: NodeKind;
  parentId?: ID|null;
  z?: number;
  bounds?: { x:number;y:number;w:number;h:number };
};
