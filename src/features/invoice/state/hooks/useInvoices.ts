/**
 * useInvoices Hook
 * Hook للتعامل مع الفواتير
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type { 
  Invoice, 
  InvoiceStats, 
  CreateInvoiceInput 
} from '../../domain/types/invoice.types';
import { invoiceAPI } from '../../integration/api/invoiceAPI';

// Re-export useInvoiceFilters for convenience
export { useInvoiceFilters } from './useInvoiceFilters';

interface UseInvoicesResult {
  invoices: Invoice[];
  stats: InvoiceStats | null;
  loading: boolean;
  error: string | null;
  createInvoice: (data: CreateInvoiceInput) => Promise<Invoice | null>;
  postInvoice: (id: string) => Promise<boolean>;
  cancelInvoice: (id: string) => Promise<boolean>;
  payInvoice: (id: string, amount: number, method: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export function useInvoices(): UseInvoicesResult {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [invoicesData, statsData] = await Promise.all([
        invoiceAPI.getInvoices(),
        invoiceAPI.getInvoiceStats(),
      ]);
      setInvoices(invoicesData);
      setStats(statsData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'فشل في تحميل البيانات';
      setError(message);
      toast.error('فشل في تحميل بيانات الفواتير');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createInvoice = useCallback(async (data: CreateInvoiceInput): Promise<Invoice | null> => {
    try {
      const invoice = await invoiceAPI.createInvoice(data);
      toast.success('تم إنشاء الفاتورة بنجاح');
      await loadData();
      return invoice;
    } catch (err) {
      toast.error('فشل في إنشاء الفاتورة');
      return null;
    }
  }, [loadData]);

  const postInvoice = useCallback(async (id: string): Promise<boolean> => {
    try {
      await invoiceAPI.postInvoice(id);
      toast.success('تم إرسال الفاتورة بنجاح');
      await loadData();
      return true;
    } catch (err) {
      toast.error('فشل في إرسال الفاتورة');
      return false;
    }
  }, [loadData]);

  const cancelInvoice = useCallback(async (id: string): Promise<boolean> => {
    try {
      await invoiceAPI.cancelInvoice(id);
      toast.success('تم إلغاء الفاتورة');
      await loadData();
      return true;
    } catch (err) {
      toast.error('فشل في إلغاء الفاتورة');
      return false;
    }
  }, [loadData]);

  const payInvoice = useCallback(async (id: string, amount: number, method: string): Promise<boolean> => {
    try {
      await invoiceAPI.payInvoice(id, amount, method);
      toast.success('تم تسجيل الدفعة بنجاح');
      await loadData();
      return true;
    } catch (err) {
      toast.error('فشل في تسجيل الدفعة');
      return false;
    }
  }, [loadData]);

  return {
    invoices,
    stats,
    loading,
    error,
    createInvoice,
    postInvoice,
    cancelInvoice,
    payInvoice,
    refresh: loadData,
  };
}
