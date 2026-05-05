/**
 * ToolsMarketplace — كتالوج بسيط للأدوات المسجّلة في central_boards.
 * يدعم البحث + الفلترة بالنوع + إنشاء أداة جديدة سريعة.
 */
import React, { useMemo, useState } from "react";
import { useBoardTools, useCreateTool, useCentralBoards } from "@/hooks/central";
import { AppCardSurface } from "@/components/shared/surfaces/AppCardSurface";
import { BaseBadge } from "@/components/ui/BaseBadge";
import { Wrench, Plus, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ToolKind } from "@/types/central";

const KIND_LABELS: Record<ToolKind, string> = {
  board_widget: "ودجِت سبورة",
  dashboard_panel: "لوحة تحكّم",
  workflow_tool: "أداة سير عمل",
  analysis_tool: "أداة تحليل",
  integration_tool: "أداة تكامل",
};

export const ToolsMarketplace: React.FC = () => {
  const { data: boards = [] } = useCentralBoards();
  const [boardFilter, setBoardFilter] = useState<string>("all");
  const [kindFilter, setKindFilter] = useState<string>("all");
  const [q, setQ] = useState("");

  const { data: allTools = [], isLoading } = useBoardTools(
    boardFilter === "all" ? undefined : boardFilter,
  );

  const createTool = useCreateTool();
  const filtered = useMemo(() => {
    return allTools.filter((t) => {
      if (kindFilter !== "all" && t.kind !== kindFilter) return false;
      if (q && !t.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [allTools, kindFilter, q]);

  const handleQuickCreate = () => {
    if (boards.length === 0) {
      alert("يجب إنشاء سبورة مركزية أولاً.");
      return;
    }
    const name = prompt("اسم الأداة الجديدة:");
    if (!name) return;
    createTool.mutate({
      central_board_id: boards[0].id,
      name,
      kind: "workflow_tool",
    });
  };

  return (
    <div className="flex flex-col gap-4" dir="rtl">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center border border-border">
            <Wrench className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">سوق الأدوات</h2>
            <p className="text-sm text-muted-foreground">{filtered.length} أداة</p>
          </div>
        </div>
        <button
          onClick={handleQuickCreate}
          disabled={createTool.isPending}
          className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-full text-sm font-medium hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          أداة جديدة
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative md:col-span-1">
          <Search className="w-4 h-4 absolute end-3 top-3 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن أداة…"
            className="pe-9"
          />
        </div>
        <Select value={boardFilter} onValueChange={setBoardFilter}>
          <SelectTrigger><SelectValue placeholder="السبورة" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل السبورات</SelectItem>
            {boards.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={kindFilter} onValueChange={setKindFilter}>
          <SelectTrigger><SelectValue placeholder="النوع" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الأنواع</SelectItem>
            {Object.entries(KIND_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <AppCardSurface className="p-12 text-center text-sm text-muted-foreground">
          لا توجد أدوات مطابقة.
        </AppCardSurface>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((t) => (
            <AppCardSurface key={t.id} className="p-4 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-base truncate">{t.name}</h3>
                <BaseBadge variant="secondary">{KIND_LABELS[t.kind] ?? t.kind}</BaseBadge>
              </div>
              {t.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{t.description}</p>
              )}
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-border text-xs text-muted-foreground">
                <span>{t.state}</span>
                <span>{new Date(t.updated_at).toLocaleDateString("ar")}</span>
              </div>
            </AppCardSurface>
          ))}
        </div>
      )}
    </div>
  );
};
