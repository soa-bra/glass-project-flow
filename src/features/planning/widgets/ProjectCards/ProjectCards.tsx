import React from "react";
type Project = { id:string; name:string; status:"ontrack"|"atrisk"|"offtrack"; owner?:string };
type Props = { projects:Project[] };

export function ProjectCards({ projects }:Props){
  const color = (s:Project["status"])=> s==="ontrack" ? "bg-emerald-100 text-emerald-700"
    : s==="atrisk" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700";
  return (
    <div className="grid grid-cols-3 gap-3">
      {projects.map(p=>(
        <div key={p.id} className="rounded-xl border p-3 bg-white">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{p.name}</h4>
            <span className={`text-xs px-2 py-0.5 rounded-full ${color(p.status)}`}>{p.status}</span>
          </div>
          <div className="text-xs text-slate-500 mt-2">Owner: {p.owner ?? "-"}</div>
        </div>
      ))}
    </div>
  );
}
