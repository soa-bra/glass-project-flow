import React, { useState } from "react";

type Card = { id:string; title:string; desc?:string };
type Column = { id:string; name:string; cards:Card[] };
type Props = { initial?:Column[]; onChange?:(cols:Column[])=>void };

const DEFAULT:Column[] = [
  { id:"todo", name:"To do", cards:[] },
  { id:"doing", name:"Doing", cards:[] },
  { id:"done", name:"Done", cards:[] },
];

export function KanbanBoard({ initial=DEFAULT, onChange }:Props){
  const [cols, setCols] = useState<Column[]>(initial);

  function addCard(cid:string){
    const card:Card = { id:crypto.randomUUID(), title:"مهمة جديدة" };
    const next = cols.map(c => c.id===cid ? { ...c, cards:[...c.cards, card] } : c);
    setCols(next); onChange?.(next);
  }

  return (
    <div className="flex gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
      {cols.map(c=>(
        <div key={c.id} className="w-64 rounded-xl bg-white border shadow-sm">
          <div className="px-3 py-2 flex items-center justify-between border-b">
            <span className="font-medium">{c.name}</span>
            <button onClick={()=>addCard(c.id)} className="text-xs px-2 py-1 bg-slate-900 text-white rounded">+ بطاقة</button>
          </div>
          <div className="p-2 space-y-2">
            {c.cards.map(card=>(
              <div key={card.id} className="p-2 rounded-lg border bg-white">
                <input className="w-full font-medium outline-none" value={card.title}
                  onChange={e=>{
                    const next = cols.map(cc => cc.id!==c.id ? cc : {
                      ...cc, cards: cc.cards.map(cd => cd.id===card.id ? { ...cd, title:e.target.value } : cd)
                    });
                    setCols(next); onChange?.(next);
                  }}/>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
