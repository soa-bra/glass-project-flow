import React, { useMemo, useState } from "react";
// Use hooks from the main entry for better compatibility across environments.
import { useStorage, useSelf, useMutation } from "@liveblocks/react";
import { LiveMap, LiveObject } from "@liveblocks/client";

type Layer = any;

function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input type="color" value={value} onChange={(e)=>onChange(e.target.value)} />;
}

function hexToRGB(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : { r:0,g:0,b:0 };
}
function rgbToHex({r,g,b}:{r:number;g:number;b:number}) {
  const to = (n:number)=>n.toString(16).padStart(2,"0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

export default function AppearancePanel() {
  const selection = useStorage(root => (root as any).presence?.selection ?? []) as string[];
  const layersMap = useStorage(root => (root.layers as any)?.toImmutable?.() ?? new Map<string, any>()) as Map<string, any>;

  const selected = useMemo(() => selection.length === 1 ? layersMap.get(selection[0]) : null, [selection, layersMap]);
  const layerId = selection[0];

  const update = useMutation(({ storage }, patch: any) => {
    const l = (storage.get("layers") as LiveMap<string, LiveObject<any>>).get(layerId);
    if (l) l.update(patch);
  }, [layerId]);

  if (!selected) return <div style={{ height: "30%", minHeight: 180, display:"flex", alignItems:"center", justifyContent:"center", opacity:0.6 }}>حدّد عنصرًا لإظهار لوحة المظهر</div>;

  const fillHex = rgbToHex(selected.fill ?? { r:255,g:255,b:255 });
  const strokeHex = rgbToHex((selected.stroke?.color) ?? { r:0,g:0,b:0 });
  const borderStyle = selected.stroke?.style ?? "solid";

  return (
    <div style={{ height: "30%", minHeight: 180, padding: 12 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>المظهر</div>

      {/* اللون */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom: 8 }}>
        <label style={{ width: 120 }}>لون التعبئة</label>
        <ColorInput value={fillHex} onChange={(hex)=>update({ fill: hexToRGB(hex) })} />
        <label>الشفافية</label>
        <input type="range" min={0} max={1} step={0.05} defaultValue={selected.opacity ?? 1} onChange={(e)=>update({ opacity: parseFloat(e.target.value) })} />
      </div>

      {/* الحد */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom: 8 }}>
        <label style={{ width: 120 }}>لون الحد</label>
        <ColorInput value={strokeHex} onChange={(hex)=>update({ stroke: { ...(selected.stroke ?? {}), color: hexToRGB(hex) } })} />
        <label>السمك</label>
        <input type="range" min={0} max={16} step={1} defaultValue={selected.stroke?.width ?? 1} onChange={(e)=>update({ stroke: { ...(selected.stroke ?? {}), width: parseInt(e.target.value,10) } })} />
        <select defaultValue={borderStyle} onChange={(e)=>update({ stroke: { ...(selected.stroke ?? {}), style: e.target.value } })}>
          <option value="solid">متصل</option>
          <option value="dashed">متقطع</option>
          <option value="dotted">نقطي</option>
        </select>
      </div>

      {/* أنماط جاهزة */}
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <button onClick={()=>update({ /* example preset */ fill: { r:252,g:142,b:42 }, stroke:{ color:{r:0,g:0,b:0}, width:2, style:"solid" } })}>تطبيق نمط سـوبــرا</button>
        <button onClick={()=>window.dispatchEvent(new CustomEvent("soabra:apply-style-to-all"))}>تطبيق على الكل</button>
      </div>
    </div>
  );
}
