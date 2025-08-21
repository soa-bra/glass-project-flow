import type { Widget, Frame, Connector } from "@/src/features/planning/types/canvas";

export type CanvasRendererOpts = {
  ctx: CanvasRenderingContext2D;
  dpr?: number;
};
export class CanvasRenderer {
  ctx: CanvasRenderingContext2D;
  dpr: number;
  constructor(opts:CanvasRendererOpts){
    this.ctx = opts.ctx; this.dpr = opts.dpr ?? (globalThis.devicePixelRatio || 1);
  }
  clear(w:number, h:number, color="#ffffff"){
    const { ctx } = this; ctx.save(); ctx.setTransform(1,0,0,1,0,0);
    ctx.fillStyle = color; ctx.fillRect(0,0,w,h); ctx.restore();
  }
  drawGrid(w:number, h:number, size=16, color="#f1f5f9"){
    const { ctx } = this;
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1;
    for (let x=0; x<w; x+=size){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
    for (let y=0; y<h; y+=size){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
    ctx.restore();
  }
  drawFrames(frames:Frame[]){
    const { ctx } = this;
    ctx.save();
    frames.forEach(f=>{
      ctx.fillStyle = f.background ?? "#fff";
      ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth=1.5;
      ctx.fillRect(f.x, f.y, f.w, f.h);
      ctx.strokeRect(f.x, f.y, f.w, f.h);
    });
    ctx.restore();
  }
  drawWidgets(widgets:Widget[]){
    const { ctx } = this;
    ctx.save();
    for (const w of widgets){
      const fill = w.style?.fill ?? (w.type==="sticky" ? "#FFD86B" : "#ffffff");
      const stroke = w.style?.stroke ?? "#111111";
      ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = (w.style?.strokeWidth ?? 1);

      if (w.type==="text"){
        ctx.fillStyle = w.style?.font?.rtl ? "#111" : "#111";
        ctx.font = `${w.style?.font?.weight??600} ${w.style?.font?.size??14}px ${w.style?.font?.family??"Inter"}`
        ctx.textBaseline = "top";
        ctx.fillText(w.data?.text ?? "", w.x+8, w.y+6, w.w-16);
        ctx.strokeStyle="#e5e7eb"; ctx.strokeRect(w.x, w.y, w.w, w.h);
      } else {
        if (w.kind==="ellipse"){
          ctx.beginPath(); ctx.ellipse(w.x+w.w/2, w.y+w.h/2, w.w/2, w.h/2, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        } else {
          const r = w.style?.radius ?? 8;
          roundRect(ctx, w.x, w.y, w.w, w.h, r); ctx.fill(); ctx.stroke();
        }
      }
    }
    ctx.restore();
  }
  drawConnectors(cons:Connector[], nodes:Record<string, {x:number;y:number;w:number;h:number}>) {
    const { ctx } = this;
    ctx.save(); ctx.lineWidth=2; ctx.strokeStyle="#475569";
    cons.forEach(c=>{
      const a = nodes[c.sourceId], b = nodes[c.targetId]; if (!a||!b) return;
      const ax = a.x+a.w/2, ay = a.y+a.h/2, bx = b.x+b.w/2, by = b.y+b.h/2;
      ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(bx,by); ctx.stroke();
    });
    ctx.restore();
  }
}
function roundRect(ctx:CanvasRenderingContext2D, x:number,y:number,w:number,h:number,r:number){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}
