/**
 * BaseSearchBar Stories - قصص مكون شريط البحث
 */
import React, { useState } from 'react';
import { BaseSearchBar } from '@/components/shared/BaseSearchBar';

export default {
  title: 'Components/BaseSearchBar',
  component: BaseSearchBar,
};

// Interactive Playground
export const Playground = () => {
  const [query, setQuery] = useState('');
  
  return (
    <div className="p-8 space-y-6 font-arabic" dir="rtl">
      <h2 className="text-2xl font-bold text-ink">🎮 Interactive Playground</h2>
      
      <BaseSearchBar
        searchQuery={query}
        onSearchChange={setQuery}
        placeholder="ابحث عن أي شيء..."
      />
      
      <div className="p-4 bg-panel rounded-xl">
        <p className="text-ink-60">قيمة البحث الحالية:</p>
        <p className="text-ink font-semibold">{query || '(فارغ)'}</p>
      </div>
    </div>
  );
};

// Different Placeholders
export const DifferentPlaceholders = () => {
  const [queries, setQueries] = useState({
    projects: '',
    employees: '',
    files: '',
  });
  
  return (
    <div className="p-8 space-y-6 font-arabic" dir="rtl">
      <h2 className="text-2xl font-bold text-ink mb-6">📝 نصوص توضيحية مختلفة</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-60 mb-2">بحث المشاريع</label>
          <BaseSearchBar
            searchQuery={queries.projects}
            onSearchChange={(v) => setQueries(prev => ({ ...prev, projects: v }))}
            placeholder="ابحث عن مشروع..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-ink-60 mb-2">بحث الموظفين</label>
          <BaseSearchBar
            searchQuery={queries.employees}
            onSearchChange={(v) => setQueries(prev => ({ ...prev, employees: v }))}
            placeholder="ابحث عن موظف بالاسم أو القسم..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-ink-60 mb-2">بحث الملفات</label>
          <BaseSearchBar
            searchQuery={queries.files}
            onSearchChange={(v) => setQueries(prev => ({ ...prev, files: v }))}
            placeholder="ابحث في الملفات والمستندات..."
          />
        </div>
      </div>
    </div>
  );
};

// With Custom Styling
export const WithCustomStyling = () => {
  const [query, setQuery] = useState('');
  
  return (
    <div className="p-8 space-y-6 font-arabic" dir="rtl">
      <h2 className="text-2xl font-bold text-ink mb-6">🎨 تنسيقات مخصصة</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-60 mb-2">افتراضي</label>
          <BaseSearchBar
            searchQuery={query}
            onSearchChange={setQuery}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-ink-60 mb-2">مع خلفية شفافة</label>
          <BaseSearchBar
            searchQuery={query}
            onSearchChange={setQuery}
            className="bg-transparent shadow-none"
          />
        </div>
        
        <div className="bg-ink p-4 rounded-xl">
          <label className="block text-sm font-medium text-white mb-2">على خلفية داكنة</label>
          <BaseSearchBar
            searchQuery={query}
            onSearchChange={setQuery}
          />
        </div>
      </div>
    </div>
  );
};

// Search with Results
export const SearchWithResults = () => {
  const [query, setQuery] = useState('');
  
  const items = [
    'مشروع إعادة تصميم الموقع',
    'مشروع تطوير التطبيق',
    'مشروع التسويق الرقمي',
    'مشروع تحليل البيانات',
    'مشروع إدارة المخزون',
  ];
  
  const filteredItems = items.filter(item => 
    item.includes(query)
  );
  
  return (
    <div className="p-8 space-y-6 font-arabic" dir="rtl">
      <h2 className="text-2xl font-bold text-ink mb-6">🔍 بحث مع نتائج</h2>
      
      <BaseSearchBar
        searchQuery={query}
        onSearchChange={setQuery}
        placeholder="ابحث في المشاريع..."
      />
      
      <div className="space-y-2">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <div 
              key={index}
              className="p-3 bg-white rounded-xl border border-border hover:bg-panel transition-colors cursor-pointer"
            >
              {item}
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-ink-60">
            لا توجد نتائج للبحث "{query}"
          </div>
        )}
      </div>
    </div>
  );
};
