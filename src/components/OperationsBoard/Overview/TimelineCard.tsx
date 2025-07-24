
import React, { useRef, useEffect, useState } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Plus, Calendar, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface TimelineEvent {
  day: number;
  month: string;
  title: string;
  location: string;
}

const events: TimelineEvent[] = [
  {
    day: 12,
    month: "May",
    title: "الاجتماع النصف سنوي للمراجعة المالية",
    location: "داخلي"
  },
  {
    day: 16,
    month: "May",
    title: "محاضرة العلامة من منظور الجماعة",
    location: "مسك الخيرية"
  },
  {
    day: 20,
    month: "May",
    title: "تسليم النماذج الأولية",
    location: "الخليج للتدريب"
  },
  {
    day: 25,
    month: "May",
    title: "اجتماع لمناقشة الشراكة العرفية",
    location: "جامعة الملك سعود"
  },
  {
    day: 2,
    month: "Jun",
    title: "القابلية الوظيفية",
    location: "داخلي"
  },
  {
    day: 7,
    month: "Jun",
    title: "حفل الترحيب بالموظفين الجدد",
    location: "داخلي"
  }
];

export const TimelineCard: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [customEvents, setCustomEvents] = useState<TimelineEvent[]>([]);
  const [newEventDate, setNewEventDate] = useState<Date>();
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('internal');
  const [customLocation, setCustomLocation] = useState('');

  // دمج الأحداث الثابتة مع الأحداث المضافة وترتيبها زمنياً
  const allEvents = [...events, ...customEvents].sort((a, b) => {
    const dateA = new Date(`${a.month} ${a.day}, 2024`);
    const dateB = new Date(`${b.month} ${b.day}, 2024`);
    return dateA.getTime() - dateB.getTime();
  });

  useEffect(() => {
    const timelineElement = timelineRef.current;
    if (!timelineElement) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scrollAmount = e.deltaY * 2;
      const maxScroll = timelineElement.scrollWidth - timelineElement.clientWidth - 10;
      const newScrollPosition = Math.min(timelineElement.scrollLeft + scrollAmount, maxScroll);
      timelineElement.scrollLeft = newScrollPosition;
    };

    timelineElement.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      timelineElement.removeEventListener('wheel', handleWheel);
    };
  }, [allEvents]);

  const handleAddEvent = () => {
    if (!newEventDate || !newEventTitle) return;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const newEvent: TimelineEvent = {
      day: newEventDate.getDate(),
      month: monthNames[newEventDate.getMonth()],
      title: newEventTitle,
      location: newEventLocation === 'internal' ? 'داخلي' : customLocation
    };

    setCustomEvents(prev => [...prev, newEvent]);
    setShowAddEventModal(false);
    setNewEventDate(undefined);
    setNewEventTitle('');
    setNewEventLocation('internal');
    setCustomLocation('');
  };

  return (
    <>
      <BaseCard 
        variant="glass" 
        size="sm" 
        className="col-span-3 h-[224px] overflow-hidden" 
        style={{ backgroundColor: '#f2ffff' }} 
        header={
          <div className="flex justify-between items-center mb-6">
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

          <div className="flex items-start w-full absolute top-0 left-0 px-12 space-x-40" style={{ top: '42px' }}>
            {allEvents.map((event, idx) => (
              <div key={idx} className="flex flex-row items-center text-right relative">
                {/* البيانات النصية */}
                <div className="flex flex-col items-end space-y-[1px] mr-[2px]">
                  <div className="flex items-baseline space-x-1 font-arabic">
                    <div className="text-[24px] text-black font-bold">{event.day}</div>
                    <div className="text-[10px] text-black">{event.month}</div>
                  </div>
                  <div className="text-[12px] text-black whitespace-nowrap font-arabic">{event.title}</div>
                  <div className="text-[14px] text-black font-bold font-arabic">{event.location}</div>
                </div>

                {/* الخط العمودي والدائرة */}
                <div className="flex flex-col items-center relative" style={{ top: '39px' }}>
                  <div className="w-[1px] h-[42px] bg-black"></div>
                  <div className="w-[40px] h-[40px] bg-[#f3ffff] border border-black rounded-full -mt-[20px]"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseCard>

    <Dialog open={showAddEventModal} onOpenChange={setShowAddEventModal}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl border border-black bg-white">
        <DialogHeader>
          <DialogTitle className="text-black font-arabic text-xl">إضافة حدث جديد</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-black font-arabic">التاريخ</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal rounded-full border-black text-black bg-white hover:bg-gray-50"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {newEventDate ? format(newEventDate, "PPP") : "اختر التاريخ"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={newEventDate}
                  onSelect={setNewEventDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-black font-arabic">عنوان الحدث</label>
            <input
              type="text"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="flex h-10 w-full rounded-full border border-black bg-white px-3 py-2 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              placeholder="أدخل عنوان الحدث"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-black font-arabic">الموقع</label>
            <div className="space-y-3">
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="internal"
                    checked={newEventLocation === 'internal'}
                    onChange={(e) => setNewEventLocation(e.target.value)}
                    className="text-black"
                  />
                  <span className="text-sm text-black font-arabic mr-2">داخلي</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="external"
                    checked={newEventLocation === 'external'}
                    onChange={(e) => setNewEventLocation(e.target.value)}
                    className="text-black"
                  />
                  <span className="text-sm text-black font-arabic mr-2">خارجي</span>
                </label>
              </div>
              {newEventLocation === 'external' && (
                <input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  className="flex h-10 w-full rounded-full border border-black bg-white px-3 py-2 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  placeholder="أدخل اسم الموقع"
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleAddEvent}
            className="flex-1 bg-black text-white rounded-full hover:bg-gray-800"
            disabled={!newEventDate || !newEventTitle || (newEventLocation === 'external' && !customLocation)}
          >
            إضافة الحدث
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowAddEventModal(false)}
            className="flex-1 bg-white/10 backdrop-blur-sm border border-black/20 text-black rounded-full hover:bg-white/20"
          >
            إلغاء
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};
