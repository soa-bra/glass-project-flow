
import React, { useRef, useState, useCallback } from 'react';
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

  // نظام السحب المحسن باستخدام Pointer Events
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!scrollRef.current) return;
    
    // التقاط المؤشر لضمان تتبع الحركة حتى خارج العنصر
    (e.target as Element).setPointerCapture(e.pointerId);
    
    setIsDragging(true);
    setStartX(e.clientX);
    setScrollLeft(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = 'grabbing';
    
    // منع السلوك الافتراضي والتمرير العمودي
    e.preventDefault();
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !scrollRef.current) return;
    
    e.preventDefault();
    
    // حساب المسافة الأفقية فقط
    const deltaX = e.clientX - startX;
    const newScrollLeft = scrollLeft - deltaX;
    
    // تطبيق التمرير الأفقي
    scrollRef.current.scrollLeft = newScrollLeft;
  }, [isDragging, startX, scrollLeft]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!scrollRef.current) return;
    
    // تحرير التقاط المؤشر
    (e.target as Element).releasePointerCapture(e.pointerId);
    
    setIsDragging(false);
    scrollRef.current.style.cursor = 'grab';
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
    }
  }, []);

  return (
    <div className={`
      ${className}
      rounded-3xl p-5
      bg-white/80 backdrop-blur-xl border border-white/30
      shadow-lg hover:shadow-xl transition-all duration-300
      flex flex-col
    `}>
      
      {/* رأس البطاقة */}
      <header className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-arabic font-bold text-gray-800">
          الأحداث القادمة
        </h3>
        
        {/* أزرار التنقل */}
        <div className="flex gap-2">
          <button 
            onClick={() => scroll(200)}
            className="p-2 rounded-full bg-white/40 hover:bg-white/60 transition-colors backdrop-blur-sm"
          >
            <ChevronRight size={16} />
          </button>
          <button 
            onClick={() => scroll(-200)}
            className="p-2 rounded-full bg-white/40 hover:bg-white/60 transition-colors backdrop-blur-sm"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </header>

      {/* خط الزمن المستمر القابل للسحب الأفقي فقط */}
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={scrollRef}
          className="
            overflow-x-auto overflow-y-hidden scrollbar-hide
            cursor-grab active:cursor-grabbing select-none
            h-full flex items-center relative
          "
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            touchAction: 'pan-x' // السماح بالسحب الأفقي فقط على الأجهزة اللمسية
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
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
