import { useMemo, useState } from 'react';
import type { ArchiveRecord } from './archiveData';

export interface ArchiveQueryFilters {
  type?: string;
  owner?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

interface Options {
  pageSize?: number;
}

export const useArchiveQuery = (source: ArchiveRecord[], options: Options = {}) => {
  const pageSize = options.pageSize ?? 10;
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<ArchiveQueryFilters>({});
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return source.filter((item) => {
      const matchesText = !q || [item.title, item.type, item.owner, item.status, item.description ?? '']
        .join(' ')
        .toLowerCase()
        .includes(q);
      const matchesType = !filters.type || item.type === filters.type;
      const matchesOwner = !filters.owner || item.owner === filters.owner;
      const matchesStatus = !filters.status || item.status === filters.status;
      const itemDate = new Date(item.date).getTime();
      const matchesFrom = !filters.fromDate || itemDate >= new Date(filters.fromDate).getTime();
      const matchesTo = !filters.toDate || itemDate <= new Date(filters.toDate).getTime();
      return matchesText && matchesType && matchesOwner && matchesStatus && matchesFrom && matchesTo;
    });
  }, [source, query, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const exportRows = () => filtered;

  return { query, setQuery, filters, setFilters, page: safePage, setPage, totalPages, filteredCount: filtered.length, pageItems, exportRows };
};
