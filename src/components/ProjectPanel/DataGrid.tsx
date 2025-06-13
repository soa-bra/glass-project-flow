
import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Search, Download, Filter } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataGridProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  searchable?: boolean;
  exportable?: boolean;
}

export const DataGrid: React.FC<DataGridProps> = ({
  columns,
  data,
  loading = false,
  searchable = true,
  exportable = true
}) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue, 'ar') 
          : bValue.localeCompare(aValue, 'ar');
      }

      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return sortedData;

    return sortedData.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedData, searchTerm]);

  if (loading) {
    return (
      <div className="bg-white/30 backdrop-blur-[15px] rounded-[20px] p-6 border border-white/40">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-white/30 rounded w-full"></div>
          <div className="h-4 bg-white/30 rounded w-3/4"></div>
          <div className="h-4 bg-white/30 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/30 backdrop-blur-[15px] rounded-[20px] border border-white/40 overflow-hidden">
      {/* أدوات الجدول */}
      {(searchable || exportable) && (
        <div className="p-4 border-b border-white/20 flex items-center gap-3">
          {searchable && (
            <div className="flex-1 relative">
              <Search size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في البيانات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2 bg-white/20 backdrop-blur-[10px] border border-white/30 rounded-lg text-right placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          )}
          
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <Filter size={16} className="text-gray-600" />
          </button>
          
          {exportable && (
            <button className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
              <Download size={16} />
              <span>تصدير</span>
            </button>
          )}
        </div>
      )}

      {/* الجدول */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-white/10 border-b border-white/20">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-sm font-semibold text-gray-700 ${
                    column.align === 'center' ? 'text-center' : 
                    column.align === 'left' ? 'text-left' : 'text-right'
                  } ${column.sortable ? 'cursor-pointer hover:bg-white/10' : ''}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          size={12} 
                          className={`${
                            sortColumn === column.key && sortDirection === 'asc' 
                              ? 'text-sky-600' : 'text-gray-400'
                          }`} 
                        />
                        <ChevronDown 
                          size={12} 
                          className={`${
                            sortColumn === column.key && sortDirection === 'desc' 
                              ? 'text-sky-600' : 'text-gray-400'
                          }`} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr 
                key={index} 
                className="border-b border-white/10 hover:bg-white/10 transition-colors"
              >
                {columns.map((column) => (
                  <td 
                    key={column.key}
                    className={`px-4 py-3 text-sm text-gray-700 ${
                      column.align === 'center' ? 'text-center' : 
                      column.align === 'left' ? 'text-left' : 'text-right'
                    }`}
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          لا توجد بيانات لعرضها
        </div>
      )}
    </div>
  );
};
