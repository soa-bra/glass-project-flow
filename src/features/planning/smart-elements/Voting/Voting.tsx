import React, { useMemo, useState } from "react";
type Option = { id:string; label:string; votes:number };
type Props = { options?:string[]; maxVotesPerUser?:number; onEnd?:(summary:Option[])=>void };

export function Voting({ options=["A","B","C"], maxVotesPerUser=3, onEnd }:Props){
  const [opts, setOpts] = useState<Option[]>(options.map(o=>({ id:crypto.randomUUID(), label:o, votes:0 })));
  const [spent, setSpent] = useState(0);
  const left = useMemo(()=> Math.max(0, maxVotesPerUser - spent), [maxVotesPerUser, spent]);

  function vote(id:string){
    if (left<=0) return;
    const next = opts.map(o => o.id===id ? { ...o, votes:o.votes+1 } : o);
    setOpts(next); setSpent(sp => sp+1);
  }
  return (
    <div className="border rounded-xl bg-white w-[360px]">
      <div className="px-3 py-2 border-b flex items-center justify-between">
        <span className="font-medium">Voting</span>
        <span className="text-xs text-slate-500">المتبقي: {left}</span>
      </div>
      <div className="p-3 space-y-2">
        {opts.map(o=>(
          <div key={o.id} className="flex items-center justify-between border rounded-lg px-3 py-2">
            <span>{o.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{o.votes}</span>
              <button disabled={left<=0} onClick={()=>vote(o.id)} className="text-xs px-2 py-1 rounded bg-slate-900 text-white disabled:opacity-50">صوّت</button>
            </div>
          </div>
        ))}
      </div>
      <div className="px-3 py-2 border-t text-right">
        <button onClick={()=>onEnd?.(opts)} className="text-xs px-3 py-1 rounded bg-emerald-600 text-white">إنهاء</button>
      </div>
    </div>
  );
}
