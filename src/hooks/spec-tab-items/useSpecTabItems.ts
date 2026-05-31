/**
 * useSpecTabItems — React Query hooks for spec_tab_items CRUD.
 * @specRef DepartmentsWorkspace-tabs-boxes-backend.md
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import {
  SpecTabItemsService,
  type SpecTabItemInsert,
  type SpecTabItemRow,
  type SpecTabItemUpdate,
  type SpecTabScope,
} from '@/services/spec-tab-items/specTabItems.service';

const keys = {
  all: ['spec-tab-items'] as const,
  scope: (s: SpecTabScope) => ['spec-tab-items', s.departmentCode, s.tabKey] as const,
};

export function useSpecTabItems(scope: SpecTabScope) {
  return useQuery({
    queryKey: keys.scope(scope),
    queryFn: () => SpecTabItemsService.list(scope),
  });
}

export function useSpecTabItemMutations(scope: SpecTabScope) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const invalidate = () => qc.invalidateQueries({ queryKey: keys.scope(scope) });

  const create = useMutation({
    mutationFn: (input: Omit<SpecTabItemInsert, 'owner_id' | 'department_code' | 'tab_key'>) =>
      SpecTabItemsService.create({
        ...input,
        department_code: scope.departmentCode,
        tab_key: scope.tabKey,
      }),
    onSuccess: () => {
      invalidate();
      toast({ title: 'تم الحفظ', description: 'تم إضافة العنصر بنجاح.' });
    },
    onError: (e: unknown) =>
      toast({
        title: 'تعذّر الحفظ',
        description: e instanceof Error ? e.message : 'خطأ غير معروف',
        variant: 'destructive',
      }),
  });

  const update = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: SpecTabItemUpdate }) =>
      SpecTabItemsService.update(id, patch),
    onSuccess: () => {
      invalidate();
      toast({ title: 'تم التحديث' });
    },
    onError: (e: unknown) =>
      toast({
        title: 'تعذّر التحديث',
        description: e instanceof Error ? e.message : 'خطأ',
        variant: 'destructive',
      }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => SpecTabItemsService.remove(id),
    onSuccess: () => {
      invalidate();
      toast({ title: 'تم الحذف' });
    },
    onError: (e: unknown) =>
      toast({
        title: 'تعذّر الحذف',
        description: e instanceof Error ? e.message : 'خطأ',
        variant: 'destructive',
      }),
  });

  return { create, update, remove };
}

export type { SpecTabItemRow };
