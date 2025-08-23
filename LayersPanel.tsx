import React, { useMemo, useState } from "react";
import { useMutation, useSelf, useStorage } from "@liveblocks/react/suspense";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";

type Layer = any;

type ItemRowProps = {
  id: string;
  layer?: Layer;
  depth?: number;
  selected: boolean;
  onToggleVis: () => void;
  onToggleLock: () => void;
  onDelete: () => void;
  onSelect: () => void;
  link?: string | null;
  onLink?: (v: string) => void;
};

function Row(props: ItemRowProps) {
  const { id, depth=0, selected, onToggleVis, onToggleLock, onDelete, onSelect, link } = props;
  const name = (props.layer?.type ?? "Layer") + " • " + id.slice(0,4);
  const hidden = !!props.layer?.hidden;
  const locked = !!props.layer?.locked;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 8px", background: selected ? "#eef2ff" : "transparent", borderRadius:6, marginBottom:4, marginInlineStart: depth*12 }}>
      <span style={{ flex:1, cursor:"pointer" }} onClick={onSelect}>{name}</span>
      <button onClick={onToggleVis} title="إظهار/إخفاء">{hidden ? "🙈" : "👁"}</button>
      <button onClick={onToggleLock} title="قفل/فتح">{locked ? "🔒" : "🔓"}</button>
      <button onClick={onDelete} title="حذف">🗑</button>
      {link !== undefined && (
        <button onClick={() => {
          const v = prompt("أدخل رابطًا خارجيًا", link ?? "") || "";
          props.onLink?.(v || null as any);
        }} title="إضافة رابط خارجي">🔗</button>
      )}
    </div>
  );
}

export default function LayersPanel() {
  const me = useSelf();
  const [query, setQuery] = useState("");
  const layerIds = useStorage(root => root.layerIds?.toImmutable() ?? []) as string[];
  const layersMap = useStorage(root => (root.layers as LiveMap<string, LiveObject<Layer>>)?.toImmutable() ?? new Map<string, Layer>()) as Map<string, Layer>;
  const selection = useStorage(root => (root as any).presence?.selection ?? []) as string[];

  const setSelection = useMutation(({ setMyPresence }, ids: string[]) => {
    setMyPresence({ selection: ids }, { addToHistory: true });
  }, []);

  const toggleHidden = useMutation(({ storage }, id: string) => {
    const l = (storage.get("layers") as LiveMap<string, LiveObject<any>>).get(id);
    if (l) l.update({ hidden: !l.get("hidden") });
  }, []);

  const toggleLocked = useMutation(({ storage }, id: string) => {
    const l = (storage.get("layers") as LiveMap<string, LiveObject<any>>).get(id);
    if (l) l.update({ locked: !l.get("locked"), lockedBy: !l.get("locked") ? me.connectionId : null });
  }, [me.connectionId]);

  const deleteLayer = useMutation(({ storage }, id: string) => {
    if (!confirm("هل تريد حذف الطبقة؟")) return;
    const layers = storage.get("layers") as LiveMap<string, LiveObject<any>>;
    const ids = storage.get("layerIds") as LiveList<string>;
    layers.delete(id);
    const idx = (ids as any)._list.indexOf(id);
    if (idx > -1) (ids as any).delete(idx);
  }, []);

  const setLink = useMutation(({ storage }, id: string, v: string | null) => {
    const l = (storage.get("layers") as LiveMap<string, LiveObject<any>>).get(id);
    if (l) l.update({ link: v });
  }, []);

  const filteredIds = useMemo(() => {
    if (!query.trim()) return layerIds;
    const q = query.trim().toLowerCase();
    return layerIds.filter(id => (layersMap.get(id)?.type ?? id).toString().toLowerCase().includes(q));
  }, [layerIds, layersMap, query]);

  return (
    <div style={{ height: "35%", minHeight: 240, display: "flex", flexDirection: "column", borderTop: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb" }}>
      <div style={{ display:"flex", gap:8, padding:8, alignItems:"center" }}>
        <input placeholder="بحث" value={query} onChange={(e)=>setQuery(e.target.value)} style={{ flex:1, padding:"6px 10px", border:"1px solid #e5e7eb", borderRadius:8 }} />
        {selection.length > 1 && (
          <button title="إنشاء ملف (مجموعة)" onClick={()=>alert("Grouping placeholder. Implement folder/group logic as needed.")}>📁</button>
        )}
        {selection.length === 1 && (
          <button title="إضافة رابط خارجي" onClick={()=>{
            const id = selection[0];
            const current = layersMap.get(id)?.link ?? null;
            const v = prompt("ضع رابط خارجي", current ?? "") || "";
            setLink(id, v || null as any);
          }}>🔗</button>
        )}
        {selection.length > 0 && (
          <button title="حذف المحدد" onClick={()=>{
            if (!confirm("حذف العناصر المحددة؟")) return;
            selection.forEach(id => deleteLayer(id));
          }}>🗑</button>
        )}
      </div>
      <div style={{ flex:1, overflow:"auto", padding:8 }}>
        {filteredIds.map((id) => (
          <Row
            key={id}
            id={id}
            layer={layersMap.get(id)}
            selected={selection.includes(id)}
            onToggleVis={() => toggleHidden(id)}
            onToggleLock={() => toggleLocked(id)}
            onDelete={() => deleteLayer(id)}
            onSelect={() => setSelection([id])}
            link={layersMap.get(id)?.link ?? null}
            onLink={(v)=>setLink(id, v)}
          />
        ))}
      </div>
    </div>
  );
}
