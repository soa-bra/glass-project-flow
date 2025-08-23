import React from "react";
export default function ShapesPanel() {
  return (
    <div>
      <div style={{ fontWeight:600, marginBottom:8 }}>الأشكال</div>
      <div style={{ display:"flex", gap:12, marginBottom:8 }}>
        <button>أساسية</button><button>فنية</button><button>أيقونات</button><button>Sticky</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(6, 1fr)", gap:8, marginBottom:12 }}>
        {["▢","◯","△","⬟","⬢","◇","⬤","⬛","⬜","⭐","⬈","⬋"].map((s,i)=>(
          <button key={i} style={{ height:48 }}>{s}</button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"140px 1fr", gap:8, alignItems:"center" }}>
        <label>لون</label><input type="color" defaultValue="#f28e2a" />
        <label>حواف</label><input type="color" defaultValue="#000000" />
        <label>السمك</label><input type="range" min={0} max={12} defaultValue={1} />
        <label>الشفافية</label><input type="range" min={0} max={1} step={0.05} defaultValue={1} />
      </div>
    </div>
  );
}
