import { clamp } from "./geometry";

export type SnapGuide = { x?:number; y?:number; type:"v"|"h" };
export function snapPoint(p:{x:number;y:number}, guides:SnapGuide[], threshold=6){
  let sx=p.x, sy=p.y; let gx:SnapGuide|undefined, gy:SnapGuide|undefined;
  for (const g of guides){
    if (g.x!==undefined && Math.abs(p.x - g.x) <= threshold){ sx=g.x; gx=g; }
    if (g.y!==undefined && Math.abs(p.y - g.y) <= threshold){ sy=g.y; gy=g; }
  }
  return { x:sx, y:sy, guides: { gx, gy } };
}

export function gridSnap(p:{x:number;y:number}, size=16){
  return { x: Math.round(p.x/size)*size, y: Math.round(p.y/size)*size };
}

export function clampToFrame(p:{x:number;y:number}, frame:{x:number;y:number;w:number;h:number}){
  return { x: clamp(p.x, frame.x, frame.x+frame.w), y: clamp(p.y, frame.y, frame.y+frame.h) };
}
