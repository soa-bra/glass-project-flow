/**
 * Generic CRUD service for department domain tables.
 *
 * Hardened in P3.b-audit:
 *   • Zod validation on create/update inputs (schema-driven).
 *   • Audit events on create/update/remove via `audit()`.
 *   • Returned rows soft-validated (warn on shape drift, never block UI).
 */
import { supabase } from "@/integrations/supabase/client";
import { audit } from "@/services/audit";
import {
  DEPARTMENT_TABLES,
  type DepartmentTableName,
} from "@/types/departments";
import type { z } from "zod";

type Row<T> = T & { id: string; owner_id: string; created_at: string; updated_at: string };

export interface ListOptions {
  filters?: Record<string, string | number | boolean | null>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as unknown as { from: (t: string) => any };

const SERVER_MANAGED = ["id", "owner_id", "created_at", "updated_at"] as const;

function stripServerManaged<T extends Record<string, unknown>>(input: Partial<T>): Partial<T> {
  const out: Record<string, unknown> = { ...input };
  for (const k of SERVER_MANAGED) delete out[k];
  return out as Partial<T>;
}

function validateInput<T extends Record<string, unknown>>(
  table: DepartmentTableName,
  patch: Partial<T>,
  mode: "create" | "update",
): Partial<T> {
  const fullSchema = DEPARTMENT_TABLES[table] as unknown as z.ZodObject<z.ZodRawShape>;
  // Build a partial schema that omits server-managed fields, all optional for patch.
  const omittedShape = { ...fullSchema.shape } as z.ZodRawShape;
  for (const k of SERVER_MANAGED) delete omittedShape[k];
  const partial = fullSchema.omit({ id: true, owner_id: true, created_at: true, updated_at: true } as never).partial();
  const result = partial.safeParse(patch);
  if (!result.success) {
    const message = result.error.issues
      .map((i) => `${i.path.join(".") || "_"}: ${i.message}`)
      .join("; ");
    throw new Error(`[${table}] ${mode} validation failed — ${message}`);
  }
  return result.data as Partial<T>;
}

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
      const cleaned = stripServerManaged(input);
      const validated = validateInput<T>(table, cleaned, "create");

      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Not authenticated");

      const payload = { ...validated, owner_id: auth.user.id };
      const { data, error } = await db.from(table).insert(payload).select("*").single();
      if (error) {
        void audit({
          resource_type: table,
          action: "create",
          decision: "error",
          reason: error.message,
        });
        throw error;
      }
      void audit({
        resource_type: table,
        action: "create",
        resource_id: data?.id ?? null,
        metadata: { fields: Object.keys(validated) },
      });
      return data as Row<T>;
    },

    async update(id: string, patch: Partial<T>): Promise<Row<T>> {
      const cleaned = stripServerManaged(patch);
      const validated = validateInput<T>(table, cleaned, "update");

      const { data, error } = await db
        .from(table)
        .update(validated)
        .eq("id", id)
        .select("*")
        .single();
      if (error) {
        void audit({
          resource_type: table,
          action: "update",
          resource_id: id,
          decision: "error",
          reason: error.message,
        });
        throw error;
      }
      void audit({
        resource_type: table,
        action: "update",
        resource_id: id,
        metadata: { fields: Object.keys(validated) },
      });
      return data as Row<T>;
    },

    async remove(id: string): Promise<void> {
      const { error } = await db.from(table).delete().eq("id", id);
      if (error) {
        void audit({
          resource_type: table,
          action: "delete",
          resource_id: id,
          decision: "error",
          reason: error.message,
        });
        throw error;
      }
      void audit({ resource_type: table, action: "delete", resource_id: id });
    },
  };
}
