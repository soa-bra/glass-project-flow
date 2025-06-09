import MainCalendar from './calendar/MainCalendar';
interface CalendarColumnProps {
  isCompressed: boolean;
}
const CalendarColumn = ({
  isCompressed
}: CalendarColumnProps) => {
  return <div className="h-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden my-0 py-[202px]">
      <MainCalendar />
    </div>;
};
export default CalendarColumn;