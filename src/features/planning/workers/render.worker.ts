/// <reference lib="webworker" />
// رسم جزئي في Worker باستخدام OffscreenCanvas
type InitMsg = { type:"init"; canvas: OffscreenCanvas; dpr:number };
type DrawMsg = { type:"draw"; viewport:{tx:number;ty:number;k:number}; frames:any[]; widgets:any[]; connectors:any[]; bg?:string };
type Msg = InitMsg | DrawMsg;

let ctx: OffscreenCanvasRenderingContext2D | null = null;
let dpr = 1;

self.onmessage = (e: MessageEvent<Msg>)=>{
  const msg = e.data;
  if (msg.type==="init"){
    ctx = msg.canvas.getContext("2d");
    dpr = msg.dpr || 1;
    return;
  }
  if (msg.type==="draw" && ctx){
    const { viewport, frames, widgets, connectors, bg="#ffffff" } = msg;
    const c = ctx.canvas as OffscreenCanvas;
    // clear
    ctx.save();
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.fillStyle = bg; ctx.fillRect(0,0,c.width,c.height);
    ctx.restore();

    // world
    ctx.setTransform(dpr*viewport.k,0,0,dpr*viewport.k, dpr*viewport.tx, dpr*viewport.ty);

    // frames
    ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 1/viewport.k;
    for (const f of frames){ roundRect(ctx,f.x,f.y,f.w,f.h,8/viewport.k); }

    // widgets (LOD مبسّط)
    for (const w of widgets){
      ctx.fillStyle = w.style?.fill ?? "#fff";
      ctx.strokeStyle = w.style?.stroke ?? "#111";
      ctx.lineWidth = 1/viewport.k;
      roundRect(ctx,w.x,w.y,w.w,w.h,(w.style?.radius ?? 8)/viewport.k);
      if (w.data?.text && viewport.k>0.9){
        ctx.fillStyle = "#111";
        ctx.font = `${Math.max(10,14/viewport.k)}px Inter, system-ui`;
        ctx.fillText(w.data.text, w.x+8/viewport.k, w.y+20/viewport.k, w.w-12/viewport.k);
      }
    }

    // connectors
    ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = Math.max(1/viewport.k,1);
    const map: Record<string, any> = {};
    for (const w of widgets) map[w.id] = w;
    for (const c2 of connectors){
      const s = map[c2.sourceId], t = map[c2.targetId];
      if (!s || !t) continue;
      const x1 = s.x+s.w/2, y1 = s.y+s.h/2, x2 = t.x+t.w/2, y2 = t.y+t.h/2;
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    }
  }
};

function roundRect(ctx: OffscreenCanvasRenderingContext2D, x:number,y:number,w:number,h:number,r:number){
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y, x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x, y+h, r);
  ctx.arcTo(x, y+h, x, y, r);
  ctx.arcTo(x, y, x+w, y, r);
  ctx.closePath(); ctx.fill(); ctx.stroke();
}
export {};
