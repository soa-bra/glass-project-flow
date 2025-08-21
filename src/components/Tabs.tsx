// src/components/Tabs.tsx
'use client';
import React from 'react';
export function Tabs({tabs}:{tabs:{id:string;label:string;content:React.ReactNode}[]}) {
  const [id, setId] = React.useState(tabs[0]?.id);
  const active = tabs.find(t=>t.id===id);
  return (
    <div>
      <div style={{display:'flex', gap:6}}>
        {tabs.map(t=> <button key={t.id} className={t.id===id?'active':''} onClick={()=>setId(t.id)}>{t.label}</button>)}
      </div>
      <div style={{marginTop:8}}>{active?.content}</div>
    </div>
  );
}
