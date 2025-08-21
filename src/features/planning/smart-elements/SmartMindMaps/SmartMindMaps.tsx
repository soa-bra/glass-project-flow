import React, { useState } from "react";
type Node = { id:string; text:string; children?:Node[] };
type Props = { root?:Node; onChange?:(root:Node)=>void };

export function SmartMindMaps({ root:rootProp, onChange }:Props){
  const [root, setRoot] = useState<Node>(rootProp ?? { id:"root", text:"فكرة رئيسية", children:[] });

  function addChild(n:Node){
    const child = { id:crypto.randomUUID(), text:"فرع جديد", children:[] };
    n.children = [...(n.children??[]), child];
    setRoot({ ...root }); onChange?.(root);
  }
  function render(n:Node, depth=0){
    return (
      <div key={n.id} className="flex items-start gap-3">
        <div className="rounded-full px-3 py-1 bg-sky-100 text-sky-900 text-sm font-medium">{n.text}</div>
        <button className="text-xs text-white bg-sky-600 px-2 py-1 rounded" onClick={()=>addChild(n)}>+ فرع</button>
        <div className="pl-6 space-y-2">
          {(n.children??[]).map(c=>render(c, depth+1))}
        </div>
      </div>
    );
  }

  return <div className="p-3 border rounded-xl bg-white">{render(root)}</div>;
}
