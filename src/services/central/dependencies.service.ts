/**
 * Dependencies Service — CRUD for `public.dependencies` (cross-entity edges).
 */
import { supabase } from "@/integrations/supabase/client";
import type {
  CentralDependencyType,
  CentralEntityType,
  Dependency,
} from "@/types/central";

export interface DependencyCreateInput {
  from_entity_type: CentralEntityType;
  from_entity_id: string;
  to_entity_type: CentralEntityType;
  to_entity_id: string;
  dependency_type: CentralDependencyType;
  description?: string | null;
}

export async function listDependencies(): Promise<Dependency[]> {
  const { data, error } = await supabase
    .from("dependencies").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function listDependenciesFor(
  entityType: CentralEntityType,
  entityId: string,
): Promise<Dependency[]> {
  const { data, error } = await supabase
    .from("dependencies")
    .select("*")
    .or(
      `and(from_entity_type.eq.${entityType},from_entity_id.eq.${entityId}),` +
      `and(to_entity_type.eq.${entityType},to_entity_id.eq.${entityId})`,
    );
  if (error) throw error;
  return data ?? [];
}

export async function createDependency(
  input: DependencyCreateInput,
): Promise<Dependency> {
  const { data, error } = await supabase
    .from("dependencies").insert(input as never).select("*").single();
  if (error) throw error;
  return data;
}

export async function deleteDependency(id: string): Promise<void> {
  const { error } = await supabase.from("dependencies").delete().eq("id", id);
  if (error) throw error;
}
