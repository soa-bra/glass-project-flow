export type ID = string;

export type Transform = { x:number; y:number; scale?:number; rotation?:number };
export type XYWH = { x:number; y:number; w:number; h:number };

export type Style = {
  fill?: string; stroke?: string; opacity?: number; radius?: number;
  strokeWidth?: number; dash?: number[]; shadow?: string;
  font?: { family?:string; size?:number; weight?:number; align?: "left"|"center"|"right"; rtl?: boolean };
};

export type WidgetType = "sticky"|"shape"|"text"|"image"|"table"|"pen"|"connector"|"frame"|"widget"|"smart";
export type ShapeKind = "rect"|"ellipse"|"triangle"|"diamond"|"star"|"arrow";

export type Widget = XYWH & {
  id: ID;
  type: WidgetType;
  kind?: ShapeKind;
  parentId?: ID|null;
  frameId?: ID|null;
  zIndex?: number;
  rotation?: number;
  style?: Style;
  data?: any;
  src?: string;
  alt?: string;
  locks?: { movable?:boolean; resizable?:boolean };
  createdBy?: ID;
  updatedAt?: number;
  lockedBy?: ID|null;
};

export type Frame = XYWH & { id:ID; name?:string; background?:string; locked?:boolean };
export type Connector = { id:ID; sourceId:ID; targetId:ID; route?: any; style?:Style; label?:string; boardId?:ID };

export type Board = {
  id: ID; name: string; ownerId: ID; settings?: any;
  frames: Frame[]; widgets: Widget[]; connectors: Connector[];
};

export type Guides = { v:number[]; h:number[]; boxes:{x:number;y:number;w:number;h:number}[] };

export type Camera = { k:number; tx:number; ty:number };

export type HitTestResult = { id:ID; type:"frame"|"widget"|"connector"; local:{x:number;y:number} };
