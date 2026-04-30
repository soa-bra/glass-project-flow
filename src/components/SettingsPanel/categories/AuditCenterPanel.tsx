/**
 * Audit Center — لوحة عرض آخر 100 حدث تدقيق + فلترة (P4).
 * متاحة فقط للمالكين عبر RLS على `audit_events`.
 */
import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuditService } from "@/services/central/audit.service";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BaseBadge } from "@/components/ui/BaseBadge";
import { Loader2, Shield } from "lucide-react";
import { format } from "date-fns";

const RESOURCE_TYPES = ["all", "project", "task", "tool", "engine_job", "user", "board"];

export const AuditCenterPanel: React.FC = () => {
  const [resourceType, setResourceType] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["audit_events", resourceType, actionFilter],
    queryFn: () =>
      AuditService.query({
        limit: 100,
        resource_type: resourceType === "all" ? undefined : resourceType,
        action: actionFilter || undefined,
      }),
    refetchInterval: 30_000,
  });

  const filtered = useMemo(() => data ?? [], [data]);

  return (
    <div className="flex flex-col h-full p-6 gap-4 overflow-hidden" dir="rtl">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center border border-border">
            <Shield className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">مركز التدقيق</h2>
            <p className="text-sm text-muted-foreground">آخر 100 حدث — يُحدَّث كل 30 ثانية</p>
          </div>
        </div>
        <BaseBadge variant="secondary">{filtered.length} حدث</BaseBadge>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Select value={resourceType} onValueChange={setResourceType}>
          <SelectTrigger>
            <SelectValue placeholder="نوع المورد" />
          </SelectTrigger>
          <SelectContent>
            {RESOURCE_TYPES.map((rt) => (
              <SelectItem key={rt} value={rt}>
                {rt === "all" ? "كل الأنواع" : rt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="فلترة بالإجراء (مثل: project.created)"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
        />

        <button
          onClick={() => refetch()}
          className="rounded-2xl border border-border bg-background hover:bg-muted px-4 py-2 text-sm font-medium"
        >
          تحديث
        </button>
      </div>

      <div className="flex-1 overflow-auto rounded-2xl border border-border bg-background">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="p-6 text-sm text-destructive">
            تعذّر تحميل الأحداث (يتطلّب صلاحية Owner). {(error as Error).message}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground text-center">لا توجد أحداث.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-muted/50 backdrop-blur">
              <tr className="text-start">
                <th className="p-3 font-medium text-foreground text-start">الوقت</th>
                <th className="p-3 font-medium text-foreground text-start">الإجراء</th>
                <th className="p-3 font-medium text-foreground text-start">المورد</th>
                <th className="p-3 font-medium text-foreground text-start">القرار</th>
                <th className="p-3 font-medium text-foreground text-start">الفاعل</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ev) => (
                <tr key={ev.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-3 text-muted-foreground tabular-nums">
                    {format(new Date(ev.created_at), "yyyy-MM-dd HH:mm:ss")}
                  </td>
                  <td className="p-3 text-foreground font-medium">{ev.action}</td>
                  <td className="p-3 text-muted-foreground">
                    {ev.resource_type}
                    {ev.resource_id ? ` · ${ev.resource_id.slice(0, 8)}` : ""}
                  </td>
                  <td className="p-3">
                    <BaseBadge variant={ev.decision === "allowed" ? "success" : "error"}>
                      {ev.decision}
                    </BaseBadge>
                  </td>
                  <td className="p-3 text-muted-foreground tabular-nums">
                    {ev.actor_id ? ev.actor_id.slice(0, 8) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AuditCenterPanel;
