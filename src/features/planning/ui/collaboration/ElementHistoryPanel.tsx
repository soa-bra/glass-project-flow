/**
 * ElementHistoryPanel — RTL list of "who/when/what" changes for a single
 * planning element. Powered by `useElementHistory`.
 *
 * UX:
 * - Header with refresh button + count.
 * - Each entry shows the actor (avatar/initial), relative timestamp, the
 *   action badge, and a per-field diff list (label · old → new).
 * - Renders nothing if no element is selected.
 */
import { memo, useMemo } from "react";
import { History, RefreshCw, Loader2, Plus, Trash2, Edit3 } from "lucide-react";
import { useCollaborationStore } from "@/stores/collaborationStore";
import { useElementHistory } from "../../hooks/useElementHistory";
import type { PlanningElementHistoryEntry } from "@/services/central/planningBoards.service";

interface ElementHistoryPanelProps {
  elementId: string | null;
}

const FIELD_LABELS_AR: Record<string, string> = {
  position: "الموقع",
  size: "الحجم",
  rotation: "الدوران",
  z_index: "الترتيب",
  content: "المحتوى",
  style: "النمط",
  metadata: "البيانات",
  element_type: "النوع",
  locked_by: "المُقفِل",
  locked_at: "تاريخ القفل",
  schema_version: "الإصدار",
};

function formatRelative(iso: string): string {
  const diff = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (diff < 60) return `قبل ${diff} ث`;
  const m = Math.floor(diff / 60);
  if (m < 60) return `قبل ${m} د`;
  const h = Math.floor(m / 60);
  if (h < 24) return `قبل ${h} س`;
  const d = Math.floor(h / 24);
  if (d < 7) return `قبل ${d} يوم`;
  return new Date(iso).toLocaleDateString("ar-SA");
}

function summarizeValue(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "number") return Number.isInteger(v) ? `${v}` : v.toFixed(2);
  if (typeof v === "string") return v.length > 32 ? `${v.slice(0, 32)}…` : v;
  if (typeof v === "boolean") return v ? "نعم" : "لا";
  if (typeof v === "object") {
    const obj = v as Record<string, unknown>;
    if ("x" in obj && "y" in obj) return `(${Math.round(Number(obj.x))}, ${Math.round(Number(obj.y))})`;
    if ("width" in obj && "height" in obj) return `${Math.round(Number(obj.width))}×${Math.round(Number(obj.height))}`;
    try {
      const s = JSON.stringify(v);
      return s.length > 40 ? `${s.slice(0, 40)}…` : s;
    } catch {
      return "[object]";
    }
  }
  return String(v);
}

const ACTION_META: Record<
  PlanningElementHistoryEntry["action"],
  { label: string; icon: typeof Plus; dot: string }
> = {
  insert: { label: "إنشاء", icon: Plus, dot: "bg-emerald-500" },
  update: { label: "تعديل", icon: Edit3, dot: "bg-amber-500" },
  delete: { label: "حذف", icon: Trash2, dot: "bg-red-500" },
};

const HistoryEntryRow = memo(function HistoryEntryRow({
  entry,
  actorName,
  actorColor,
}: {
  entry: PlanningElementHistoryEntry;
  actorName: string;
  actorColor: string;
}) {
  const meta = ACTION_META[entry.action];
  const Icon = meta.icon;
  const fields = Object.keys(entry.changed_fields);

  return (
    <li className="rounded-2xl border border-[hsl(var(--border))] bg-white p-3 space-y-2">
      <div className="flex items-center gap-2">
        <span
          className="h-6 w-6 rounded-full grid place-items-center text-[10px] font-semibold text-white shrink-0"
          style={{ background: actorColor }}
          aria-hidden
        >
          {actorName.charAt(0).toUpperCase()}
        </span>
        <span className="text-[12px] font-semibold text-[hsl(var(--ink))] truncate">
          {actorName}
        </span>
        <span className={`ms-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-white ${meta.dot}`}>
          <Icon size={10} />
          {meta.label}
        </span>
      </div>
      <div className="flex items-center justify-between text-[11px] text-[hsl(var(--ink-60))]">
        <span>{formatRelative(entry.created_at)}</span>
        <span>{new Date(entry.created_at).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
      {entry.action === "update" && fields.length > 0 && (
        <ul className="space-y-1 pt-1 border-t border-[hsl(var(--border))]/60">
          {fields.map((f) => {
            const diff = entry.changed_fields[f];
            return (
              <li key={f} className="text-[11px] text-[hsl(var(--ink))] flex flex-wrap items-center gap-1">
                <span className="font-medium">{FIELD_LABELS_AR[f] ?? f}</span>
                <span className="text-[hsl(var(--ink-60))]">·</span>
                <span className="text-[hsl(var(--ink-60))] line-through">{summarizeValue(diff?.old)}</span>
                <span className="text-[hsl(var(--ink-60))]">←</span>
                <span className="font-medium">{summarizeValue(diff?.new)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
});

export const ElementHistoryPanel = memo(function ElementHistoryPanel({
  elementId,
}: ElementHistoryPanelProps) {
  const { entries, isLoading, error, refresh } = useElementHistory(elementId);
  const participants = useCollaborationStore((s) => s.participants);

  const actorIndex = useMemo(() => {
    const map = new Map<string, { name: string; color: string }>();
    participants.forEach((p) => {
      map.set(p.id, { name: p.name ?? "مستخدم", color: p.color ?? "hsl(var(--accent-blue))" });
    });
    return map;
  }, [participants]);

  if (!elementId) return null;

  return (
    <section dir="rtl" className="space-y-3 pt-4 border-t border-[hsl(var(--border))]">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History size={14} className="text-[hsl(var(--ink-60))]" />
          <h4 className="text-[13px] font-semibold text-[hsl(var(--ink))]">
            سجل التغييرات
          </h4>
          <span className="text-[11px] text-[hsl(var(--ink-60))]">
            ({entries.length})
          </span>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          className="p-1.5 rounded-full hover:bg-[hsl(var(--sb-panel-bg))] transition-colors"
          aria-label="تحديث السجل"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 size={14} className="animate-spin text-[hsl(var(--ink-60))]" />
          ) : (
            <RefreshCw size={14} className="text-[hsl(var(--ink-60))]" />
          )}
        </button>
      </header>

      {error && (
        <div className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          تعذّر تحميل السجل: {error.message}
        </div>
      )}

      {!error && entries.length === 0 && !isLoading && (
        <div className="text-[12px] text-[hsl(var(--ink-60))] text-center py-4">
          لا توجد تغييرات مسجّلة بعد لهذا العنصر.
        </div>
      )}

      <ul className="space-y-2 max-h-[360px] overflow-y-auto pe-1">
        {entries.map((entry) => {
          const actor = entry.actor_id ? actorIndex.get(entry.actor_id) : null;
          return (
            <HistoryEntryRow
              key={entry.id}
              entry={entry}
              actorName={actor?.name ?? (entry.actor_id ? "مستخدم آخر" : "النظام")}
              actorColor={actor?.color ?? "hsl(var(--accent-blue))"}
            />
          );
        })}
      </ul>
    </section>
  );
});
