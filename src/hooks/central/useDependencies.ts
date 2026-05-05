/**
 * useDependencies hook — قراءة جدول التبعيات (تكميل لـ useCentral).
 * تم تصدير useDependencies بالفعل ضمن useCentral؛ هذا الملف يوفّر hooks إضافية.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DependenciesService } from "@/services/central";
import { centralKeys } from "./useCentral";
import type { CentralEntityType } from "@/types/central";
import type { DependencyCreateInput } from "@/services/central/dependencies.service";

export function useEntityDependencies(entityType: CentralEntityType | null, entityId: string | null) {
  return useQuery({
    queryKey: ["central", "dependencies", entityType, entityId],
    queryFn: () =>
      entityType && entityId
        ? DependenciesService.listDependenciesFor(entityType, entityId)
        : Promise.resolve([]),
    enabled: !!entityType && !!entityId,
  });
}

export function useCreateDependency() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: DependencyCreateInput) => DependenciesService.createDependency(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: centralKeys.dependencies }),
  });
}

export function useDeleteDependency() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => DependenciesService.deleteDependency(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: centralKeys.dependencies }),
  });
}
