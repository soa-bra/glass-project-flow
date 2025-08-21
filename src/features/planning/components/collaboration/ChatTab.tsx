"use client";
import React from "react";
import { useCollaboration } from "@/src/features/planning/hooks/useCollaboration";

const ParticipantsTab: React.FC = () => {
  const { participants, me, setRole, kick, roles } = useCollaboration();

  return (
    <div className="p-2 space-y-2">
      <div className="text-xs text-gray-500">Roles: Owner / Editor / Commenter / Viewer</div>
      <ul className="space-y-2">
        {Object.values(participants).map((p:any)=>(
          <li key={p.id} className="border rounded p-2 flex items-center gap-2">
            <Avatar color={p.color} />
            <div className="flex-1">
              <div className="text-sm font-medium">{p.name}{p.id===me?.id ? " (You)" : ""}</div>
              <div className="text-[11px] text-gray-500">{p.email ?? "guest@session"}</div>
            </div>
            <select
              className="text-sm border rounded px-2 py-1"
              value={p.role ?? "Viewer"}
              onChange={(e)=>setRole(p.id, e.target.value as any)}
              disabled={roles.canManage ? false : true}
            >
              <option>Owner</option>
              <option>Editor</option>
              <option>Commenter</option>
              <option>Viewer</option>
            </select>
            {roles.canManage && p.id!==me?.id && (
              <button className="ml-2 text-red-600 text-sm" onClick={()=>kick(p.id)} title="Remove">✖</button>
            )}
          </li>
        ))}
        {Object.values(participants).length===0 && <li className="text-xs text-gray-500">لا يوجد مشاركون.</li>}
      </ul>
    </div>
  );
};

const Avatar: React.FC<{ color?: string }> = ({ color="#0ea5e9" }) => (
  <div className="w-8 h-8 rounded-full grid place-items-center text-white text-sm" style={{ background: color }}>
    👤
  </div>
);

export default ParticipantsTab;
