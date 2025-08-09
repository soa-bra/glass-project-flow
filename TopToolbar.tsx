import React, { useEffect } from "react";
import { useTooling } from "./ToolState";
import type { GridSettings } from "./panels";

type Props = {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  onNew?: () => void;
  onSave?: () => void;
  onExport?: () => void;
  onOpen?: () => void;
  onDuplicate?: () => void;
  onGenerateProject?: () => Promise<void> | void;
};

export default function TopToolbar(p: Props) {
  const { grid, setGrid, openHistoryList } = useTooling();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const editable = (e.target as HTMLElement)?.isContentEditable || ["INPUT","TEXTAREA"].includes((e.target as HTMLElement)?.tagName || "");
      if (editable) return;
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "z") p.undo();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") p.redo();
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === "h") openHistoryList();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); p.onSave?.(); }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "s") { e.preventDefault(); p.onExport?.(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") { e.preventDefault(); p.onNew?.(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "o") { e.preventDefault(); p.onOpen?.(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") { e.preventDefault(); p.onDuplicate?.(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") { e.preventDefault(); p.onGenerateProject?.(); }
    };
    window.addEventListener("keydown", onKey);
    return ()=>window.removeEventListener("keydown", onKey);
  }, [p, openHistoryList]);

  const setGridPatch = (patch: Partial<GridSettings>) => setGrid({ ...grid, ...patch });

  return (
    <div style={{ position:"absolute", top:8, left:"50%", transform:"translateX(-50%)", background:"#ffffffd9", backdropFilter:"blur(8px)", border:"1px solid #e5e7eb", borderRadius:12, padding:8, display:"flex", gap:8, alignItems:"center", zIndex:10 }}>
      {/* History */}
      <button onClick={p.undo} title="Undo">↩</button>
      <button onClick={()=>window.dispatchEvent(new CustomEvent("soabra:open-history-list"))} title="History List">⟲</button>
      <button onClick={p.redo} title="Redo">↪</button>

      {/* File */}
      <div style={{ width:1, height:20, background:"#e5e7eb", marginInline:8 }} />
      <details>
        <summary style={{ cursor:"pointer" }}>📁 ملف</summary>
        <div style={{ position:"absolute", background:"#fff", border:"1px solid #e5e7eb", padding:8, borderRadius:8, marginTop:8 }}>
          <button onClick={p.onNew}>جديد</button>
          <button onClick={p.onSave}>حفظ/تصدير JSON</button>
          <button onClick={p.onExport}>تصدير PDF</button>
          <button onClick={p.onDuplicate}>إنشاء نسخة</button>
          <button onClick={p.onOpen}>فتح</button>
        </div>
      </details>

      {/* Grid */}
      <details>
        <summary style={{ cursor:"pointer" }}># شبكة</summary>
        <div style={{ position:"absolute", background:"#fff", border:"1px solid #e5e7eb", padding:8, borderRadius:8, marginTop:8, minWidth:220 }}>
          <label style={{ display:"flex", alignItems:"center", gap:8 }}>
            <input type="checkbox" checked={grid.visible} onChange={(e)=>setGridPatch({ visible: e.target.checked })} /> إظهار الشبكة
          </label>
          <label style={{ display:"flex", alignItems:"center", gap:8 }}>
            <input type="checkbox" checked={grid.snap} onChange={(e)=>setGridPatch({ snap: e.target.checked })} /> المحاذاة التلقائية
          </label>
          <div style={{ marginTop:8 }}>
            حجم:{" "}
            <select value={grid.size} onChange={(e)=>setGridPatch({ size: parseInt(e.target.value,10) as any })}>
              <option value={4}>4</option><option value={8}>8</option><option value={16}>16</option><option value={32}>32</option><option value={64}>64</option>
            </select>
          </div>
          <div style={{ marginTop:8 }}>
            الشكل:{" "}
            <select value={grid.type} onChange={(e)=>setGridPatch({ type: e.target.value as any })}>
              <option value="dots">Dots</option>
              <option value="grid">Grid</option>
              <option value="isometric">Isometric</option>
              <option value="hex">Hex</option>
            </select>
          </div>
        </div>
      </details>

      {/* AI */}
      <details>
        <summary style={{ cursor:"pointer" }}>🤖 الذكاء الاصطناعي</summary>
        <div style={{ position:"absolute", background:"#fff", border:"1px solid #e5e7eb", padding:8, borderRadius:8, marginTop:8 }}>
          <button onClick={()=>p.onGenerateProject?.()}>⚙ توليد مشروع</button>
        </div>
      </details>
    </div>
  );
}
