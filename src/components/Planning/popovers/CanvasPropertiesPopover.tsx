import React from "react";
import type { CanvasElementModel } from "./canvas-elements";

type Props = {
  element: CanvasElementModel;
  screenX: number;
  screenY: number;
  onChange: (patch: Partial<CanvasElementModel>) => void;
  onClose: () => void;
};

export default function CanvasPropertiesPopover({ element, screenX, screenY, onChange, onClose }: Props) {
  return (
    <div
      className="fixed z-50 bg-white border rounded-xl shadow-lg p-3 w-[240px]"
      style={{ left: screenX, top: screenY }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-sm">خصائص العنصر</div>
        <button
          className="w-8 h-8 border rounded-lg hover:bg-neutral-50"
          onClick={onClose}
          aria-label="Close"
          title="Close"
        >
          ✕
        </button>
      </div>

      <label className="block text-xs text-neutral-600 mb-1">الاسم</label>
      <input
        className="w-full border rounded-lg px-2 py-1 text-sm"
        value={element.name ?? ""}
        onChange={(e) => onChange({ name: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-2 mt-3">
        <Field label="العرض" value={element.w} onChange={(v) => onChange({ w: v })} />
        <Field label="الارتفاع" value={element.h} onChange={(v) => onChange({ h: v })} />
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <Field label="X" value={element.x} onChange={(v) => onChange({ x: v })} />
        <Field label="Y" value={element.y} onChange={(v) => onChange({ y: v })} />
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <Field label="Rotate" value={element.rotation ?? 0} onChange={(v) => onChange({ rotation: v })} />
        <Field
          label="Opacity"
          value={Math.round((element.style?.opacity ?? 1) * 100)}
          onChange={(v) => onChange({ style: { opacity: Math.max(0, Math.min(1, v / 100)) } as any })}
        />
      </div>

      <div className="flex gap-2 mt-3">
        <button className="flex-1 px-3 py-2 text-sm border rounded-lg hover:bg-neutral-50" onClick={onClose}>
          إغلاق
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="block text-xs text-neutral-600 mb-1">{label}</label>
      <input
        type="number"
        className="w-full border rounded-lg px-2 py-1 text-sm"
        value={Number.isFinite(value) ? Math.round(value) : 0}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
