/**
 * EngineJobsDashboard — لوحة مراقبة المحركات (P5).
 * تستخدم Realtime عبر useEngineJobsRealtime + React Query (useEngineJobs).
 * تعرض حالة كل Job مع badge لوني وعدّاد لكل state.
 */
import React, { useMemo } from "react";
import { useEngineJobs, useEngineJobsRealtime } from "@/hooks/central";
import { AppCardSurface } from "@/components/shared/surfaces/AppCardSurface";
import { BaseBadge } from "@/components/ui/BaseBadge";
import { Loader2, Cpu, CheckCircle2, AlertTriangle, Clock, Pause, XCircle } from "lucide-react";
import type { CentralState } from "@/types/central";

const STATE_META: Record<CentralState, { label: string; tone: string; icon: React.ElementType }> = {
  draft:     { label: "مسودّة",   tone: "bg-muted text-muted-foreground",            icon: Clock },
  planned:   { label: "مُجدوَل",   tone: "bg-blue-100 text-blue-800",                  icon: Clock },
  active:    { label: "نشِط",      tone: "bg-emerald-100 text-emerald-800",            icon: Cpu },
  blocked:   { label: "محجوب",    tone: "bg-amber-100 text-amber-800",                icon: AlertTriangle },
  paused:    { label: "متوقّف",    tone: "bg-slate-100 text-slate-700",                icon: Pause },
  completed: { label: "مكتمل",    tone: "bg-emerald-200 text-emerald-900",            icon: CheckCircle2 },
  cancelled: { label: "ملغى",     tone: "bg-rose-100 text-rose-800",                  icon: XCircle },
  archived:  { label: "مؤرشَف",   tone: "bg-zinc-100 text-zinc-700",                  icon: Clock },
  failed:    { label: "فاشل",     tone: "bg-red-100 text-red-800",                    icon: AlertTriangle },
};

export const EngineJobsDashboard: React.FC = () => {
  useEngineJobsRealtime();
  const { data: jobs = [], isLoading, error } = useEngineJobs();

  const counts = useMemo(() => {
    const c: Partial<Record<CentralState, number>> = {};
    jobs.forEach((j) => { c[j.state] = (c[j.state] ?? 0) + 1; });
    return c;
  }, [jobs]);

  const summaryStates: CentralState[] = ["planned", "active", "completed", "failed"];

  return (
    <div className="flex flex-col gap-4" dir="rtl">
      <header className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center border border-border">
          <Cpu className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">لوحة المحركات</h2>
          <p className="text-sm text-muted-foreground">
            مراقبة حية لمهام المحركات عبر Realtime · {jobs.length} مهمّة
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {summaryStates.map((s) => {
          const meta = STATE_META[s];
          const Icon = meta.icon;
          return (
            <AppCardSurface key={s} className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${meta.tone}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{counts[s] ?? 0}</div>
                <div className="text-xs text-muted-foreground">{meta.label}</div>
              </div>
            </AppCardSurface>
          );
        })}
      </div>

      <AppCardSurface className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="p-6 text-sm text-red-600">تعذّر جلب المحركات: {String(error)}</div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            لا توجد مهام محركات بعد.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {jobs.map((j) => {
              const meta = STATE_META[j.state];
              return (
                <div key={j.id} className="flex items-center justify-between p-4 hover:bg-muted/30">
                  <div className="flex items-center gap-3 min-w-0">
                    <BaseBadge className={meta.tone}>{meta.label}</BaseBadge>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{j.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {j.kind} · {new Date(j.updated_at).toLocaleString("ar")}
                      </div>
                    </div>
                  </div>
                  <BaseBadge variant="secondary">{j.priority}</BaseBadge>
                </div>
              );
            })}
          </div>
        )}
      </AppCardSurface>
    </div>
  );
};
