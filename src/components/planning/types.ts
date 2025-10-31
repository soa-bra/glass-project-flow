export type ToolId =
  | "selection_tool"
  | "smart_pen"
  | "frame_tool"
  | "file_uploader"
  | "text_tool"
  | "shapes_tool"
  | "smart_element_tool";

export type GridType = "dots" | "grid" | "isometric" | "hex";

export interface GridSettings {
  visible: boolean;
  snap: boolean;
  size: 4 | 8 | 16 | 32 | 64;
  type: GridType;
}

export interface CanvasElement {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style?: Record<string, any>;
  content?: string;
  rotation?: number;
}

export interface AssistCommandPayload {
  type: "smart_project" | "review" | "cleanup" | "chat";
  message?: string;
}
