
import React, { useRef, useEffect, useState } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface TimelineEvent {
  day: number;
  month: string;
  title: string;
  location: string;
  date: Date;
}

const initialEvents: TimelineEvent[] = [
  {
    day: 12,
    month: "May",
    title: "الاجتماع النصف سنوي للمراجعة المالية",
    location: "داخلي",
    date: new Date(2024, 4, 12) // May 12, 2024
  },
  {
    day: 16,
    month: "May",
    title: "محاضرة العلامة من منظور الجماعة",
    location: "مسك الخيرية",
    date: new Date(2024, 4, 16)
  },
  {
    day: 20,
    month: "May",
    title: "تسليم النماذج الأولية",
    location: "الخليج للتدريب",
    date: new Date(2024, 4, 20)
  },
  {
    day: 25,
    month: "May",
    title: "اجتماع لمناقشة الشراكة العرفية",
    location: "جامعة الملك سعود",
    date: new Date(2024, 4, 25)
  },
  {
    day: 2,
    month: "Jun",
    title: "القابلية الوظيفية",
    location: "داخلي",
    date: new Date(2024, 5, 2) // June 2, 2024
  },
  {
    day: 7,
    month: "Jun",
    title: "حفل الترحيب بالموظفين الجدد",
    location: "داخلي",
    date: new Date(2024, 5, 7)
  }
];

export const TimelineCard: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<TimelineEvent[]>(initialEvents);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [eventTitle, setEventTitle] = useState('');
  const [locationType, setLocationType] = useState<'internal' | 'external'>('internal');
  const [customLocation, setCustomLocation] = useState('');

  const sortedEvents = events.sort((a, b) => a.date.getTime() - b.date.getTime());

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

  const handleAddEvent = () => {
    if (!selectedDate || !eventTitle) return;

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const newEvent: TimelineEvent = {
      day: selectedDate.getDate(),
      month: monthNames[selectedDate.getMonth()],
      title: eventTitle,
      location: locationType === 'internal' ? 'داخلي' : customLocation,
      date: selectedDate
    };

    setEvents([...events, newEvent]);
    
    // Reset form
    setSelectedDate(undefined);
    setEventTitle('');
    setLocationType('internal');
    setCustomLocation('');
    setShowAddEventModal(false);
  };

  const eventContainerWidth = Math.max(1200, sortedEvents.length * 200 + 400);

  return (
    <>
      <BaseCard 
        variant="glass" 
        size="sm" 
        className="col-span-3 h-[128px] overflow-hidden" 
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
          <div className="relative h-[96px]" style={{ width: `${eventContainerWidth}px` }}>
            {/* خط التايم لاين */}
            <div className="absolute top-[72px] left-0 right-12 h-[1px] bg-black"></div>

            <div className="flex items-start absolute top-0 left-0 px-12 space-x-40" style={{ top: '24px' }}>
              {sortedEvents.map((event, idx) => (
                <div key={idx} className="flex flex-row items-center text-right relative">
                  {/* البيانات النصية */}
                  <div className="flex flex-col items-end space-y-[1px] mr-[2px]">
                    <div className="flex items-baseline space-x-1 font-arabic">
                      <div className="text-[16px] text-black font-bold">{event.day}</div>
                      <div className="text-[8px] text-black">{event.month}</div>
                    </div>
                    <div className="text-[10px] text-black whitespace-nowrap font-arabic">{event.title}</div>
                    <div className="text-[10px] text-black font-bold font-arabic">{event.location}</div>
                  </div>

                  {/* الخط العمودي والدائرة */}
                  <div className="flex flex-col items-center relative" style={{ top: '22px' }}>
                    <div className="w-[1px] h-[24px] bg-black"></div>
                    <div className="w-[16px] h-[16px] bg-[#f3ffff] border border-black rounded-full -mt-[8px]"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </BaseCard>

      <Dialog open={showAddEventModal} onOpenChange={setShowAddEventModal}>
        <DialogContent className="glass-modal w-full max-w-md mx-auto rounded-xl border border-black/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium text-black font-arabic text-right">إضافة حدث جديد</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-6">
            {/* Date Picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-black font-arabic block text-right">التاريخ</label>
              <div className="relative">
                <button
                  onClick={() => {}}
                  className="w-full h-10 px-3 py-2 bg-transparent border border-black rounded-lg text-right text-black focus:outline-none focus:ring-2 focus:ring-black/20 flex items-center justify-between"
                >
                  <CalendarIcon className="h-4 w-4 text-black" />
                  <span className="font-arabic">
                    {selectedDate ? format(selectedDate, 'yyyy/MM/dd') : 'اختر التاريخ'}
                  </span>
                </button>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="absolute top-12 left-0 z-50 bg-white border border-black rounded-lg p-3 pointer-events-auto shadow-lg"
                />
              </div>
            </div>

            {/* Event Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-black font-arabic block text-right">الحدث</label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full h-10 px-3 py-2 bg-transparent border border-black rounded-lg text-right text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-black/20 font-arabic"
                placeholder="عنوان الحدث"
              />
            </div>

            {/* Location Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-black font-arabic block text-right">الموقع</label>
              <Select value={locationType} onValueChange={(value: 'internal' | 'external') => setLocationType(value)}>
                <SelectTrigger className="w-full bg-transparent border border-black rounded-lg text-black focus:ring-2 focus:ring-black/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">داخلي</SelectItem>
                  <SelectItem value="external">خارجي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Location (if external) */}
            {locationType === 'external' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-black font-arabic block text-right">اسم الموقع</label>
                <input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  className="w-full h-10 px-3 py-2 bg-transparent border border-black rounded-lg text-right text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-black/20 font-arabic"
                  placeholder="اسم الموقع"
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowAddEventModal(false)}
                className="flex-1 h-10 px-4 py-2 bg-white/20 border border-black/20 rounded-lg text-black font-medium transition-all duration-200 hover:bg-white/30 font-arabic"
              >
                إلغاء
              </button>
              <button
                onClick={handleAddEvent}
                disabled={!selectedDate || !eventTitle || (locationType === 'external' && !customLocation)}
                className="flex-1 h-10 px-4 py-2 bg-black rounded-lg text-white font-medium transition-all duration-200 hover:bg-black/90 disabled:bg-black/50 disabled:cursor-not-allowed font-arabic"
              >
                إضافة
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
