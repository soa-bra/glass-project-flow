"use client";
import React, { useState } from "react";
import AiFinish from "./AiFinish";
import AiReview from "./AiReview";
import AiClean from "./AiClean";
import { useSmartAssistant } from "@/src/features/planning/hooks/useSmartAssistant";

const SmartAssistantPanel: React.FC = () => {
  const { open, toggleOpen, busy } = useSmartAssistant();
  const [tab, setTab] = useState<"finish"|"review"|"clean"|"chat">("chat");

  return (
    <>
      <button
        onClick={toggleOpen}
        aria-pressed={open}
        title="Smart Assistant"
        className={`fixed left-3 top-20 z-40 shadow px-3 py-2 rounded border bg-white hover:bg-gray-50 ${busy ? "opacity-70" : ""}`}
      >
        🤖 AI
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Smart Assistant"
          className="fixed left-3 top-36 z-40 w-[360px] max-h-[70vh] border rounded bg-white shadow flex flex-col overflow-hidden"
        >
          {/* Action row */}
          <div className="border-b bg-gray-50 p-2 flex items-center gap-2">
            <button className={btn(tab==="finish")} onClick={()=>setTab("finish")} title="إنهاء ذكي">⏩ Finish</button>
            <button className={btn(tab==="review")} onClick={()=>setTab("review")} title="مراجعة ذكية">🔍 Review</button>
            <button className={btn(tab==="clean")}  onClick={()=>setTab("clean")} title="تنظيف ذكي">🧹 Clean</button>
            <span className="flex-1" />
            <span className={`text-[11px] ${busy?"text-amber-600":"text-gray-500"}`}>{busy? "Working…" : "Idle"}</span>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-auto">
            {tab==="finish" && <AiFinish />}
            {tab==="review" && <AiReview />}
            {tab==="clean"  && <AiClean />}
            {tab==="chat"   && <ChatBox />}
          </div>

          {/* Chat footer */}
          <ChatComposer />
        </div>
      )}
    </>
  );
};

const btn = (active:boolean) =>
  `px-2 py-1 text-sm border rounded ${active ? "bg-white border-blue-300 text-blue-700" : "bg-white hover:bg-gray-100"}`;

const ChatBox: React.FC = () => {
  const { messages } = useSmartAssistant();
  return (
    <div className="p-2 space-y-2">
      {messages.length === 0 && <div className="text-xs text-gray-500">اكتب رسالة أو استخدم أوامر Slash مثل /ai/assist</div>}
      {messages.map((m, i) => (
        <div key={i} className={`text-sm ${m.role==="user" ? "text-gray-800" : "text-slate-700"}`}>
          <div className="text-[11px] text-gray-400">{m.role}</div>
          <div className="whitespace-pre-wrap">{m.content}</div>
        </div>
      ))}
    </div>
  );
};

const ChatComposer: React.FC = () => {
  const { send, busy } = useSmartAssistant();
  const [text, setText] = React.useState("");

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      commit();
    }
  };
  const commit = () => {
    if (!text.trim()) return;
    send(text);
    setText("");
  };

  return (
    <div className="border-t p-2 flex gap-2 items-end">
      <textarea
        aria-label="Message"
        className="flex-1 border rounded px-2 py-1 text-sm resize-none h-16"
        placeholder="اسأل الذكاء الصناعي… (Ctrl/Cmd+Enter)"
        disabled={busy}
        value={text}
        onChange={(e)=>setText(e.target.value)}
        onKeyDown={onKey}
      />
      <button className="px-3 py-2 text-sm border rounded bg-white hover:bg-gray-50 disabled:opacity-50" onClick={commit} disabled={busy}>إرسال</button>
    </div>
  );
};

export default SmartAssistantPanel;
