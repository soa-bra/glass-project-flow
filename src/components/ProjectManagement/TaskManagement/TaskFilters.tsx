import React from 'react';

interface TaskFiltersProps {
  filters: {
    assignee: string;
    priority: string;
    status: string;
    search: string;
  };
  onFiltersChange: (filters: any) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({ filters, onFiltersChange }) => {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="bg-[#F2FFFF] rounded-3xl p-6 border border-black/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-black">المرشحات والبحث</h3>
        <button 
          onClick={() => onFiltersChange({ assignee: '', priority: '', status: '', search: '' })}
          className="text-sm font-medium text-black hover:underline"
        >
          مسح الكل
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-bold text-black mb-2">البحث</label>
          <input
            type="text"
            placeholder="ابحث في المهام..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full p-3 border border-black/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Assignee Filter */}
        <div>
          <label className="block text-sm font-bold text-black mb-2">المسؤول</label>
          <select
            value={filters.assignee}
            onChange={(e) => updateFilter('assignee', e.target.value)}
            className="w-full p-3 border border-black/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">جميع الأعضاء</option>
            <option value="أحمد محمد">أحمد محمد</option>
            <option value="فاطمة علي">فاطمة علي</option>
            <option value="محمد خالد">محمد خالد</option>
            <option value="نورا سعد">نورا سعد</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-bold text-black mb-2">الأولوية</label>
          <select
            value={filters.priority}
            onChange={(e) => updateFilter('priority', e.target.value)}
            className="w-full p-3 border border-black/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">جميع الأولويات</option>
            <option value="urgent">عاجل</option>
            <option value="high">مرتفع</option>
            <option value="medium">متوسط</option>
            <option value="low">منخفض</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-bold text-black mb-2">الحالة</label>
          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="w-full p-3 border border-black/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">جميع الحالات</option>
            <option value="To-Do">مجدولة</option>
            <option value="In Progress">قيد التنفيذ</option>
            <option value="Treating">تحت المعالجة</option>
            <option value="Late">متأخرة</option>
            <option value="Stopped">متوقفة</option>
            <option value="Done">مكتملة</option>
          </select>
        </div>
      </div>
    </div>
  );
};