export async function http<T=any>(url:string, opts: RequestInit = {}): Promise<T>{
  const res = await fetch(url, { headers: { "Content-Type":"application/json", ...(opts.headers||{}) }, ...opts });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json() as Promise<T>;
  return (await res.text()) as unknown as T;
}
