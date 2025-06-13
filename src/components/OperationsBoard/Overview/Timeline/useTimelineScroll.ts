
import { useRef, useState, useCallback, useEffect } from 'react';

export const useTimelineScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // متغيرات لتحسين الأداء والسحب السلس
  const dragStartRef = useRef(false);
  const lastPointerRef = useRef(0);
  const velocityRef = useRef(0);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef(0);

  // تحديث حالة أزرار التنقل
  const updateScrollButtons = useCallback(() => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  // إضافة الزخم للتمرير السلس
  const applyMomentum = useCallback(() => {
    if (!scrollRef.current || Math.abs(velocityRef.current) < 1) {
      return;
    }

    scrollRef.current.scrollLeft += velocityRef.current;
    velocityRef.current *= 0.92; // تقليل السرعة تدريجياً
    
    updateScrollButtons();
    
    if (Math.abs(velocityRef.current) > 1) {
      animationFrameRef.current = requestAnimationFrame(applyMomentum);
    }
  }, [updateScrollButtons]);

  // مراقبة التمرير لتحديث المؤشرات
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    updateScrollButtons();
    
    const handleScroll = () => {
      updateScrollButtons();
    };
    
    const handleWheel = (e: WheelEvent) => {
      // تحسين التمرير بالعجلة
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
        e.preventDefault();
        scrollElement.scrollLeft += e.deltaX || e.deltaY;
        updateScrollButtons();
      }
    };
    
    scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    scrollElement.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
      scrollElement.removeEventListener('wheel', handleWheel);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateScrollButtons]);

  const scroll = useCallback((direction: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ 
        left: direction, 
        behavior: 'smooth' 
      });
    }
  }, []);

  // بداية السحب
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!scrollRef.current || e.button !== 0) return;
    
    // إلغاء أي حركة زخم سابقة
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    const target = e.currentTarget as Element;
    target.setPointerCapture(e.pointerId);
    
    setIsDragging(true);
    dragStartRef.current = true;
    setStartX(e.clientX);
    setScrollLeft(scrollRef.current.scrollLeft);
    lastPointerRef.current = e.clientX;
    lastTimeRef.current = Date.now();
    velocityRef.current = 0;
    
    // منع التحديد والسلوك الافتراضي
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // أثناء السحب
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !scrollRef.current || !dragStartRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const deltaX = e.clientX - startX;
    const newScrollLeft = scrollLeft - deltaX;
    
    // حساب السرعة للزخم
    const currentTime = Date.now();
    const timeDelta = currentTime - lastTimeRef.current;
    
    if (timeDelta > 0) {
      velocityRef.current = (lastPointerRef.current - e.clientX) / timeDelta * 16; // تطبيع للـ 60fps
    }
    
    lastPointerRef.current = e.clientX;
    lastTimeRef.current = currentTime;
    
    // تطبيق التمرير مع القيود
    const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    const clampedScroll = Math.max(0, Math.min(newScrollLeft, maxScroll));
    
    scrollRef.current.scrollLeft = clampedScroll;
    updateScrollButtons();
  }, [isDragging, startX, scrollLeft, updateScrollButtons]);

  // نهاية السحب
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!scrollRef.current) return;
    
    const target = e.currentTarget as Element;
    target.releasePointerCapture(e.pointerId);
    
    setIsDragging(false);
    dragStartRef.current = false;
    
    // تطبيق الزخم إذا كان هناك سرعة كافية
    if (Math.abs(velocityRef.current) > 3) {
      applyMomentum();
    }
    
    updateScrollButtons();
  }, [applyMomentum, updateScrollButtons]);

  // إلغاء السحب
  const handlePointerCancel = useCallback((e: React.PointerEvent) => {
    handlePointerUp(e);
  }, [handlePointerUp]);

  return {
    scrollRef,
    isDragging,
    canScrollLeft,
    canScrollRight,
    scroll,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel
  };
};
