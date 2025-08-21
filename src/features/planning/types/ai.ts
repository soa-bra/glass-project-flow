export type AiMessage = { role:"user"|"assistant"; content:string };
export type AiInsight = { title:string; items:{ text:string; score:number }[] };
export type AiAction =
  | { t:"insert"; data:any }
  | { t:"update"; id:string; data:any }
  | { t:"connect"; sourceId:string; targetId:string }
  | { t:"archive"; ids:string[] };
