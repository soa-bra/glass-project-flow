/**
 * Generic CRUD service for department domain tables.
 * Provides typed list/get/create/update/remove that pulls owner_id from the session.
 *
 * Note: We deliberately bypass Supabase's generic table typing for this factory
 * (using `as never`) because the table name is dynamic. Callers wrap the
 * returned service with their own Row type for safety.
 */
import { supabase } from "@/integrations/supabase/client";
import type { DepartmentTableName } from "@/types/departments";

type Row<T> = T & { id: string; owner_id: string; created_at: string; updated_at: string };

export interface ListOptions {
  filters?: Record<string, string | number | boolean | null>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as unknown as { from: (t: string) => any };

export function createDomainService<T extends Record<string, unknown>>(
  table: DepartmentTableName,
) {
  return {
    async list(opts: ListOptions = {}): Promise<Row<T>[]> {
      let q = db.from(table).select("*");
      if (opts.filters) {
        for (const [k, v] of Object.entries(opts.filters)) {
          if (v === null) q = q.is(k, null);
          else q = q.eq(k, v);
        }
      }
      const orderCol = opts.orderBy?.column ?? "created_at";
      q = q.order(orderCol, { ascending: opts.orderBy?.ascending ?? false });
      if (opts.limit) q = q.limit(opts.limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Row<T>[];
    },

    async get(id: string): Promise<Row<T> | null> {
      const { data, error } = await db.from(table).select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return (data ?? null) as Row<T> | null;
    },

    async create(input: Partial<T>): Promise<Row<T>> {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Not authenticated");
      const payload = { ...input, owner_id: auth.user.id };
      const { data, error } = await db.from(table).insert(payload).select("*").single();
      if (error) throw error;
      return data as Row<T>;
    },

    async update(id: string, patch: Partial<T>): Promise<Row<T>> {
      const { data, error } = await db
        .from(table)
        .update(patch)
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw error;
      return data as Row<T>;
    },

    async remove(id: string): Promise<void> {
      const { error } = await db.from(table).delete().eq("id", id);
      if (error) throw error;
    },
  };
}
