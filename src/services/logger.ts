export const logger = {
  info: (...a:any[])=> console.log("[INFO]", ...a),
  warn: (...a:any[])=> console.warn("[WARN]", ...a),
  error:(...a:any[])=> console.error("[ERROR]", ...a),
};

// مقارنة سطحية سريعة
export function shallowEqual(a:any,b:any){
  if (Object.is(a,b)) return true;
  if (typeof a!=="object" || typeof b!=="object" || !a || !b) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka){ if (!Object.prototype.hasOwnProperty.call(b,k) || !Object.is(a[k], b[k])) return false; }
  return true;
}
