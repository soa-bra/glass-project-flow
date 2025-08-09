import React, { useMemo, useState } from "react";
import { useOthers, useSelf, useStorage, useMutation } from "@liveblocks/react/suspense";
import { LiveList, LiveObject } from "@liveblocks/client";
import type { ChatMessage } from "../types/panels";

type Tab = "people" | "chat" | "audio";

function ChatView() {
  const me = useSelf();
  const msgs = useStorage(root => root.collabChat?.toImmutable?.() ?? []) as ChatMessage[];
  const ensure = useMutation(({ storage }) => {
    if (!storage.get("collabChat")) storage.set("collabChat", new LiveList([]));
  }, []);
  React.useEffect(()=>{ ensure(); }, [ensure]);

  const [text, setText] = useState("");
  const push = useMutation(({ storage }, m: ChatMessage) => {
    const list = storage.get("collabChat") as LiveList<LiveObject<ChatMessage>>;
    list.push(new LiveObject(m));
  }, []);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ flex:1, overflow:"auto", padding:8, background:"#fff", border:"1px solid #e5e7eb", borderRadius:8 }}>
        {msgs.map(m => (
          <div key={m.id} style={{ marginBottom:8, opacity: 1 }}>
            <div style={{ fontSize:11, opacity:0.7 }}>{m.name} • {new Date(m.ts).toLocaleTimeString()}</div>
            <div>{m.text}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:8, marginTop:8 }}>
        <input value={text} onChange={(e)=>setText(e.target.value)} placeholder="أرسل رسالة" style={{ flex:1, padding:"8px 10px", border:"1px solid #e5e7eb", borderRadius:8 }} />
        <button onClick={()=>{
          if(!text.trim()) return;
          push({ id: Math.random().toString(36).slice(2), userId: me.connectionId, name: (me.info as any)?.name ?? "Me", text: text.trim(), ts: Date.now() });
          setText("");
        }}>إرسال</button>
      </div>
    </div>
  );
}

export default function CollaborationPanel() {
  const others = useOthers();
  const me = useSelf();
  const [tab, setTab] = useState<Tab>("people");

  const invite = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("guest", "1");
    navigator.clipboard.writeText(url.toString());
    alert("تم نسخ رابط الدعوة إلى الحافظة");
  };

  return (
    <div style={{ height: "30%", minHeight: 200, borderBottom: "1px solid #e5e7eb", display:"flex", flexDirection:"column" }}>
      <div style={{ display:"flex", gap:8, padding:8 }}>
        <button onClick={()=>setTab("people")} style={{ fontWeight: tab==="people" ? 700 : 400 }}>المشاركون</button>
        <button onClick={()=>setTab("chat")} style={{ fontWeight: tab==="chat" ? 700 : 400 }}>دردشة</button>
        <button onClick={()=>setTab("audio")} style={{ fontWeight: tab==="audio" ? 700 : 400 }}>صوت</button>
        <div style={{ marginInlineStart: "auto" }}>
          <button onClick={invite} title="دعوة (للهوست فقط)">دعوة</button>
        </div>
      </div>

      <div style={{ flex:1, padding:8, overflow:"auto" }}>
        {tab === "people" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(140px,1fr))", gap:8 }}>
            <div style={{ padding:8, border:"1px solid #e5e7eb", borderRadius:8 }}>
              <div>👑 الهوست</div>
              <div>{(me.info as any)?.name ?? "Me"}</div>
            </div>
            {others.map(o => (
              <div key={o.connectionId} style={{ padding:8, border:"1px solid #e5e7eb", borderRadius:8 }}>
                <div>👤 مشارك</div>
                <div>{(o.info as any)?.name ?? `User ${o.connectionId}`}</div>
              </div>
            ))}
          </div>
        )}
        {tab === "chat" && (<ChatView />)}
        {tab === "audio" && (
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button title="كتم/إلغاء كتم">🔇 كتم</button>
            <button title="إنهاء الاتصال">⏹ إنهاء</button>
            <span style={{ opacity:0.7 }}>الحالة: غير متصل (واجهة فقط)</span>
          </div>
        )}
      </div>
    </div>
  );
}
