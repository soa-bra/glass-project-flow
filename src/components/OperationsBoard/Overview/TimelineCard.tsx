
import React, { useRef, useEffect, useState } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Plus, Calendar, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  location: string;
  isExternal?: boolean;
}

const initialEvents: TimelineEvent[] = [
  {
    id: '1',
    date: new Date(2024, 4, 12), // May 12
    title: "الاجتماع النصف سنوي للمراجعة المالية",
    location: "داخلي"
  },
  {
    id: '2',
    date: new Date(2024, 4, 16), // May 16
    title: "محاضرة العلامة من منظور الجماعة",
    location: "مسك الخيرية",
    isExternal: true
  },
  {
    id: '3',
    date: new Date(2024, 4, 20), // May 20
    title: "تسليم النماذج الأولية",
    location: "الخليج للتدريب",
    isExternal: true
  },
  {
    id: '4',
    date: new Date(2024, 4, 25), // May 25
    title: "اجتماع لمناقشة الشراكة العرفية",
    location: "جامعة الملك سعود",
    isExternal: true
  },
  {
    id: '5',
    date: new Date(2024, 5, 2), // Jun 2
    title: "القابلية الوظيفية",
    location: "داخلي"
  },
  {
    id: '6',
    date: new Date(2024, 5, 7), // Jun 7
    title: "حفل الترحيب بالموظفين الجدد",
    location: "داخلي"
  }
];

