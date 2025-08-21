import React from "react";

type Props = { kpis:{ label:string; value:number; delta?:number }[] };

export function FinanceWidget({ kpis }:Props){
  return (
    <div className="rounded-xl border p-3 bg-white w-[360px]">
      <div className="font-semibold mb-2">Finance</div>
      <div className="space-y-2">
        {kpis.map((k,i)=>(
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-slate-600">{k.label}</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{k.value.toLocaleString()}</span>
              {k.delta!==undefined && (
                <span className={k.delta>=0 ? "text-emerald-600" : "text-rose-600"}>
                  {k.delta>=0 ? "▲" : "▼"} {Math.abs(k.delta)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
