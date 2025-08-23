import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/BaseBadge';
import { Timeline as TimelineType, TimelineEvent } from '../../../types/smartElements.types';
import { Calendar, Plus, Clock, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimelineProps {
  element: TimelineType;
  isSelected?: boolean;
  onUpdate?: (updates: Partial<TimelineType>) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  element,
  isSelected = false,
  onUpdate
}) => {
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    description: ''
  });

  const sortedEvents = [...element.data.events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !onUpdate) return;

    const event: TimelineEvent = {
      id: `event_${Date.now()}`,
      title: newEvent.title,
      date: newEvent.date,
      description: newEvent.description,
      category: 'default'
    };

    onUpdate({
      data: {
        ...element.data,
        events: [...element.data.events, event]
      }
    });

    setNewEvent({ title: '', date: '', description: '' });
    setIsAddingEvent(false);
  };

  const handleTimeUnitChange = (timeUnit: 'day' | 'week' | 'month' | 'year') => {
    if (onUpdate) {
      onUpdate({
        data: {
          ...element.data,
          timeUnit
        }
      });
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    switch (element.data.timeUnit) {
      case 'day':
        return date.toLocaleDateString('ar-SA');
      case 'week':
        return `الأسبوع ${Math.ceil(date.getDate() / 7)}، ${date.getFullYear()}`;
      case 'month':
        return date.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' });
      case 'year':
        return date.getFullYear().toString();
      default:
        return date.toLocaleDateString('ar-SA');
    }
  };

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      milestone: 'bg-primary',
      task: 'bg-blue-500',
      meeting: 'bg-green-500',
      deadline: 'bg-red-500',
      default: 'bg-muted-foreground'
    };
    return colors[category || 'default'] || colors.default;
  };

  return (
    <Card 
      className={`w-full h-full ${isSelected ? 'ring-2 ring-primary' : ''} transition-all duration-200`}
      style={{ 
        minWidth: element.size.width,
        minHeight: element.size.height
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">الخط الزمني</CardTitle>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={element.data.timeUnit} onValueChange={handleTimeUnitChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">يومي</SelectItem>
                <SelectItem value="week">أسبوعي</SelectItem>
                <SelectItem value="month">شهري</SelectItem>
                <SelectItem value="year">سنوي</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" onClick={() => setIsAddingEvent(true)}>
              <Plus className="h-4 w-4 mr-1" />
              إضافة حدث
            </Button>
          </div>
        </div>

        {/* Timeline Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            إجمالي الأحداث: {element.data.events.length}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            الفترة: {element.data.startDate} - {element.data.endDate}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Add Event Form */}
        {isAddingEvent && (
          <Card className="p-4">
            <div className="space-y-3">
              <Input
                placeholder="عنوان الحدث"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
              <Input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
              <Input
                placeholder="وصف الحدث (اختياري)"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddEvent} size="sm">
                  إضافة
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsAddingEvent(false)}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Timeline Visualization */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
          
          <div className="space-y-6">
            {sortedEvents.map((event, index) => (
              <div key={event.id} className="relative flex items-start gap-4">
                {/* Timeline Dot */}
                <div className={`
                  w-3 h-3 rounded-full border-2 border-background z-10
                  ${getCategoryColor(event.category)}
                `}></div>
                
                {/* Event Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {formatDate(event.date)}
                    </Badge>
                  </div>
                  
                  {event.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {event.description}
                    </p>
                  )}
                  
                  {event.category && (
                    <Badge variant="secondary" className="text-xs">
                      {event.category}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {element.data.events.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">لا توجد أحداث في الخط الزمني</p>
            <p className="text-xs mt-1">انقر "إضافة حدث" لبدء إنشاء خطك الزمني</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};