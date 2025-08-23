import React from "react";
export default function PanPanel() {
  return (
    <div>
      <div style={{ fontWeight:600, marginBottom:8 }}>تحريك العرض</div>
      <div style={{ marginBottom:8 }}>الإحداثيات الحالية: x:0, y:0</div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
        <label>سرعة التحريك</label><input type="range" min={1} max={5} defaultValue={2} />
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <button>توسيط الكانفاس</button>
        <button>إعادة التعيين</button>
      </div>
    </div>
  );
}
