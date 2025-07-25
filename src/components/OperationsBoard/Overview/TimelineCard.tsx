import React, { useRef, useEffect, useState } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Plus, CalendarIcon, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
interface TimelineEvent {
  day: number;
  month: string;
  title: string;
  location: string;
  date?: Date;
}
const events: TimelineEvent[] = [{
  day: 12,
  month: "May",
  title: "الاجتماع النصف سنوي للمراجعة المالية",
  location: "داخلي"
}, {
  day: 16,
  month: "May",
  title: "محاضرة العلامة من منظور الجماعة",
  location: "مسك الخيرية"
}, {
  day: 20,
  month: "May",
  title: "تسليم النماذج الأولية",
  location: "الخليج للتدريب"
}, {
  day: 25,
  month: "May",
  title: "اجتماع لمناقشة الشراكة العرفية",
  location: "جامعة الملك سعود"
}, {
  day: 2,
  month: "Jun",
  title: "القابلية الوظيفية",
  location: "داخلي"
}, {
  day: 7,
  month: "Jun",
  title: "حفل الترحيب بالموظفين الجدد",
  location: "داخلي"
}];
export const TimelineCard: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [eventsList, setEventsList] = useState<TimelineEvent[]>(events);
  const [newEventDate, setNewEventDate] = useState<Date>();
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('داخلي');
  const [customLocation, setCustomLocation] = useState('');
  useEffect(() => {
    const timelineElement = timelineRef.current;
    if (!timelineElement) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scrollAmount = e.deltaY * 2;
      timelineElement.scrollLeft += scrollAmount;
    };
    timelineElement.addEventListener('wheel', handleWheel, {
      passive: false
    });
    return () => {
      timelineElement.removeEventListener('wheel', handleWheel);
    };
  }, []);
  const handleAddEvent = () => {
    if (!newEventDate || !newEventTitle.trim()) return;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const newEvent: TimelineEvent = {
      day: newEventDate.getDate(),
      month: monthNames[newEventDate.getMonth()],
      title: newEventTitle.trim(),
      location: newEventLocation === 'خارجي' ? customLocation.trim() : newEventLocation,
      date: newEventDate
    };

    // إضافة الحدث وترتيب القائمة زمنياً
    const updatedEvents = [...eventsList, newEvent].sort((a, b) => {
      const dateA = a.date || new Date(`${a.month} ${a.day}, 2024`);
      const dateB = b.date || new Date(`${b.month} ${b.day}, 2024`);
      return dateA.getTime() - dateB.getTime();
    });
    setEventsList(updatedEvents);
    setShowAddEventModal(false);
    setNewEventDate(undefined);
    setNewEventTitle('');
    setNewEventLocation('داخلي');
    setCustomLocation('');
  };
  return <>
      <BaseCard variant="glass" size="sm" className="col-span-3 h-[220px] overflow-hidden" style={{
      backgroundColor: '#f2ffff'
    }} header={<div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-black font-arabic">الأحداث القادمة</h2>
            <button onClick={() => setShowAddEventModal(true)} className="w-8 h-8 rounded-full flex items-center justify-center text-black transition-all duration-300 border border-black/80 bg-transparent hover:bg-transparent hover:scale-105 active:scale-95">
              <Plus size={16} />
            </button>
          </div>}>
        <div ref={timelineRef} className="relative overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden" style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
          
          <div className=" relative min-w-[2400px]  h-[120px]">
            {/* خط التايم لاين */}
            <div className="absolute top-[110px] left-0 w-[200%] h-[1px] bg-black my-0"></div>

            <div style={{
            top: '60px'
          }} className="bottom-25 flex items-start justify-between w-full absolute top-0 left-0 mx-0 my-[20px] px-[150px]">
              {eventsList.map((event, idx) => <div key={idx} className="bottom-1 flex flex-row items-center text-right relative">
                  {/* البيانات النصية */}
                  <div className="flex flex-col items-end space-y-[-80px] mr-[5px]">
                    <div className="flex items-baseline space-x-1 font-arabic">
                      <div className="text-[24px] text-black font-bold mx-[10px]">{event.day}</div>
                      <div className="text-[10px] text-black">{event.month}</div>
                    </div>
                    <div className="text-[12px] text-black whitespace-nowrap font-arabic my-0">{event.title}</div>
                    <div className="text-[14px] text-black font-bold font-arabic my-0">{event.location}</div>
                  </div>

                  {/* الخط العمودي والدائرة */}
                  <div style={{
                top: '55px'
              }} className="flex flex-col items-center relative mx-0 my-[25px] px-0">
                    <div className="w-[1px] h-[60px] bg-black"></div>
                    <div className="w-[40px] h-[40px] bg-[#f3ffff] border border-black rounded-full -mt-[20px]"></div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </BaseCard>

      {/* نافذة إضافة حدث جديد */}
      <Dialog open={showAddEventModal} onOpenChange={setShowAddEventModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] rounded-[24px] p-0 border-0 bg-transparent shadow-none overflow-hidden" style={{
        background: 'rgba(255,255,255,0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)',
        zIndex: '9999'
      }}>
          <DialogHeader className="flex items-center justify-between p-6 border-b border-black/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
              <DialogTitle className="text-xl font-bold text-black font-arabic">إضافة حدث جديد</DialogTitle>
            </div>
            <button onClick={() => setShowAddEventModal(false)} className="w-8 h-8 rounded-full bg-transparent hover:bg-black/5 flex items-center justify-center text-black transition-colors">
              <X size={16} />
            </button>
          </DialogHeader>

          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* تاريخ الحدث */}
            <div className="space-y-2">
              <label className="font-bold text-black font-arabic">التاريخ</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className={cn("w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors", !newEventDate && "text-black/50")}>
                    <CalendarIcon className="inline w-4 h-4 ml-2" />
                    {newEventDate ? format(newEventDate, "PPP") : "اختر تاريخ الحدث"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[10000]" align="start">
                  <Calendar mode="single" selected={newEventDate} onSelect={setNewEventDate} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>

            {/* عنوان الحدث */}
            <div className="space-y-2">
              <label className="font-bold text-black font-arabic">عنوان الحدث</label>
              <input type="text" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} placeholder="أدخل عنوان الحدث" className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none" />
            </div>

            {/* موقع الحدث */}
            <div className="space-y-2">
              <label className="font-bold text-black font-arabic">الموقع</label>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="location" value="داخلي" checked={newEventLocation === 'داخلي'} onChange={e => setNewEventLocation(e.target.value)} className="w-4 h-4" />
                    <span className="text-black font-arabic">داخلي</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="location" value="خارجي" checked={newEventLocation === 'خارجي'} onChange={e => setNewEventLocation(e.target.value)} className="w-4 h-4" />
                    <span className="text-black font-arabic">خارجي</span>
                  </label>
                </div>
                
                {newEventLocation === 'خارجي' && <input type="text" value={customLocation} onChange={e => setCustomLocation(e.target.value)} placeholder="أدخل الموقع الخارجي" className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none" />}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-black/10">
            <button onClick={() => setShowAddEventModal(false)} className="px-6 py-3 bg-white/30 hover:bg-white/40 border border-black/20 rounded-full text-black font-medium font-arabic transition-colors">
              إلغاء
            </button>
            <button onClick={handleAddEvent} disabled={!newEventDate || !newEventTitle.trim()} className="px-6 py-3 bg-black hover:bg-black/90 rounded-full text-white font-medium font-arabic transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              إضافة الحدث
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>;
};