import React from "react";
type Item = { id:string; title:string; progress:number };
type Props = { items:Item[] };

export function CsrWidget({ items }:Props){
  return (
    <div className="rounded-xl border p-3 bg-white w-[360px]">
      <div className="font-semibold mb-2">CSR</div>
      <div className="space-y-3">
        {items.map(i=>(
          <div key={i.id}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span>{i.title}</span><span className="text-slate-500">{i.progress}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded">
              <div className="h-2 bg-sky-500 rounded" style={{ width:`${i.progress}%` }}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
