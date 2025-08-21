import React, { useState } from "react";
type Idea = { id:string; text:string; author?:string };
type Props = { onCluster?:(clusters:{ label:string; items:Idea[] }[])=>void };

export function Brainstorming({ onCluster }:Props){
  const [ideas, setIdeas] = useState<Idea[]>([]);
  function add(){
    const ni = { id:crypto.randomUUID(), text:"", author:"me" };
    setIdeas(a=>[...a, ni]);
  }
  function cluster(){
    // تبسيط: تجميع بالحرف الأول
    const map = new Map<string, Idea[]>();
    ideas.forEach(i=>{
      const k = (i.text?.[0] ?? "#").toUpperCase();
      map.set(k, [...(map.get(k)??[]), i]);
    });
    onCluster?.(Array.from(map.entries()).map(([label, items])=>({ label, items })));
  }
  return (
    <div className="w-[520px] border rounded-xl p-3 bg-white">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">Brainstorming</div>
        <div className="space-x-2">
          <button onClick={add} className="text-xs px-2 py-1 bg-slate-900 text-white rounded">+ فكرة</button>
          <button onClick={cluster} className="text-xs px-2 py-1 bg-sky-600 text-white rounded">تجميع</button>
        </div>
      </div>
      <div className="space-y-2">
        {ideas.map(i=>(
          <input key={i.id} className="w-full border rounded-lg px-3 py-2"
            placeholder="اكتب فكرة…" value={i.text} onChange={e=>{
              setIdeas(arr => arr.map(x => x.id===i.id ? { ...x, text:e.target.value } : x));
            }}/>
        ))}
      </div>
    </div>
  );
}
