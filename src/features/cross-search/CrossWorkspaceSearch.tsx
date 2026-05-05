/**
 * CrossWorkspaceSearch — Modal بحث موحّد عبر Ctrl/Cmd+K.
 * يستهلك useCrossWorkspaceSearch ويعرض النتائج مجمّعة حسب نوع الكيان.
 */
import React, { useEffect, useMemo, useState } from "react";
import { useCrossWorkspaceSearch } from "@/hooks/central";
import type { SearchHit, SearchEntityType } from "@/services/central/search.service";
import { Search, X, Loader2, FileText, ListChecks, Wrench, LayoutGrid, Building2 } from "lucide-react";

const TYPE_META: Record<SearchEntityType, { label: string; icon: React.ElementType }> = {
  project:        { label: "مشاريع",  icon: FileText },
  task:           { label: "مهام",    icon: ListChecks },
  tool:           { label: "أدوات",   icon: Wrench },
  central_board:  { label: "سبورات",  icon: LayoutGrid },
  department:     { label: "أقسام",    icon: Building2 },
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect?: (hit: SearchHit) => void;
}

export const CrossWorkspaceSearch: React.FC<Props> = ({ open, onClose, onSelect }) => {
  const [query, setQuery] = useState("");
  const { data: hits = [], isFetching } = useCrossWorkspaceSearch(query);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const grouped = useMemo(() => {
    const g: Record<SearchEntityType, SearchHit[]> = {
      project: [], task: [], tool: [], central_board: [], department: [],
    };
    hits.forEach((h) => g[h.entity_type].push(h));
    return g;
  }, [hits]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-modal flex items-start justify-center pt-24 px-4 sb-modal-shell"
      onClick={onClose}
      dir="rtl"
    >
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث في المشاريع والمهام والأدوات…"
            className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground"
          />
          {isFetching && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim().length < 2 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              اكتب على الأقل حرفين للبحث.
            </div>
          ) : hits.length === 0 && !isFetching ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              لا نتائج لـ «{query}».
            </div>
          ) : (
            <div className="p-2">
              {(Object.keys(grouped) as SearchEntityType[]).map((type) => {
                const items = grouped[type];
                if (!items.length) return null;
                const meta = TYPE_META[type];
                const Icon = meta.icon;
                return (
                  <div key={type} className="mb-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                      <Icon className="w-3.5 h-3.5" />
                      {meta.label} · {items.length}
                    </div>
                    {items.map((h) => (
                      <button
                        key={h.id}
                        onClick={() => { onSelect?.(h); onClose(); }}
                        className="w-full text-start px-3 py-2 rounded-lg hover:bg-muted/60 transition flex flex-col"
                      >
                        <div className="font-medium text-sm">{h.name}</div>
                        {h.description && (
                          <div className="text-xs text-muted-foreground truncate">{h.description}</div>
                        )}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground flex items-center justify-between">
          <span>اضغط <kbd className="px-1.5 py-0.5 rounded bg-muted">Esc</kbd> للإغلاق</span>
          <span>{hits.length} نتيجة</span>
        </div>
      </div>
    </div>
  );
};
