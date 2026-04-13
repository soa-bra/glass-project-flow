import React, { useRef, useEffect, useState } from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
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
  day: 12, month: "May", title: "الاجتماع النصف سنوي للمراجعة المالية", location: "داخلي"
}, {
  day: 16, month: "May", title: "محاضرة العلامة من منظور الجماعة", location: "مسك الخيرية"
}, {
  day: 20, month: "May", title: "تسليم النماذج الأولية", location: "الخليج للتدريب"
}, {
  day: 25, month: "May", title: "اجتماع لمناقشة الشراكة العرفية", location: "جامعة الملك سعود"
}, {
  day: 2, month: "Jun", title: "القابلية الوظيفية", location: "داخلي"
}, {
  day: 7, month: "Jun", title: "حفل الترحيب بالموظفين الجدد", location: "داخلي"
}];

export const TimelineBox: React.FC = () => {
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
      timelineElement.scrollLeft += e.deltaY * 2;
    };
    timelineElement.addEventListener('wheel', handleWheel, { passive: false });
    return () => { timelineElement.removeEventListener('wheel', handleWheel); };
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
      <BaseBox variant="standard" size="sm" className="col-span-3 h-[320px] overflow-hidden"
        header={<div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-[hsl(var(--ink))] font-arabic">الأحداث القادمة</h2>
            <button onClick={() => setShowAddEventModal(true)} className="w-8 h-8 rounded-full flex items-center justify-center text-[hsl(var(--ink))] transition-all duration-300 border border-[hsl(var(--ink))]/80 bg-transparent hover:bg-transparent hover:scale-105 active:scale-95">
              <Plus size={16} />
            </button>
          </div>}>
        <div ref={timelineRef} className="relative overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="relative min-w-[2400px] h-[240px] px-[240px]">
            <div className="absolute top-[180px] left-0 w-[200%] h-[1px] bg-[hsl(var(--ink))]"></div>
            <div className="flex items-start justify-between w-full absolute top-0 left-0 px-12" style={{ top: '60px' }}>
              {eventsList.map((event, idx) => <div key={idx} className="flex flex-row items-center text-right relative">
                  <div className="flex flex-col items-end space-y-[1px] mr-[2px]">
                    <div className="flex items-baseline space-x-1 font-arabic">
                      <div className="text-[24px] text-[hsl(var(--ink))] font-bold">{event.day}</div>
                      <div className="text-[10px] text-[hsl(var(--ink))]">{event.month}</div>
                    </div>
                    <div className="text-[12px] text-[hsl(var(--ink))] whitespace-nowrap font-arabic">{event.title}</div>
                    <div className="text-[14px] text-[hsl(var(--ink))] font-bold font-arabic">{event.location}</div>
                  </div>
                  <div className="flex flex-col items-center relative" style={{ top: '55px' }}>
                    <div className="w-[1px] h-[60px] bg-[hsl(var(--ink))]"></div>
                    <div className="w-[40px] h-[40px] bg-white border border-[hsl(var(--ink))] rounded-full -mt-[20px]"></div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </BaseBox>

      {/* Modal — keeps glass styling (overlay surface) */}
      <Dialog open={showAddEventModal} onOpenChange={setShowAddEventModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] rounded-[24px] p-0 border-0 bg-transparent shadow-none overflow-hidden" style={{
        background: 'rgba(255,255,255,0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)',
        zIndex: '9999'
      }}>
          <DialogHeader className="flex items-center justify-between p-6 border-b border-[hsl(var(--ink))]/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[hsl(var(--ink))] rounded-full flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
              <DialogTitle className="text-xl font-bold text-[hsl(var(--ink))] font-arabic">إضافة حدث جديد</DialogTitle>
            </div>
            <button onClick={() => setShowAddEventModal(false)} className="w-8 h-8 rounded-full bg-transparent hover:bg-[hsl(var(--ink))]/5 flex items-center justify-center text-[hsl(var(--ink))] transition-colors border border-[hsl(var(--ink))]">
              <X size={16} />
            </button>
          </DialogHeader>

          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="space-y-2">
              <label className="font-bold text-[hsl(var(--ink))] font-arabic">التاريخ</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className={cn("w-full px-4 py-3 rounded-3xl bg-white/30 border border-[hsl(var(--ink))]/20 focus:border-[hsl(var(--ink))] text-[hsl(var(--ink))] placeholder-[hsl(var(--ink))]/50 text-right font-arabic transition-colors", !newEventDate && "text-[hsl(var(--ink))]/50")}>
                    <CalendarIcon className="inline w-4 h-4 ml-2" />
                    {newEventDate ? format(newEventDate, "PPP") : "اختر تاريخ الحدث"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[10000]" align="start">
                  <Calendar mode="single" selected={newEventDate} onSelect={setNewEventDate} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-[hsl(var(--ink))] font-arabic">عنوان الحدث</label>
              <input type="text" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} placeholder="أدخل عنوان الحدث" className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-[hsl(var(--ink))]/20 focus:border-[hsl(var(--ink))] text-[hsl(var(--ink))] placeholder-[hsl(var(--ink))]/50 text-right font-arabic transition-colors outline-none" />
            </div>

            <div className="space-y-2">
              <label className="font-bold text-[hsl(var(--ink))] font-arabic">الموقع</label>
              <div className="flex items-center gap-3">
                <div className="flex bg-transparent border border-[hsl(var(--ink))]/10 rounded-full p-1">
                  <button onClick={() => setNewEventLocation('داخلي')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors font-arabic ${newEventLocation === 'داخلي' ? 'bg-[hsl(var(--ink))] text-white' : 'text-[hsl(var(--ink))] hover:bg-[hsl(var(--ink))]/5'}`}>داخلي</button>
                  <button onClick={() => setNewEventLocation('خارجي')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors font-arabic ${newEventLocation === 'خارجي' ? 'bg-[hsl(var(--ink))] text-white' : 'text-[hsl(var(--ink))] hover:bg-[hsl(var(--ink))]/5'}`}>خارجي</button>
                </div>
                {newEventLocation === 'خارجي' && <input type="text" value={customLocation} onChange={e => setCustomLocation(e.target.value)} placeholder="أدخل الموقع الخارجي" className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-[hsl(var(--ink))]/20 focus:border-[hsl(var(--ink))] text-[hsl(var(--ink))] placeholder-[hsl(var(--ink))]/50 text-right font-arabic transition-colors outline-none" />}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-[hsl(var(--ink))]/10">
            <button onClick={() => setShowAddEventModal(false)} className="px-6 py-3 bg-white/30 hover:bg-white/40 border border-[hsl(var(--ink))]/20 rounded-full text-[hsl(var(--ink))] font-medium font-arabic transition-colors">إلغاء</button>
            <button onClick={handleAddEvent} disabled={!newEventDate || !newEventTitle.trim()} className="px-6 py-3 bg-[hsl(var(--ink))] hover:bg-[hsl(var(--ink))]/90 rounded-full text-white font-medium font-arabic transition-colors disabled:opacity-70 disabled:cursor-not-allowed">إضافة الحدث</button>
          </div>
        </DialogContent>
      </Dialog>
    </>;
};
