
import { useMemo, useCallback } from 'react';

// مساعدات للتحسين والذاكرة
export const useMemoizedData = <T>(data: T, dependencies: any[]): T => {
  return useMemo(() => data, dependencies);
};

export const useMemoizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  dependencies: any[]
): T => {
  return useCallback(callback, dependencies);
};

// تحسين عرض القوائم الطويلة
export const optimizeListData = <T extends { id: number | string }>(items: T[]): T[] => {
  return useMemo(() => {
    // إزالة المكررات
    const uniqueItems = items.filter((item, index, arr) => 
      arr.findIndex(i => i.id === item.id) === index
    );
    
    // ترتيب حسب الأولوية
    return uniqueItems.sort((a, b) => {
      if ('priority' in a && 'priority' in b) {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
               (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
      }
      return 0;
    });
  }, [items]);
};
