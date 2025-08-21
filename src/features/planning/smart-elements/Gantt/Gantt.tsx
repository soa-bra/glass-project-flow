import React from "react";
type Task = { id:string; name:string; start:Date; end:Date; lane:number; color?:string };
type Props = { tasks:Task[] };

export function Gantt({ tasks }:Props){
  const min = Math.min(...tasks.map(t=>t.start.getTime()));
  const max = Math.max(...tasks.map(t=>t.end.getTime()));
  const span = max - min || 1;
  const lanes = Math.max(1, ...tasks.map(t=>t.lane))+1;

  return (
    <div className="w-[900px] border rounded-xl p-3 bg-white">
      <div className="relative" style={{ height: lanes*28 + 24 }}>
        {Array.from({ length:lanes }).map((_,i)=>
          <div key={i} className="absolute left-0 right-0" style={{ top: i*28+8 }}>
            <div className="h-8 border-b border-slate-100"/>
          </div>
        )}
        {tasks.map(t=>{
          const left = ((t.start.getTime()-min)/span)*100;
          const width = ((t.end.getTime()-t.start.getTime())/span)*100;
          return (
            <div key={t.id} className="absolute h-5 rounded text-[10px] text-white flex items-center px-2"
                 style={{ top: t.lane*28+10, left:`${left}%`, width:`${width}%`, background:t.color ?? "#22c55e" }}>
              {t.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
