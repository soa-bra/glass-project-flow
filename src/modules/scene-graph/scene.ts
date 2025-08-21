import type { Frame, Widget, Connector } from "@/src/features/planning/types/canvas";
import type { SGNode } from "./node";
import { sortByZ } from "./z-order";
import { HitTestIndex } from "./hit-test-index";

export class SceneGraph {
  frames: Frame[] = [];
  widgets: Widget[] = [];
  connectors: Connector[] = [];
  index = new HitTestIndex();

  set(frames:Frame[], widgets:Widget[], connectors:Connector[]){
    this.frames = frames; this.widgets = widgets; this.connectors = connectors;
    const nodes: SGNode[] = [
      ...frames.map(f=>({ id:f.id, kind:"frame", z:0, bounds:{ x:f.x,y:f.y,w:f.w,h:f.h } })),
      ...widgets.map(w=>({ id:w.id, kind:"widget", z:w.zIndex ?? 1, bounds:{ x:w.x,y:w.y,w:w.w,h:w.h } })),
    ];
    this.index.set(sortByZ(nodes));
  }

  hit(p:{x:number;y:number}){ return this.index.hit(p); }
}
