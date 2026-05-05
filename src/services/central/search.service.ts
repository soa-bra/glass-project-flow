/**
 * Cross-Workspace Search Service — يبحث عبر جداول central الرئيسية بطلب مفرد لكل جدول.
 * يعتمد على ILIKE على name/description ويُحدّ بـ 10 لكل نوع. لا يستخدم RPC حتى يبقى آمنًا
 * مع RLS وقابل للتطور لاحقًا إلى FTS عند الحاجة.
 */
import { supabase } from "@/integrations/supabase/client";

export type SearchEntityType = "project" | "task" | "tool" | "central_board" | "department";

export interface SearchHit {
  id: string;
  entity_type: SearchEntityType;
  name: string;
  description: string | null;
  state: string | null;
  updated_at: string | null;
}

const PER_TYPE_LIMIT = 10;

async function searchTable(
  table: "projects" | "tasks" | "tools" | "central_boards" | "departments",
  entityType: SearchEntityType,
  q: string,
): Promise<SearchHit[]> {
  const like = `%${q.replace(/[%_]/g, (m) => `\\${m}`)}%`;
  const { data, error } = await supabase
    .from(table)
    .select("id,name,description,state,updated_at")
    .or(`name.ilike.${like},description.ilike.${like}`)
    .order("updated_at", { ascending: false })
    .limit(PER_TYPE_LIMIT);
  if (error) {
    console.warn(`[search] ${table} failed`, error.message);
    return [];
  }
  return (data ?? []).map((row) => ({
    id: row.id as string,
    entity_type: entityType,
    name: (row.name as string) ?? "",
    description: (row.description as string | null) ?? null,
    state: (row.state as string | null) ?? null,
    updated_at: (row.updated_at as string | null) ?? null,
  }));
}

export async function searchAll(query: string): Promise<SearchHit[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const [projects, tasks, tools, boards, departments] = await Promise.all([
    searchTable("projects", "project", q),
    searchTable("tasks", "task", q),
    searchTable("tools", "tool", q),
    searchTable("central_boards", "central_board", q),
    searchTable("departments", "department", q),
  ]);
  return [...projects, ...tasks, ...tools, ...boards, ...departments].sort(
    (a, b) => (b.updated_at ?? "").localeCompare(a.updated_at ?? ""),
  );
}
