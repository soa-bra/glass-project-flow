"use client";
import React, { useState } from "react";
import ParticipantsTab from "./ParticipantsTab";
import ChatTab from "./ChatTab";
import AudioTab from "./AudioTab";
import { useCollaboration } from "@/features/planning/hooks/useCollaboration";

const CollaborationPanel: React.FC = () => {
  const { open, toggleOpen } = useCollaboration();
  const [tab, setTab] = useState<"participants"|"chat"|"audio">("participants");

  return (
    <>
      <button
        onClick={toggleOpen}
        title="Collaboration"
        className="fixed right-3 top-20 z-40 shadow px-3 py-2 rounded border bg-white hover:bg-gray-50"
        aria-pressed={open}
      >
        👥
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Collaboration Panel"
          className="fixed right-3 top-36 z-40 w-[360px] max-h-[70vh] border rounded bg-white shadow flex flex-col overflow-hidden"
        >
          <div className="border-b bg-gray-50 p-2 flex items-center gap-2">
            <button className={btn(tab==="participants")} onClick={()=>setTab("participants")}>Participants</button>
            <button className={btn(tab==="chat")} onClick={()=>setTab("chat")}>Chat</button>
            <button className={btn(tab==="audio")} onClick={()=>setTab("audio")}>Audio</button>
            <span className="flex-1" />
            <InviteButton />
          </div>

          <div className="flex-1 overflow-auto">
            {tab==="participants" && <ParticipantsTab />}
            {tab==="chat" && <ChatTab />}
            {tab==="audio" && <AudioTab />}
          </div>
        </div>
      )}
    </>
  );
};

const btn = (active:boolean) =>
  `px-2 py-1 text-sm border rounded ${active ? "bg-white border-blue-300 text-blue-700" : "bg-white hover:bg-gray-100"}`;

const InviteButton: React.FC = () => {
  const { generateInvite, lastInvite } = useCollaboration();
  const [copied, setCopied] = React.useState(false);
  const onClick = async () => {
    const url = await generateInvite();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(()=>setCopied(false), 1200);
  };
  return (
    <button className="px-2 py-1 text-sm border rounded bg-white hover:bg-gray-50" onClick={onClick}>
      {copied ? "✅ Copied" : "🔗 Invite"}
    </button>
  );
};

export default CollaborationPanel;
