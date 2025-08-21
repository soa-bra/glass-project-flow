import type { Guides } from "@/src/features/planning/types/canvas";
import { centerOf } from "@/src/features/planning/utils/geometry";

export function buildGuides({ frames, widgets }: { frames:any[]; widgets:any[] }): Guides {
  const v:number[] = [], h:number[] = [], boxes:{x:number;y:number;w:number;h:number}[] = [];
  for (const f of frames){
    v.push(f.x, f.x+f.w, f.x+f.w/2);
    h.push(f.y, f.y+f.h, f.y+f.h/2);
    boxes.push({ x:f.x, y:f.y, w:f.w, h:f.h });
  }
  for (const w of widgets){
    const c = centerOf(w);
    v.push(w.x, w.x+w.w, c.x);
    h.push(w.y, w.y+w.h, c.y);
    boxes.push({ x:w.x, y:w.y, w:w.w, h:w.h });
  }
  return { v:Array.from(new Set(v)), h:Array.from(new Set(h)), boxes };
}
