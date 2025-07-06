import React, { useState } from 'react';
import { Calendar, Clock, X, Plus, ArrowRight } from 'lucide-react';

interface CanvasElement {
  id: string;
  type: 'sticky-note' | 'shape' | 'text' | 'connection' | 'mindmap-node' | 'smart-element' | 'root-connector';
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: string;
  color: string;
  layer: number;
  rotation?: number;
  groupId?: string;
}

interface TimelinePanelProps {
  onClose: () => void;
  elements: CanvasElement[];
  onElementsUpdate: (elements: CanvasElement[]) => void;
}

interface TimelineEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  type: 'milestone' | 'task' | 'phase';
  status: 'pending' | 'in-progress' | 'completed';
  dependencies: string[];
}

export const TimelinePanel: React.FC<TimelinePanelProps> = ({
  onClose,
  elements,
  onElementsUpdate
}) => {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([
    {
      id: 'event1',
      title: 'بداية المشروع',
      startDate: '2024-01-01',
      endDate: '2024-01-01',
      type: 'milestone',
      status: 'completed',
      dependencies: []
    },
    {
      id: 'event2',
      title: 'مرحلة التخطيط',
      startDate: '2024-01-02',
      endDate: '2024-01-15',
      type: 'phase',
      status: 'completed',
      dependencies: ['event1']
    },
    {
      id: 'event3',
      title: 'مرحلة التطوير',
      startDate: '2024-01-16',
      endDate: '2024-02-28',
      type: 'phase',
      status: 'in-progress',
      dependencies: ['event2']
    },
    {
      id: 'event4',
      title: 'اختبار المشروع',
      startDate: '2024-03-01',
      endDate: '2024-03-15',
      type: 'task',
      status: 'pending',
      dependencies: ['event3']
    },
    {
      id: 'event5',
      title: 'إطلاق المشروع',
      startDate: '2024-03-16',
      endDate: '2024-03-16',
      type: 'milestone',
      status: 'pending',
      dependencies: ['event4']
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    startDate: '',
    endDate: '',
    type: 'task' as TimelineEvent['type']
  });

  const [showAddEvent, setShowAddEvent] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const getStatusColor = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in-progress': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'milestone': return '🎯';
      case 'phase': return '📋';
      case 'task': return '✓';
      default: return '•';
    }
  };

  const addEvent = () => {
    if (!newEvent.title || !newEvent.startDate) return;

    const event: TimelineEvent = {
      id: `event-${Date.now()}`,
      title: newEvent.title,
      startDate: newEvent.startDate,
      endDate: newEvent.endDate || newEvent.startDate,
      type: newEvent.type,
      status: 'pending',
      dependencies: []
    };

    setTimelineEvents(prev => [...prev, event]);
    setNewEvent({ title: '', startDate: '', endDate: '', type: 'task' });
    setShowAddEvent(false);
  };

  const generateTimelineCanvas = () => {
    const timelineElements: CanvasElement[] = [];
    const sortedEvents = [...timelineEvents].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    sortedEvents.forEach((event, index) => {
      const element: CanvasElement = {
        id: `timeline-${event.id}`,
        type: 'sticky-note',
        position: { x: 100 + (index * 200), y: 200 },
        size: { width: 180, height: 100 },
        content: `${event.title}\n${event.startDate}\n${event.status}`,
        color: event.status === 'completed' ? '#DCFCE7' : 
               event.status === 'in-progress' ? '#DBEAFE' : '#FEF3C7',
        layer: 1
      };
      timelineElements.push(element);

      // Add connections between dependent events
      if (event.dependencies.length > 0) {
        event.dependencies.forEach(depId => {
          const depIndex = sortedEvents.findIndex(e => e.id === depId);
          if (depIndex !== -1) {
            const connection: CanvasElement = {
              id: `connection-${event.id}-${depId}`,
              type: 'connection',
              position: { x: 100 + (depIndex * 200) + 180, y: 250 },
              size: { width: 20, height: 2 },
              content: '',
              color: '#9CA3AF',
              layer: 0
            };
            timelineElements.push(connection);
          }
        });
      }
    });

    onElementsUpdate([...elements.filter(el => !el.id.startsWith('timeline-')), ...timelineElements]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="absolute bottom-6 left-20 glass-section rounded-lg p-4 w-80 h-96 z-40 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 space-x-reverse">
          <Calendar size={16} className="text-green-600" />
          <span className="text-sm font-medium text-gray-700">الجدول الزمني</span>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-white/30 rounded"
        >
          <X size={14} className="text-gray-500" />
        </button>
      </div>

      {/* Timeline Events List */}
      <div className="flex-1 overflow-y-auto mb-3">
        <div className="space-y-2">
          {timelineEvents.map((event, index) => (
            <div
              key={event.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedEventId === event.id 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedEventId(event.id)}
            >
              <div className="flex items-start space-x-2 space-x-reverse">
                <span className="text-lg">{getTypeIcon(event.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-800 truncate">
                    {event.title}
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse mt-1">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status === 'completed' ? 'مكتمل' : 
                       event.status === 'in-progress' ? 'قيد التنفيذ' : 'معلق'}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Clock size={10} />
                      <span>{formatDate(event.startDate)}</span>
                      {event.startDate !== event.endDate && (
                        <>
                          <ArrowRight size={10} />
                          <span>{formatDate(event.endDate)}</span>
                          <span className="text-gray-400">
                            ({calculateDuration(event.startDate, event.endDate)} يوم)
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Event Form */}
      {showAddEvent && (
        <div className="mb-3 p-3 bg-green-50 rounded-lg">
          <div className="text-xs text-green-600 font-medium mb-2">إضافة حدث جديد</div>
          <div className="space-y-2">
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
              placeholder="عنوان الحدث"
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex space-x-2 space-x-reverse">
              <input
                type="date"
                value={newEvent.startDate}
                onChange={(e) => setNewEvent(prev => ({ ...prev, startDate: e.target.value }))}
                className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="date"
                value={newEvent.endDate}
                onChange={(e) => setNewEvent(prev => ({ ...prev, endDate: e.target.value }))}
                className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <select
              value={newEvent.type}
              onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as TimelineEvent['type'] }))}
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="task">مهمة</option>
              <option value="phase">مرحلة</option>
              <option value="milestone">معلم</option>
            </select>
            <div className="flex space-x-2 space-x-reverse">
              <button
                onClick={addEvent}
                disabled={!newEvent.title || !newEvent.startDate}
                className="flex-1 px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                إضافة
              </button>
              <button
                onClick={() => setShowAddEvent(false)}
                className="flex-1 px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-2 space-x-reverse pt-3 border-t border-gray-200">
        <button
          onClick={() => setShowAddEvent(true)}
          className="flex items-center space-x-1 space-x-reverse py-2 px-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-600 text-xs font-medium transition-colors"
        >
          <Plus size={12} />
          <span>إضافة</span>
        </button>
        
        <button
          onClick={generateTimelineCanvas}
          className="flex-1 py-2 px-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 text-xs font-medium transition-colors"
        >
          إنشاء في اللوحة
        </button>
      </div>

      <div className="mt-2 text-xs text-gray-500 text-center">
        اضغط على الأحداث لتحديدها وتعديلها
      </div>
    </div>
  );
};