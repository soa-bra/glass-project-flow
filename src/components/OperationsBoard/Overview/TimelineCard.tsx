import React, { useRef, useEffect, useState } from 'react';
import { SoaCard, SoaTypography, SoaIcon } from '@/components/ui';
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
    <SoaCard className="col-span-3 h-80 overflow-hidden bg-soabra-panel">
      <div className="flex items-center justify-between mb-6">
        <SoaTypography variant="title" className="text-soabra-ink">
          الأحداث القادمة
        </SoaTypography>
        <SoaIcon 
          icon={Plus} 
          onClick={() => setShowAddEventModal(true)}
          className="cursor-pointer hover:bg-soabra-ink-30"
        />
      </div>

      <div 
        ref={timelineRef} 
        className="relative overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden" 
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <div className="relative min-w-[2400px] h-60 py-0 my-0 px-60">
          {/* خط التايم لاين */}
          <div className="absolute top-44 left-0 w-[200%] h-px bg-soabra-ink"></div>

          <div className="flex items-start justify-between w-full absolute top-0 left-0 px-12" style={{
            top: '60px'
          }}>
            {eventsList.map((event, idx) => (
              <div key={idx} className="flex flex-row items-center text-right relative">
                {/* البيانات النصية */}
                <div className="flex flex-col items-end space-y-px mr-0.5">
                  <div className="flex items-baseline space-x-1">
                    <SoaTypography variant="title" className="text-soabra-ink">
                      {event.day}
                    </SoaTypography>
                    <SoaTypography variant="label" className="text-soabra-ink">
                      {event.month}
                    </SoaTypography>
                  </div>
                  <SoaTypography variant="label" className="text-soabra-ink whitespace-nowrap">
                    {event.title}
                  </SoaTypography>
                  <SoaTypography variant="body" className="text-soabra-ink font-semibold">
                    {event.location}
                  </SoaTypography>
                </div>

                {/* الخط العمودي والدائرة */}
                <div className="flex flex-col items-center relative" style={{
                  top: '55px'
                }}>
                  <div className="w-px h-16 bg-soabra-ink"></div>
                  <div className="w-10 h-10 bg-soabra-panel border border-soabra-ink rounded-full -mt-5"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SoaCard>

    {/* نافذة إضافة حدث جديد */}
    <Dialog open={showAddEventModal} onOpenChange={setShowAddEventModal}>
      <DialogContent className="max-w-3xl max-h-[90vh] rounded-panel p-0 border-0 bg-[rgba(255,255,255,0.65)] backdrop-blur-[18px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-[rgba(255,255,255,0.6)] z-[9999]">
        <DialogHeader className="flex items-center justify-between p-6 border-b border-soabra-border">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-soabra-ink rounded-full flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-soabra-white" />
            </div>
            <DialogTitle>
              <SoaTypography variant="title" className="text-soabra-ink">
                إضافة حدث جديد
              </SoaTypography>
            </DialogTitle>
          </div>
          <SoaIcon 
            icon={X} 
            onClick={() => setShowAddEventModal(false)}
            className="cursor-pointer hover:bg-soabra-ink-30"
          />
        </DialogHeader>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* تاريخ الحدث */}
          <div className="space-y-2">
            <SoaTypography variant="subtitle" className="text-soabra-ink">
              التاريخ
            </SoaTypography>
            <Popover>
              <PopoverTrigger asChild>
                <button className={cn(
                  "w-full px-4 py-3 rounded-panel bg-soabra-white/30 border border-soabra-border focus:border-soabra-ink text-soabra-ink text-right transition-colors font-arabic",
                  !newEventDate && "text-soabra-ink-60"
                )}>
                  <CalendarIcon className="inline w-4 h-4 ml-2" />
                  {newEventDate ? format(newEventDate, "PPP") : "اختر تاريخ الحدث"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[10000]" align="start">
                <Calendar 
                  mode="single" 
                  selected={newEventDate} 
                  onSelect={setNewEventDate} 
                  initialFocus 
                  className="p-3 pointer-events-auto" 
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* عنوان الحدث */}
          <div className="space-y-2">
            <SoaTypography variant="subtitle" className="text-soabra-ink">
              عنوان الحدث
            </SoaTypography>
            <input 
              type="text" 
              value={newEventTitle} 
              onChange={e => setNewEventTitle(e.target.value)} 
              placeholder="أدخل عنوان الحدث" 
              className="w-full px-4 py-3 rounded-panel bg-soabra-white/30 border border-soabra-border focus:border-soabra-ink text-soabra-ink placeholder-soabra-ink-60 text-right transition-colors outline-none font-arabic" 
            />
          </div>

          {/* موقع الحدث */}
          <div className="space-y-2">
            <SoaTypography variant="subtitle" className="text-soabra-ink">
              الموقع
            </SoaTypography>
            <div className="space-y-3">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="location" 
                    value="داخلي" 
                    checked={newEventLocation === 'داخلي'} 
                    onChange={e => setNewEventLocation(e.target.value)} 
                    className="w-4 h-4" 
                  />
                  <SoaTypography variant="body" className="text-soabra-ink">
                    داخلي
                  </SoaTypography>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="location" 
                    value="خارجي" 
                    checked={newEventLocation === 'خارجي'} 
                    onChange={e => setNewEventLocation(e.target.value)} 
                    className="w-4 h-4" 
                  />
                  <SoaTypography variant="body" className="text-soabra-ink">
                    خارجي
                  </SoaTypography>
                </label>
              </div>
              
              {newEventLocation === 'خارجي' && (
                <input 
                  type="text" 
                  value={customLocation} 
                  onChange={e => setCustomLocation(e.target.value)} 
                  placeholder="أدخل الموقع الخارجي" 
                  className="w-full px-4 py-3 rounded-panel bg-soabra-white/30 border border-soabra-border focus:border-soabra-ink text-soabra-ink placeholder-soabra-ink-60 text-right transition-colors outline-none font-arabic" 
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-soabra-border">
          <button 
            onClick={() => setShowAddEventModal(false)} 
            className="px-6 py-3 bg-soabra-white/30 hover:bg-soabra-white/40 border border-soabra-border rounded-chip text-soabra-ink font-medium transition-colors font-arabic"
          >
            إلغاء
          </button>
          <button 
            onClick={handleAddEvent} 
            disabled={!newEventDate || !newEventTitle.trim()} 
            className="px-6 py-3 bg-soabra-ink hover:bg-soabra-ink-80 rounded-chip text-soabra-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-arabic"
          >
            إضافة الحدث
          </button>
        </div>
      </DialogContent>
    </Dialog>
  </>;
};