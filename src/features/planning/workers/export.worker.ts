/// <reference lib="webworker" />
// توليد SVG/PNG في Worker
type SvgReq = { type:"export-svg"; width:number; height:number; widgets:any[]; frames:any[]; connectors:any[]; bg?:string };
type PngReq = { type:"export-png"; width:number; height:number; widgets:any[]; frames:any[]; connectors:any[]; bg?:string };
type Msg = SvgReq | PngReq;

self.onmessage = async (e: MessageEvent<Msg>)=>{
  const m = e.data;
  if (m.type==="export-svg"){
    const svg = renderSVG(m.width, m.height, m.widgets, m.frames, m.connectors, m.bg || "#fff");
    (self as any).postMessage({ kind:"svg", svg });
  } else if (m.type==="export-png"){
    // نرسم SVG ثم نحوّله إلى PNG via OffscreenCanvas
    const svg = renderSVG(m.width, m.height, m.widgets, m.frames, m.connectors, m.bg || "#fff");
    const blob = new Blob([svg], { type:"image/svg+xml" });
    const bmp = await createImageBitmap(blob);
    const canvas = new OffscreenCanvas(m.width, m.height);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = m.bg || "#fff"; ctx.fillRect(0,0,m.width,m.height);
    ctx.drawImage(bmp, 0, 0);
    const pngBlob = await canvas.convertToBlob({ type:"image/png" });
    const buf = await pngBlob.arrayBuffer();
    (self as any).postMessage({ kind:"png", buffer: buf }, [buf]);
  }
};

function renderSVG(w:number,h:number, widgets:any[], frames:any[], connectors:any[], bg:string){
  const esc = (s:string)=> String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");
  const rects = frames.map((f:any)=>`<rect x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" rx="8" fill="none" stroke="#cbd5e1"/>`).join("");
  const ws = widgets.map((n:any)=>`<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="${n.style?.radius??8}" fill="${n.style?.fill??"#fff"}" stroke="${n.style?.stroke??"#111"}"/>`).join("");
  const texts = widgets.filter((n:any)=>n.data?.text).map((n:any)=>`<text x="${n.x+8}" y="${n.y+20}" font-family="Inter" font-size="14" fill="#111">${esc(n.data.text)}</text>`).join("");
  const conns = connectors.map((c:any)=>{
    const s = widgets.find((w:any)=>w.id===c.sourceId); const t = widgets.find((w:any)=>w.id===c.targetId);
    if (!s || !t) return "";
    const x1=s.x+s.w/2, y1=s.y+s.h/2, x2=t.x+t.w/2, y2=t.y+t.h/2;
    return `<path d="M ${x1} ${y1} L ${x2} ${y2}" stroke="#94a3b8" fill="none"/>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="${bg}"/>${rects}${ws}${texts}${conns}</svg>`;
}
export {};
