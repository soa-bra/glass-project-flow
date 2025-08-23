import React from "react";
export default function SmartElementsPanel() {
  return (
    <div>
      <div style={{ fontWeight:600, marginBottom:8 }}>العناصر الذكية</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(6, minmax(120px,1fr))", gap:8, marginBottom:12 }}>
        {["Think Board","Kanban","Voting","Brainstorm","Timeline","Decision Matrix","Root Linker","Gantt","Spreadsheet","Mindmap","Project Cards","Finance","CSR","CRM","Cultural Fit","Content Planner","Campaigns","CSR Impact"].map((n)=> (
          <button key={n} style={{ height:64 }}>{n}</button>
        ))}
      </div>
      <div style={{ border:"1px solid #e5e7eb", borderRadius:8, padding:8 }}>
        <div style={{ fontSize:12, opacity:0.7, marginBottom:6 }}>إعدادات العنصر المحدد</div>
        <div>— تتغير هنا بحسب العنصر —</div>
      </div>
    </div>
  );
}
