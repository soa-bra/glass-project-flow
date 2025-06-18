
import React, { useState } from 'react';
import { Plus, MoreHorizontal, Star } from 'lucide-react';
import { CircularIconButton } from '@/components/ui/CircularIconButton';

interface Alert {
  id: number;
  title: string;
  status: string;
  priority: 'high' | 'medium' | 'low';
}

interface AlertsPanelProps {
  alerts: Alert[];
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#f1b5b9';
      case 'medium':
        return '#fbe2aa';
      case 'low':
        return '#bdeed3';
      default:
        return '#d9d2fd';
    }
  };

  return (
    <div className="h-full flex flex-col p-4 rounded-lg bg-white/40 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold font-arabic">التنبيهات</h3>
        <div className="flex items-center gap-2">
          <CircularIconButton icon={Plus} size="sm" />
          <CircularIconButton icon={MoreHorizontal} size="sm" />
        </div>
      </div>
      
      <div className="flex-1 space-y-3">
        {alerts.slice(0, isExpanded ? alerts.length : 3).map(alert => (
          <div 
            key={alert.id} 
            className="p-3 rounded-lg backdrop-blur-sm"
            style={{ backgroundColor: getPriorityColor(alert.priority) }}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm font-arabic flex-1">{alert.title}</h4>
              <Star className="w-4 h-4 text-gray-600 flex-shrink-0" />
            </div>
            <p className="text-xs text-gray-700 font-arabic">{alert.status}</p>
          </div>
        ))}
        
        {alerts.length > 3 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-center text-sm text-gray-600 hover:text-gray-800 py-2 font-arabic"
          >
            {isExpanded ? 'عرض أقل' : `عرض المزيد (${alerts.length - 3}+)`}
          </button>
        )}
      </div>
    </div>
  );
};
