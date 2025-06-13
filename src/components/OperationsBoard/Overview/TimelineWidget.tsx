
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  department: string;
  color: string;
}

interface TimelineWidgetProps {
  timeline: TimelineEvent[];
  className?: string;
}

export const TimelineWidget: React.FC<TimelineWidgetProps> = ({ 
  timeline, 
  className = '' 
}) => {
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

  const openEvent = (event: TimelineEvent) => {
    console.log('فتح الحدث:', event);
    // يمكن إضافة modal أو popover هنا
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

  return (
    <div className={`
      ${className}
      rounded-3xl p-5
      bg-white/40 backdrop-blur-[20px] border border-white/30
      shadow-lg hover:shadow-xl transition-all duration-300
      flex flex-col
      font-arabic
    `}>
      
      {/* رأس البطاقة */}
      <header className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-arabic font-bold text-gray-800">
          الأحداث القادمة
        </h3>
        
        {/* أزرار التنقل مع مؤشرات الحالة */}
        <div className="flex gap-2">
          <button 
            onClick={() => scroll(200)}
            disabled={!canScrollRight}
            className={`
              p-2 rounded-full transition-all duration-300 backdrop-blur-sm
              ${canScrollRight 
                ? 'bg-white/40 hover:bg-white/60 text-gray-700 hover:scale-110' 
                : 'bg-white/20 text-gray-400 cursor-not-allowed opacity-50'
              }
            `}
          >
            <ChevronRight size={16} />
          </button>
          <button 
            onClick={() => scroll(-200)}
            disabled={!canScrollLeft}
            className={`
              p-2 rounded-full transition-all duration-300 backdrop-blur-sm
              ${canScrollLeft 
                ? 'bg-white/40 hover:bg-white/60 text-gray-700 hover:scale-110' 
                : 'bg-white/20 text-gray-400 cursor-not-allowed opacity-50'
              }
            `}
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </header>

      {/* خط الزمن المحسن مع مؤشرات التمرير */}
      <div className="flex-1 relative overflow-hidden">
        {/* مؤشر التمرير الأيسر */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/60 to-transparent z-30 pointer-events-none" />
        )}
        
        {/* مؤشر التمرير الأيمن */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/60 to-transparent z-30 pointer-events-none" />
        )}
        
        <div
          ref={scrollRef}
          className={`
            overflow-x-auto overflow-y-hidden scrollbar-hide
            cursor-grab active:cursor-grabbing select-none
            h-full flex items-center relative
            ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
          `}
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            touchAction: 'pan-x pinch-zoom', // السماح بالسحب الأفقي والتكبير فقط
            WebkitOverflowScrolling: 'touch' // تحسين الأداء على iOS
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onTouchStart={handleTouchStart}
        >
          {/* الخط الزمني المستمر */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 rounded-full transform -translate-y-1/2 z-0"></div>
          
          {/* الأحداث */}
          <div className="flex items-center gap-24 py-6 px-8 relative z-10">
            {timeline.map((event, index) => (
              <div key={event.id} className="relative flex flex-col items-center min-w-fit">
                
                {/* التاريخ */}
                <span className="text-xs text-gray-600 mb-4 whitespace-nowrap font-medium bg-white/60 px-2 py-1 rounded-full backdrop-blur-sm">
                  {new Date(event.date).toLocaleDateString('ar-SA', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>

                {/* النقطة التفاعلية */}
                <button
                  className="w-6 h-6 rounded-full border-3 border-white shadow-lg transition-all duration-200 hover:scale-125 relative z-20 hover:shadow-xl ring-2 ring-white/50"
                  style={{ backgroundColor: event.color }}
                  onClick={() => openEvent(event)}
                  onPointerDown={(e) => e.stopPropagation()} // منع تداخل السحب مع النقر
                />

                {/* تفاصيل الحدث */}
                <div className="text-center mt-4 max-w-32">
                  <div className="text-sm font-semibold text-gray-900 whitespace-nowrap mb-1 bg-white/60 px-2 py-1 rounded-lg backdrop-blur-sm">
                    {event.title}
                  </div>
                  <div className="text-xs text-gray-600 whitespace-nowrap opacity-75 bg-white/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {event.department}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
