import React, { useState } from "react";
export default function ZoomPanel() {
  const [v, setV] = useState(100);
  const setPct = (n: number)=>setV(n);
  return (
    <div>
      <div style={{ fontWeight:600, marginBottom:8 }}>الزوم</div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
        <input type="range" min={10} max={500} value={v} onChange={(e)=>setV(parseInt(e.target.value,10))} />
        <span>{v}%</span>
        <button onClick={()=>setPct(Math.min(v+10,500))}>+</button>
        <button onClick={()=>setPct(Math.max(v-10,10))}>-</button>
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {[10,25,50,100,200,500].map(n => <button key={n} onClick={()=>setPct(n)}>{n}%</button>)}
      </div>
      <div style={{ marginTop:8, display:"flex", gap:8 }}>
        <button>ملائمة الشاشة</button>
        <button>الحجم الفعلي</button>
        <button>إعادة التعيين</button>
      </div>
    </div>
  );
}
