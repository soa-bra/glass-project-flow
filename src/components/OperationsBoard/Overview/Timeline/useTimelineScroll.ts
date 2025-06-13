
import { useRef, useState, useCallback, useEffect } from 'react';

export const useTimelineScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // تحديث حالة أزرار التنقل
  const updateScrollButtons = useCallback(() => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  // مراقبة التمرير لتحديث المؤشرات
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    updateScrollButtons();
    
    const handleScroll = () => updateScrollButtons();
    scrollElement.addEventListener('scroll', handleScroll);
    
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [updateScrollButtons]);

  const scroll = (direction: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ 
        left: direction, 
        behavior: 'smooth' 
      });
    }
  };

  // نظام السحب المحسن مع منع التداخل
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!scrollRef.current) return;
    
    console.log('بدء السحب - Pointer Down');
    
    // التقاط المؤشر بشكل صحيح
    const target = e.currentTarget as Element;
    target.setPointerCapture(e.pointerId);
    
    setIsDragging(true);
    setStartX(e.clientX);
    setScrollLeft(scrollRef.current.scrollLeft);
    
    // تغيير المؤشر فوراً
    scrollRef.current.style.cursor = 'grabbing';
    scrollRef.current.style.userSelect = 'none';
    
    // منع السلوك الافتراضي بقوة
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !scrollRef.current) return;
    
    // منع السلوك الافتراضي بقوة
    e.preventDefault();
    e.stopPropagation();
    
    // حساب المسافة الأفقية فقط
    const deltaX = e.clientX - startX;
    const newScrollLeft = scrollLeft - deltaX;
    
    console.log('السحب - Delta X:', deltaX, 'ScrollLeft الجديد:', newScrollLeft);
    
    // تطبيق التمرير الأفقي مع تقييد الحدود
    const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    const clampedScroll = Math.max(0, Math.min(newScrollLeft, maxScroll));
    
    scrollRef.current.scrollLeft = clampedScroll;
  }, [isDragging, startX, scrollLeft]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!scrollRef.current) return;
    
    console.log('انتهاء السحب - Pointer Up');
    
    // تحرير التقاط المؤشر
    const target = e.currentTarget as Element;
    target.releasePointerCapture(e.pointerId);
    
    setIsDragging(false);
    
    // إعادة تعيين المؤشر
    scrollRef.current.style.cursor = 'grab';
    scrollRef.current.style.userSelect = 'auto';
    
    // تحديث المؤشرات
    updateScrollButtons();
  }, [updateScrollButtons]);

  const handlePointerCancel = useCallback((e: React.PointerEvent) => {
    console.log('إلغاء السحب - Pointer Cancel');
    handlePointerUp(e);
  }, [handlePointerUp]);

  // منع السلوك الافتراضي لأحداث اللمس
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
  }, []);

  return {
    scrollRef,
    isDragging,
    canScrollLeft,
    canScrollRight,
    scroll,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleTouchStart
  };
};
