
import React, { useState } from 'react';
import { Plus, MoreHorizontal, Star } from 'lucide-react';

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
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="operations-board-card mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 font-arabic">التنبيهات</h3>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Star className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {alerts.slice(0, isExpanded ? alerts.length : 3).map((alert) => (
          <div key={alert.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div 
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: alert.priority === 'high' 
                    ? 'var(--priority-colors-urgent-important)' 
                    : alert.priority === 'medium' 
                    ? 'var(--priority-colors-not-urgent-important)' 
                    : 'var(--status-colors-on-plan)'
                }}
              ></div>
              <span className="font-arabic text-sm">{alert.title}</span>
            </div>
            <span className="text-xs text-gray-500 font-arabic">{alert.status}</span>
          </div>
        ))}
      </div>
      
      {alerts.length > 3 && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-3 text-center text-sm text-blue-600 hover:text-blue-800 font-arabic"
        >
          {isExpanded ? 'عرض أقل' : 'عرض المزيد'}
        </button>
      )}
    </div>
  );
};
