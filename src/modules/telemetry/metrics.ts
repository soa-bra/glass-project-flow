const M: Record<string, number[]> = {};
export function metric(name:string, value:number){
  if (!M[name]) M[name] = [];
  M[name].push(value);
}
export function summary(name:string){
  const a = M[name] ?? []; if (!a.length) return { count:0, p95:0, avg:0 };
  const s = [...a].sort((x,y)=>x-y);
  const p95 = s[Math.floor(0.95*s.length)];
  const avg = a.reduce((t,v)=>t+v,0)/a.length;
  return { count:a.length, p95, avg };
}
