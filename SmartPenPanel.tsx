import React from "react";
export default function SmartPenPanel() {
  return (
    <div>
      <div style={{ fontWeight:600, marginBottom:8 }}>القلم الذكي</div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
        <label>سمك الخط</label><input type="range" min={1} max={16} defaultValue={2} />
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
        <label>لون</label><input type="color" defaultValue="#000000" />
      </div>
      <div>
        <label>نمط</label>{" "}
        <select defaultValue="solid">
          <option value="solid">متصل</option>
          <option value="dashed">متقطع</option>
          <option value="dotted">نقطي</option>
          <option value="double">مزدوج</option>
        </select>
      </div>
    </div>
  );
}
