/**
 * useInvoices — React Query hooks for the active Invoice path.
 * Bounded to `public.invoices`; no shadow-ORM dependency.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  listInvoices,
  createInvoice,
  updateInvoice,
  type CreateInvoiceInput,
  type UpdateInvoiceInput,
} from '@/services/invoices/invoices.service';

const INVOICES_KEY = ['invoices'] as const;

export function useInvoices() {
  return useQuery({
    queryKey: INVOICES_KEY,
    queryFn: listInvoices,
  });
}

export function useCreateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateInvoiceInput) => createInvoice(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INVOICES_KEY });
      toast.success('تم إنشاء الفاتورة بنجاح');
    },
    onError: (error: unknown) => {
      const msg = error instanceof Error ? error.message : 'فشل إنشاء الفاتورة';
      toast.error(msg);
      // eslint-disable-next-line no-console
      console.error('[useCreateInvoice] failed', error);
    },
  });
}

export function useUpdateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateInvoiceInput }) =>
      updateInvoice(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INVOICES_KEY });
      toast.success('تم تحديث الفاتورة بنجاح');
    },
    onError: (error: unknown) => {
      const msg = error instanceof Error ? error.message : 'فشل تحديث الفاتورة';
      toast.error(msg);
      // eslint-disable-next-line no-console
      console.error('[useUpdateInvoice] failed', error);
    },
  });
}
