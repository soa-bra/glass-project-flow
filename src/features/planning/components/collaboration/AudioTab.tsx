"use client";
import React, { useEffect, useRef, useState } from "react";
import { useCollaboration } from "@/src/features/planning/hooks/useCollaboration";

const ChatTab: React.FC = () => {
  const { chat, sendChat, reactToMessage } = useCollaboration();
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const commit = () => {
    if (!text.trim()) return;
    sendChat(text);
    setText("");
  };

  useEffect(()=>{ endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-2 space-y-2">
        {chat.map((m:any)=>(
          <div key={m.id} className="border rounded p-2">
            <div className="text-[11px] text-gray-500">{m.authorName} • {new Date(m.at).toLocaleTimeString()}</div>
            <div className="text-sm whitespace-pre-wrap">{m.text}</div>
            <div className="pt-1 flex gap-2 text-xs">
              <button onClick={()=>reactToMessage(m.id, "👍")}>👍 {m.reactions?.["👍"] ?? 0}</button>
              <button onClick={()=>reactToMessage(m.id, "🎉")}>🎉 {m.reactions?.["🎉"] ?? 0}</button>
              <button onClick={()=>reactToMessage(m.id, "❤️")}>❤️ {m.reactions?.["❤️"] ?? 0}</button>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="border-t p-2 flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1 text-sm"
          placeholder="اكتب رسالة…"
          value={text}
          onChange={(e)=>setText(e.target.value)}
          onKeyDown={(e)=>{ if(e.key==="Enter"){ commit(); } }}
        />
        <button className="px-2 py-1 text-sm border rounded bg-white hover:bg-gray-50" onClick={commit}>إرسال</button>
      </div>
    </div>
  );
};
export default ChatTab;
