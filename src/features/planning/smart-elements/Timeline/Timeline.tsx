import React from "react";
type Item = { id:string; label:string; start:Date; end:Date; color?:string };
type Props = { items:Item[] };

export function Timeline({ items }:Props){
  // تبسيط: محاور أسبوعية
  const min = Math.min(...items.map(i=>i.start.getTime()));
  const max = Math.max(...items.map(i=>i.end.getTime()));
  const span = max - min || 1;

  return (
    <div className="w-[720px] border rounded-xl p-3 bg-white">
      <div className="relative h-28">
        {items.map(i=>{
          const left = ((i.start.getTime()-min)/span)*100;
          const width = ((i.end.getTime()-i.start.getTime())/span)*100;
          return (
            <div key={i.id} className="absolute top-4 h-6 rounded-full text-xs text-white flex items-center px-2"
                 style={{ left:`${left}%`, width:`${width}%`, background:i.color ?? "#0ea5e9" }}>
              {i.label}
            </div>
          );
        })}
        <div className="absolute inset-x-0 bottom-2 h-px bg-slate-200"/>
      </div>
    </div>
  );
}
