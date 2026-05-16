/**
 * RealtimeStatusBadge — shows the live Supabase Realtime connection state
 * and the time since the last sync event for a planning board.
 *
 * RTL-first, uses semantic tokens. Updates the "last sync" label every
 * 15 seconds so the relative time stays accurate without re-rendering
 * the entire dashboard.
 */
import { memo, useEffect, useState } from "react";
import { Wifi, WifiOff, Loader2, AlertTriangle } from "lucide-react";
import type { RealtimeConnectionStatus } from "../../hooks/usePlanningRealtime";

interface RealtimeStatusBadgeProps {
  status: RealtimeConnectionStatus;
  lastSyncAt: number | null;
}

function formatRelative(ts: number | null, now: number): string {
  if (!ts) return "لم تتم المزامنة بعد";
  const diff = Math.max(0, Math.floor((now - ts) / 1000));
  if (diff < 5) return "محدّث الآن";
  if (diff < 60) return `قبل ${diff} ث`;
  const m = Math.floor(diff / 60);
  if (m < 60) return `قبل ${m} د`;
  const h = Math.floor(m / 60);
  if (h < 24) return `قبل ${h} س`;
  return new Date(ts).toLocaleTimeString("ar-SA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_META: Record<
  RealtimeConnectionStatus,
  { label: string; dotClass: string; icon: typeof Wifi }
> = {
  idle: { label: "غير متصل", dotClass: "bg-sb-ink/30", icon: WifiOff },
  connecting: {
    label: "جارٍ الاتصال",
    dotClass: "bg-sb-accent-yellow animate-pulse",
    icon: Loader2,
  },
  connected: {
    label: "متصل مباشر",
    dotClass: "bg-sb-accent-green",
    icon: Wifi,
  },
  disconnected: {
    label: "انقطع الاتصال",
    dotClass: "bg-sb-ink/40",
    icon: WifiOff,
  },
  error: {
    label: "خطأ في الاتصال",
    dotClass: "bg-sb-accent-red",
    icon: AlertTriangle,
  },
};

export const RealtimeStatusBadge = memo(function RealtimeStatusBadge({
  status,
  lastSyncAt,
}: RealtimeStatusBadgeProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  const meta = STATUS_META[status];
  const Icon = meta.icon;
  const relative = formatRelative(lastSyncAt, now);
  const absolute = lastSyncAt
    ? new Date(lastSyncAt).toLocaleTimeString("ar-SA", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "—";

  return (
    <div
      dir="rtl"
      role="status"
      aria-live="polite"
      title={`${meta.label} · آخر مزامنة: ${absolute}`}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sb-panel-bg border border-sb-border"
    >
      <span className="relative flex items-center justify-center">
        <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} />
      </span>
      <Icon
        size={14}
        className={`text-sb-ink/70 ${status === "connecting" ? "animate-spin" : ""}`}
        aria-hidden
      />
      <span className="text-[12px] font-semibold text-sb-ink">{meta.label}</span>
      <span className="text-[11px] text-sb-ink/60">·</span>
      <span className="text-[11px] text-sb-ink/70">{relative}</span>
    </div>
  );
});
