import MainCalendar from './calendar/MainCalendar';
interface CalendarColumnProps {
  isCompressed: boolean;
}
const CalendarColumn = ({
  isCompressed
}: CalendarColumnProps) => {
  return <div className={`
      ${isCompressed ? 'w-[45%]' : 'w-[55%]'} 
      transition-all duration-500 ease-in-out h-full relative
    `}>
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 calendar-gradient opacity-30 pointer-events-none rounded-3xl" />
      
      <div className="p-[20px] h-full relative z-10 rounded-lg mx-0 px-[10px]">
        <div className="glass rounded-3xl h-full backdrop-blur-xl border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 py-[15px] my-[130px] mx-0 px-[96px]">
          <MainCalendar />
        </div>
      </div>
    </div>;
};
export default CalendarColumn;