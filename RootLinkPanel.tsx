import React from "react";

export default function RootLinkPanel() {
  return (
    <div>
      <div style={{ fontWeight:600, marginBottom:8 }}>الربط الجذري</div>
      <div style={{ display:"grid", gap:8 }}>
        <textarea placeholder="وصف العلاقة..." style={{ width:"100%", minHeight:60, padding:8, border:"1px solid #e5e7eb", borderRadius:8 }} />
        <button>إنشاء ارتباط</button>
      </div>
    </div>
  );
}
