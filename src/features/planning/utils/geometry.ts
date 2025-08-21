export const clamp = (v:number, a:number, b:number)=> Math.max(a, Math.min(b, v));
export const lerp = (a:number,b:number,t:number)=> a + (b-a)*t;

export function rectContains(r:{x:number;y:number;w:number;h:number}, p:{x:number;y:number}){
  return p.x>=r.x && p.x<=r.x+r.w && p.y>=r.y && p.y<=r.y+r.h;
}
export function rectsIntersect(a:{x:number;y:number;w:number;h:number}, b:{x:number;y:number;w:number;h:number}){
  return !(a.x+a.w<b.x || b.x+b.w<a.x || a.y+a.h<b.y || b.y+b.h<a.y);
}
export function centerOf(r:{x:number;y:number;w:number;h:number}){ return { x:r.x+r.w/2, y:r.y+r.h/2 }; }
export function inflate(r:{x:number;y:number;w:number;h:number}, m:number){ return { x:r.x-m, y:r.y-m, w:r.w+2*m, h:r.h+2*m }; }

export function bboxOfPoints(pts:{x:number;y:number}[]){
  const xs = pts.map(p=>p.x), ys = pts.map(p=>p.y);
  const minX = Math.min(...xs), minY = Math.min(...ys), maxX = Math.max(...xs), maxY = Math.max(...ys);
  return { x:minX, y:minY, w:maxX-minX, h:maxY-minY };
}

export function normalizeAngle(rad:number){
  const two = Math.PI*2; let r = rad % two; if (r<0) r+=two; return r;
}

export function distance(a:{x:number;y:number}, b:{x:number;y:number}){
  const dx=a.x-b.x, dy=a.y-b.y; return Math.hypot(dx,dy);
}
