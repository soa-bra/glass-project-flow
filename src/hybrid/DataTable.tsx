/**
 * @component DataTable
 * @category Hybrid
 * @sprint Sprint 3
 * @status TODO
 * @priority high
 * @tokens DS: [colors, spacing, radius] | OC: [project, task]
 */
import React from 'react';

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({ data, columns, onRowClick, loading, emptyMessage = 'لا توجد بيانات', className }: DataTableProps<T>) {
  return <div className={className}><span>🚧 DataTable - قيد التطوير</span></div>;
}

DataTable.displayName = 'DataTable';
export default DataTable;
