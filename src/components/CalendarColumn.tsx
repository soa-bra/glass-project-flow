
import MainCalendar from './calendar/MainCalendar';

interface CalendarColumnProps {
  isCompressed: boolean;
}

const CalendarColumn = ({ isCompressed }: CalendarColumnProps) => {
  return (
    <div className={`
      ${isCompressed ? 'w-[45%]' : 'w-[55%]'} 
      transition-all duration-300 h-full
    `}>
      <div className="p-4 h-full">
        <MainCalendar />
      </div>
    </div>
  );
};

export default CalendarColumn;
