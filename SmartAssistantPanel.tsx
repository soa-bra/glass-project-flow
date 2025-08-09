import React, { useEffect, useMemo, useRef, useState } from "react";
// Stick with the main package export to avoid optional subpath lookups.
import { useSelf, useStorage, useMutation } from "@liveblocks/react";
import type { ChatMessage, AssistCommandPayload } from "../types/panels";
import { LiveList, LiveObject } from "@liveblocks/client";

function Bubble({ mine, name, text, ts }: { mine: boolean; name: string; text: string; ts: number }) {
  const time = new Date(ts).toLocaleTimeString();
  return (
    <div style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start", marginBottom: 8 }}>
      <div style={{ maxWidth: "80%", background: mine ? "#2563eb" : "#f1f5f9", color: mine ? "#fff" : "#111827", padding: "8px 12px", borderRadius: 12 }}>
        {!mine && <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 4 }}>{name}</div>}
        <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>
        <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: mine ? "right" : "left" }}>{time}</div>
      </div>
    </div>
  );
}

export default function SmartAssistantPanel() {
  const me = useSelf();
  const chat = useStorage(root => root.chat) as LiveList<LiveObject<ChatMessage>> | undefined;

  const ensureChat = useMutation(({ storage }) => {
    if (!storage.get("chat")) storage.set("chat", new LiveList([]));
  }, []);

  useEffect(() => { ensureChat(); }, [ensureChat]);

  const [input, setInput] = useState("");
  const msgs = useStorage(root => root.chat?.toImmutable() ?? []) as ChatMessage[];

  async function sendAssist(payload: AssistCommandPayload) {
    try {
      // endpoint placeholder - integrate with your backend
      await fetch("/ai/assist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } catch {}
  }

  const pushMessage = useMutation(({ storage }, m: ChatMessage) => {
    const list = storage.get("chat") as LiveList<LiveObject<ChatMessage>>;
    list.push(new LiveObject(m));
  }, []);

  const send = async () => {
    if (!input.trim()) return;
    const m: ChatMessage = {
      id: Math.random().toString(36).slice(2),
      userId: me.connectionId,
      name: (me.info as any)?.name ?? "Me",
      text: input.trim(),
      ts: Date.now(),
    };
    pushMessage(m);
    setInput("");
    await sendAssist({ type: "chat", message: m.text });
  };

  const action = async (type: AssistCommandPayload["type"]) => {
    pushMessage({ id: Math.random().toString(36).slice(2), userId: 0, name: "System", text: `تشغيل الأمر: ${type}`, ts: Date.now() });
    await sendAssist({ type });
  };

  return (
    <div style={{ height: "35%", minHeight: 220, display: "flex", flexDirection: "column", borderTop: "1px solid #e5e7eb" }}>
      {/* أوامر ذكية */}
      <div style={{ display: "flex", gap: 8, padding: 8, borderBottom: "1px solid #e5e7eb" }}>
        <button onClick={() => action("smart_finish")} title="إنهاء ذكي" style={{ padding: "6px 10px" }}>⏩ إنهاء ذكي</button>
        <button onClick={() => action("smart_review")} title="مراجعة ذكية" style={{ padding: "6px 10px" }}>🔍 مراجعة ذكية</button>
        <button onClick={() => action("smart_cleanup")} title="تنظيف ذكي" style={{ padding: "6px 10px" }}>🧹 تنظيف ذكي</button>
      </div>

      {/* دردشة */}
      <div style={{ flex: 1, overflow: "auto", padding: 12, background: "#fff" }}>
        {msgs.map((m) => (
          <Bubble key={m.id} mine={m.userId === me.connectionId} name={m.name} text={m.text} ts={m.ts} />
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, padding: 8, borderTop: "1px solid #e5e7eb" }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="اسأل المساعد..." style={{ flex: 1, padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 8 }} />
        <button onClick={send} style={{ padding: "8px 14px" }}>إرسال</button>
      </div>
    </div>
  );
}
