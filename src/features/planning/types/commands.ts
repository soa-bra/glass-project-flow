import type { Widget, Frame, Connector, ID, Style, XYWH } from "./canvas";

export type CommandInsert = { kind:"insert"; item: Widget|Frame|Connector };
export type CommandMove = { kind:"move"; id:ID; delta:{dx:number;dy:number}; target?: "widget"|"frame" };
export type CommandStyle = { kind:"style"; id:ID; patch:Partial<Style>; target?: "widget"|"frame"|"connector" };
export type CommandConnect = { kind:"connect"; sourceId:ID; targetId:ID; style?:Partial<Style> };
export type CommandGroup = { kind:"group"; ids:ID[]; frameId?:ID|null };
export type CommandUnGroup = { kind:"ungroup"; groupId:ID };
export type CommandResize = { kind:"resize"; id:ID; to:XYWH; target?: "widget"|"frame" };

export type Command =
  | CommandInsert | CommandMove | CommandStyle | CommandConnect | CommandGroup | CommandUnGroup | CommandResize;

export type CommandResult = { ok:true } | { ok:false; error:string };
