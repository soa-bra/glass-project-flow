export async function traced<T>(name:string, fn:()=>Promise<T>){
  const t0 = performance.now();
  const res = await fn();
  const t1 = performance.now();
  console.info(`[trace] ${name}: ${(t1-t0).toFixed(1)}ms`);
  return res;
}
