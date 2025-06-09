
import MainCalendar from './calendar/MainCalendar';
import { RefreshCw, Plus, Filter } from 'lucide-react';

interface CalendarColumnProps {
  isCompressed: boolean;
}

const CalendarColumn = ({ isCompressed }: CalendarColumnProps) => {
  return (
    <div 
      className="h-full overflow-hidden" 
      style={{ 
        height: '90%',
        background: 'linear-gradient(135deg, #E8F2FE 0%, #F9DBF8 50%, #DAD4FC 100%)'
      }}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-2xl font-medium text-soabra-text-primary">التقويم</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4 text-soabra-text-primary" />
            </button>
            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <Filter className="w-4 h-4 text-soabra-text-primary" />
            </button>
            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <Plus className="w-4 h-4 text-soabra-text-primary" />
            </button>
          </div>
        </div>

        {/* Glass Card Container */}
        <div className="flex-1 mx-3 mb-3 bg-white/30 backdrop-blur-md rounded-lg border border-white/40 shadow-lg overflow-hidden">
          <MainCalendar />
        </div>
      </div>
    </div>
  );
};

export default CalendarColumn;
