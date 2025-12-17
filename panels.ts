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

export interface ChatMessage {
  id: string;
  userId: number;
  name: string;
  text: string;
  ts: number; // epoch ms
}

export interface AssistCommandPayload {
  type: "smart_finish" | "smart_review" | "smart_cleanup" | "chat";
  message?: string;
}

export interface LayerExtra {
  hidden?: boolean;
  locked?: boolean;
  opacity?: number;
  stroke?: { color: { r:number; g:number; b:number }; width: number; style: "solid"|"dashed"|"dotted" };
  lockedBy?: number | null;
  link?: string | null;
  folderId?: string | null; // for nested grouping
}