export const TimelineCard: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<TimelineEvent[]>(initialEvents);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [eventTitle, setEventTitle] = useState('');
  const [locationType, setLocationType] = useState<'internal' | 'external'>('internal');
  const [externalLocation, setExternalLocation] = useState('');

  // ترتيب الأحداث حسب التاريخ
  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());

  const handleAddEvent = () => {
    if (!selectedDate || !eventTitle.trim()) return;
    
    const newEvent: TimelineEvent = {
      id: Date.now().toString(),
      date: selectedDate,
      title: eventTitle,
      location: locationType === 'internal' ? 'داخلي' : externalLocation,
      isExternal: locationType === 'external'
    };

    setEvents(prev => [...prev, newEvent]);
    
    // إعادة تعيين النموذج
    setSelectedDate(undefined);
    setEventTitle('');
    setLocationType('internal');
    setExternalLocation('');
    setShowAddEventModal(false);
  };

  useEffect(() => {
    const timelineElement = timelineRef.current;
    if (!timelineElement) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scrollAmount = e.deltaY * 2;
      timelineElement.scrollLeft += scrollAmount;
    };

    timelineElement.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      timelineElement.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <>
      <BaseCard 
        variant="glass" 
        size="sm" 
        className="col-span-3 h-[224px] overflow-hidden" 
        style={{ backgroundColor: '#f2ffff' }} 
        header={
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-black font-arabic">الأحداث القادمة</h2>
            <button 
              onClick={() => setShowAddEventModal(true)} 
              className="w-8 h-8 rounded-full flex items-center justify-center text-black transition-all duration-300 border border-black/80 bg-transparent hover:bg-transparent hover:scale-105 active:scale-95"
            >
              <Plus size={16} />
            </button>
          </div>
        }
      >
        <div 
          ref={timelineRef}
          className="relative overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="relative min-w-[2400px] h-[168px]">
            {/* خط التايم لاين */}
            <div className="absolute top-[126px] left-0 w-[200%] h-[1px] bg-black"></div>

            {/* توزيع الأحداث بشكل متساوي */}
            <div className="flex justify-between items-start w-full absolute top-0 left-0 px-12" style={{ top: '42px' }}>
              {sortedEvents.map((event, idx) => (
                <div key={event.id} className="flex flex-row items-center text-right relative flex-shrink-0">
                  {/* البيانات النصية */}
                  <div className="flex flex-col items-end space-y-[1px] mr-[2px]">
                    <div className="flex items-baseline space-x-1 font-arabic">
                      <div className="text-[24px] text-black font-bold">{event.date.getDate()}</div>
                      <div className="text-[10px] text-black">{event.date.toLocaleDateString('en', { month: 'short' })}</div>
                    </div>
                    <div className="text-[12px] text-black whitespace-nowrap font-arabic max-w-[120px] truncate">{event.title}</div>
                    <div className="text-[14px] text-black font-bold font-arabic">{event.location}</div>
                  </div>

                  {/* الخط العمودي والدائرة */}
                  <div className="flex flex-col items-center relative" style={{ top: '38px' }}>
                    <div className="w-[1px] h-[42px] bg-black"></div>
                    <div className="w-[28px] h-[28px] bg-[#f3ffff] border border-black rounded-full -mt-[14px]"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </BaseCard>

      {/* مودال إضافة الحدث */}
      <Dialog open={showAddEventModal} onOpenChange={setShowAddEventModal}>
        <DialogContent 
          className="max-w-3xl max-h-[90vh] p-0 border-0 shadow-none"
          style={{
            background: 'rgba(255,255,255,0.4)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)',
            borderRadius: '24px'
          }}
        >
          <DialogHeader className="flex items-center justify-between p-8 pb-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-black font-arabic">إضافة حدث جديد</DialogTitle>
                <p className="text-sm text-black/70 font-arabic">أضف حدث جديد إلى الجدول الزمني</p>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            <div className="space-y-6">
              {/* تحديد التاريخ */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-black font-arabic">التاريخ</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-right font-normal bg-white/30 border border-black/20 rounded-3xl px-4 py-3 text-black placeholder-black/50 focus:border-black hover:bg-white/40",
                        !selectedDate && "text-black/50"
                      )}
                    >
                      <Calendar className="ml-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>اختر التاريخ</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* عنوان الحدث */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-black font-arabic">عنوان الحدث</label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="أدخل عنوان الحدث"
                  className="w-full bg-white/30 border border-black/20 rounded-3xl px-4 py-3 text-black placeholder-black/50 focus:border-black focus:outline-none font-arabic"
                />
              </div>

              {/* نوع الموقع */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-black font-arabic">الموقع</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setLocationType('internal')}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-3xl font-arabic font-medium transition-all",
                      locationType === 'internal'
                        ? "bg-black text-white"
                        : "bg-white/30 border border-black/20 text-black hover:bg-white/40"
                    )}
                  >
                    داخلي
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocationType('external')}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-3xl font-arabic font-medium transition-all",
                      locationType === 'external'
                        ? "bg-black text-white"
                        : "bg-white/30 border border-black/20 text-black hover:bg-white/40"
                    )}
                  >
                    خارجي
                  </button>
                </div>
              </div>

              {/* موقع خارجي */}
              {locationType === 'external' && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black font-arabic">تفاصيل الموقع</label>
                  <input
                    type="text"
                    value={externalLocation}
                    onChange={(e) => setExternalLocation(e.target.value)}
                    placeholder="أدخل اسم الموقع الخارجي"
                    className="w-full bg-white/30 border border-black/20 rounded-3xl px-4 py-3 text-black placeholder-black/50 focus:border-black focus:outline-none font-arabic"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-8 pt-0">
            <Button
              type="button"
              onClick={() => setShowAddEventModal(false)}
              className="px-6 py-3 bg-white/30 hover:bg-white/40 border border-black/20 rounded-full text-black font-medium font-arabic"
            >
              إلغاء
            </Button>
            <Button
              type="button"
              onClick={handleAddEvent}
              disabled={!selectedDate || !eventTitle.trim() || (locationType === 'external' && !externalLocation.trim())}
              className="px-6 py-3 bg-black hover:bg-black/90 rounded-full text-white font-medium font-arabic disabled:opacity-50 disabled:cursor-not-allowed"
            >
              إضافة الحدث
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
