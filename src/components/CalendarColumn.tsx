import MainCalendar from './calendar/MainCalendar';
interface CalendarColumnProps {
  isCompressed: boolean;
}
const CalendarColumn = ({
  isCompressed
}: CalendarColumnProps) => {
  return <div className="h-full rounded-t-2xl shadow-lg border border-gray-100 overflow-hidden bg-violet-50 py-[17px] my-[57px] px-0">
      {/* Calendar Header */}
      <div className="p-6 border-b border-gray-100 bg-white rounded-t-2xl my-[46px] py-[22px] px-[64px]">
        <div className="flex items-center justify-between my-0 py-0">
          <h2 className="text-2xl font-bold text-soabra-text-primary">التقويم</h2>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-soabra-primary-blue text-white rounded-lg hover:bg-soabra-primary-blue-hover transition-colors">
                شهر
              </button>
              <button className="px-3 py-1 text-sm text-soabra-text-secondary hover:bg-white/20 rounded-lg transition-colors">
                أسبوع
              </button>
              <button className="px-3 py-1 text-sm text-soabra-text-secondary hover:bg-white/20 rounded-lg transition-colors">
                يوم
              </button>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <span className="text-soabra-text-secondary">🔄</span>
              </button>
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <span className="text-soabra-text-secondary">⚙️</span>
              </button>
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <span className="text-soabra-text-secondary">➕</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Glass Calendar Container */}
      <div className="p-3 py-0 my-0">
        <div className="glass rounded-xl p-4 h-[calc(100vh-200px)] px-[27px] py-[76px] my-[5px]">
          <MainCalendar />
        </div>
      </div>
    </div>;
};
export default CalendarColumn;