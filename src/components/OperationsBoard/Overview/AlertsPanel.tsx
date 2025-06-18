
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

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#f1b5b9';
      case 'medium': return '#fbe2aa';
      case 'low': return '#bdeed3';
      default: return '#d9d2fd';
    }
  };

  return (
    <div 
      className="h-full p-6 rounded-3xl shadow-lg border border-white/40"
      style={{ background: '#f2ffff' }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800 font-arabic">التنبيهات</h3>
        <div className="flex gap-2">
          <CircularIconButton icon={Plus} size="sm" />
          <CircularIconButton icon={MoreHorizontal} size="sm" />
          <CircularIconButton icon={Star} size="sm" />
        </div>
      </div>
      
      <div className="space-y-4">
        {alerts.slice(0, isExpanded ? alerts.length : 3).map((alert) => (
          <div key={alert.id} className="flex items-center gap-3 p-3 bg-white/60 rounded-lg backdrop-blur-sm">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: getPriorityColor(alert.priority) }}
            />
            <div className="flex-1">
              <div className="font-arabic text-sm font-medium text-gray-800">{alert.title}</div>
              <div className="text-xs text-gray-600 font-arabic mt-1">{alert.status}</div>
            </div>
          </div>
        ))}
      </div>
      
      {alerts.length > 3 && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-4 text-center text-sm text-blue-600 hover:text-blue-800 font-arabic transition-colors"
        >
          {isExpanded ? 'عرض أقل' : 'عرض المزيد'}
        </button>
      )}
    </div>
  );
};
