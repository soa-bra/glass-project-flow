import React from 'react';
import { Download, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';
import { ARCHIVE_CATEGORY_TITLES, type ArchiveCategoryKey, type ArchiveRecord } from './archiveData';
import { useArchiveQuery } from './useArchiveQuery';

interface Props {
  category: ArchiveCategoryKey;
  records: ArchiveRecord[];
  isLoading?: boolean;
  isError?: boolean;
}

export const GenericArchiveCategoryPanel: React.FC<Props> = ({ category, records, isLoading = false, isError = false }) => {
  const { query, setQuery, filters, setFilters, page, setPage, totalPages, filteredCount, pageItems, exportRows } = useArchiveQuery(records, { pageSize: 5 });

  return (
    <div className="h-full flex flex-col bg-transparent">
      <div className="flex items-center justify-between px-6 py-6">
        <h2 className="font-medium text-black font-arabic text-3xl">{ARCHIVE_CATEGORY_TITLES[category]}</h2>
        <div className="flex items-center gap-3">
          <Button className="bg-black text-white rounded-full" onClick={() => console.info('archive-export', category, exportRows())}>
            <Download className="w-4 h-4 mr-2" />تصدير
          </Button>
          <Button variant="outline" className="rounded-full">
            <Filter className="w-4 h-4 mr-2" />تصفية
          </Button>
        </div>
      </div>

      <div className="px-6 mb-6">
        <AppCardSurface density="compact">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="بحث نصي..." className="md:col-span-2 px-3 py-2 rounded-full ring-1" />
            <input value={filters.type ?? ''} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value || undefined }))} placeholder="النوع" className="px-3 py-2 rounded-full ring-1" />
            <input value={filters.owner ?? ''} onChange={(e) => setFilters((f) => ({ ...f, owner: e.target.value || undefined }))} placeholder="المالك" className="px-3 py-2 rounded-full ring-1" />
            <input value={filters.status ?? ''} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value || undefined }))} placeholder="الحالة" className="px-3 py-2 rounded-full ring-1" />
            <input type="date" value={filters.fromDate ?? ''} onChange={(e) => setFilters((f) => ({ ...f, fromDate: e.target.value || undefined }))} className="px-3 py-2 rounded-full ring-1" />
            <input type="date" value={filters.toDate ?? ''} onChange={(e) => setFilters((f) => ({ ...f, toDate: e.target.value || undefined }))} className="px-3 py-2 rounded-full ring-1" />
          </div>
        </AppCardSurface>
      </div>

      <div className="flex-1 px-6 pb-6">
        {isLoading ? <div className="py-16 flex justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div> : isError ? <AppCardSurface><div className="py-12 text-center">حدث خطأ أثناء تحميل البيانات.</div></AppCardSurface> : filteredCount === 0 ? <AppCardSurface><div className="py-12 text-center">لا توجد عناصر مطابقة.</div></AppCardSurface> : (
          <div className="space-y-3">
            {pageItems.map((item) => (
              <AppCardSurface key={item.id} density="compact" interactive="hoverable">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.type} • {item.owner} • {item.status}</div>
                  </div>
                  <div className="text-sm text-gray-500">{item.date}</div>
                </div>
              </AppCardSurface>
            ))}
            <div className="flex items-center justify-between pt-2 text-sm">
              <span>الصفحة {page} من {totalPages}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setPage(Math.max(1, page - 1))}>السابق</Button>
                <Button size="sm" variant="outline" onClick={() => setPage(Math.min(totalPages, page + 1))}>التالي</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
