/**
 * useInvoiceFilters Hook
 * Hook لفلترة الفواتير
 */

import { useState, useMemo, useCallback } from 'react';
import type { Invoice } from '../../domain/types/invoice.types';
import type { InvoiceFiltersState } from '../../ui/widgets/InvoiceFilters';

const defaultFilters: InvoiceFiltersState = {
  search: '',
  status: 'all',
  dateFrom: '',
  dateTo: '',
};

export function useInvoiceFilters(invoices: Invoice[]) {
  const [filters, setFilters] = useState<InvoiceFiltersState>(defaultFilters);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesNumber = invoice.number.toLowerCase().includes(searchLower);
        const matchesClient = (invoice.accountName || invoice.accountId)
          .toLowerCase()
          .includes(searchLower);
        
        if (!matchesNumber && !matchesClient) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== 'all' && invoice.status !== filters.status) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom || filters.dateTo) {
        const invoiceDate = invoice.dueDate 
          ? new Date(invoice.dueDate) 
          : invoice.createdAt 
            ? new Date(invoice.createdAt) 
            : null;

        if (invoiceDate) {
          if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            if (invoiceDate < fromDate) return false;
          }

          if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            toDate.setHours(23, 59, 59, 999);
            if (invoiceDate > toDate) return false;
          }
        }
      }

      return true;
    });
  }, [invoices, filters]);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== 'all') count++;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    return count;
  }, [filters]);

  return {
    filters,
    setFilters,
    filteredInvoices,
    resetFilters,
    activeFiltersCount,
  };
}
