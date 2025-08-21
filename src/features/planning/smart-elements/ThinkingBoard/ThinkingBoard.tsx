import React, { useState } from "react";

type Idea = { id:string; text:string; color?:string };
type Props = { id:string; onChange?:(ideas:Idea[])=>void; initial?:Idea[] };

export function ThinkingBoard({ initial=[], onChange }:Props){
  const [ideas, setIdeas] = useState<Idea[]>(initial);
  function add(){
    const ni = { id: crypto.randomUUID(), text:"فكرة جديدة", color:"#FFD86B" };
    const arr = [...ideas, ni]; setIdeas(arr); onChange?.(arr);
  }
  function update(id:string, text:string){
    const arr = ideas.map(i => i.id===id ? { ...i, text } : i);
    setIdeas(arr); onChange?.(arr);
  }
  return (
    <div className="rounded-2xl border border-slate-200 p-3 bg-white w-[560px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Thinking Board</h3>
        <button onClick={add} className="px-2 py-1 text-sm rounded bg-slate-900 text-white">+ إضافة</button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {ideas.map(i=>(
          <textarea key={i.id} value={i.text} onChange={e=>update(i.id, e.target.value)}
            className="min-h-[80px] rounded-lg border p-2 text-sm"
            style={{ background:i.color ?? "#fff7cc" }}/>
        ))}
      </div>
    </div>
  );
}
