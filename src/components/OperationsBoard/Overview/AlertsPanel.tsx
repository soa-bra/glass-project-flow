
import React from 'react';
import { MoreHorizontal, Plus, Filter } from 'lucide-react';

interface Alert {
  id: number;
  title: string;
  status: string;
  priority: 'high' | 'medium' | 'low';
}

interface AlertsPanelProps {
  alerts: Alert[];
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'var(--priority-colors-urgent-important)';
      case 'medium': return 'var(--priority-colors-not-urgent-important)';
      case 'low': return 'var(--priority-colors-urgent-not-important)';
      default: return 'var(--priority-colors-not-urgent-not-important)';
    }
  };

  const getStatusIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🔵';
      default: return '⚪';
    }
  };

  return (
    <div className="operations-board-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 font-arabic">التنبيهات</h3>
        <div className="flex gap-2">
          {/* أيقونة دائرية للإضافة */}
          <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
          {/* أيقونة دائرية للفلترة */}
          <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
          {/* أيقونة دائرية للمزيد */}
          <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getPriorityColor(alert.priority) }}
              />
              <div>
                <h4 className="font-bold text-sm font-arabic text-gray-900">{alert.title}</h4>
                <p className="text-xs text-gray-600 font-arabic">{alert.status}</p>
              </div>
            </div>
            <div className="text-lg">
              {getStatusIcon(alert.priority)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <button className="text-sm text-gray-600 hover:text-gray-800 font-arabic transition-colors">
          عرض جميع التنبيهات
        </button>
      </div>
    </div>
  );
};
