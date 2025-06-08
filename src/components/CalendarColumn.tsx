
import MainCalendar from './calendar/MainCalendar';

interface CalendarColumnProps {
  isCompressed: boolean;
}

const CalendarColumn = ({ isCompressed }: CalendarColumnProps) => {
  return (
    <div className={`
      ${isCompressed ? 'w-[45%]' : 'w-[55%]'} 
      transition-all duration-500 ease-in-out h-full relative
    `}>
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 calendar-gradient opacity-30 pointer-events-none rounded-3xl" />
      
      <div className="p-4 pt-2 h-full relative z-10">
        <div className="glass rounded-3xl p-2 h-full backdrop-blur-xl border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500">
          <MainCalendar />
        </div>
      </div>
    </div>
  );
};

export default CalendarColumn;
