import type { SGNode } from "./node";

export class HitTestIndex {
  nodes: SGNode[] = [];
  set(nodes:SGNode[]){ this.nodes = nodes; }
  hit(p:{x:number;y:number}): SGNode | null {
    for (let i=this.nodes.length-1; i>=0; i--){
      const n = this.nodes[i];
      const b = n.bounds; if (!b) continue;
      if (p.x>=b.x && p.x<=b.x+b.w && p.y>=b.y && p.y<=b.y+b.h) return n;
    }
    return null;
  }
}
