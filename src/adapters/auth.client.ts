// طبقة مصغّرة لقراءة توكن/هوية المستخدم من Supabase أو LocalStorage
export type AuthInfo = { userId:string; name:string; avatar?:string; token?:string };

export function getAuth(): AuthInfo {
  // محاولة من localStorage (Lovable/Supabase)
  try {
    const raw = localStorage.getItem("soabra.auth");
    if (raw) return JSON.parse(raw);
  } catch {}
  // افتراضي ضيف
  return { userId: "guest-" + Math.random().toString(36).slice(2,8), name: "Guest" };
}
