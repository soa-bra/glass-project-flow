/**
 * Generic CRUD service for department domain tables.
 * Provides typed list/get/create/update/remove that pulls owner_id from the session.
 */
import { supabase } from "@/integrations/supabase/client";
import type { DepartmentTableName } from "@/types/departments";

type Row<T> = T & { id: string; owner_id: string; created_at: string; updated_at: string };

export interface ListOptions {
  filters?: Record<string, string | number | boolean | null>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

export function createDomainService<T extends Record<string, unknown>>(
  table: DepartmentTableName,
) {
  return {
    async list(opts: ListOptions = {}): Promise<Row<T>[]> {
      let q = supabase.from(table).select("*");
      if (opts.filters) {
        for (const [k, v] of Object.entries(opts.filters)) {
          if (v === null) q = q.is(k, null);
          else q = q.eq(k, v as never);
        }
      }
      const orderCol = opts.orderBy?.column ?? "created_at";
      q = q.order(orderCol, { ascending: opts.orderBy?.ascending ?? false });
      if (opts.limit) q = q.limit(opts.limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as Row<T>[];
    },

    async get(id: string): Promise<Row<T> | null> {
      const { data, error } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return (data ?? null) as unknown as Row<T> | null;
    },

    async create(input: Partial<T>): Promise<Row<T>> {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Not authenticated");
      const payload = { ...input, owner_id: auth.user.id } as never;
      const { data, error } = await supabase.from(table).insert(payload).select("*").single();
      if (error) throw error;
      return data as unknown as Row<T>;
    },

    async update(id: string, patch: Partial<T>): Promise<Row<T>> {
      const { data, error } = await supabase
        .from(table)
        .update(patch as never)
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw error;
      return data as unknown as Row<T>;
    },

    async remove(id: string): Promise<void> {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
  };
}
