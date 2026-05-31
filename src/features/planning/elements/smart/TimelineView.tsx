import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Calendar, ChevronLeft, ChevronRight, Trash2, GripVertical, Link2, Unlink, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProjectsTimeline, type TimelineEventFromProject } from '@/hooks/useProjectsTimeline';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  color: string;
  layer: number;
  projectId?: string;
  phaseId?: string;
  type?: 'project_start' | 'project_end' | 'phase' | 'custom';
}

interface TimelineViewData {
  events: TimelineEvent[];
  viewMode: 'day' | 'week' | 'month';
  startDate: string;
  linkedProjectId?: string;
}

interface TimelineViewProps {
  data: TimelineViewData;
  onUpdate: (data: Partial<TimelineViewData>) => void;
}

const COLORS = ['#3DBE8B', '#3DA8F5', '#F6C445', '#E5564D', '#9b87f5', '#0EA5E9'];

const generateId = () => Math.random().toString(36).substr(2, 9);

export const TimelineView: React.FC<TimelineViewProps> = ({ data, onUpdate }) => {
  const [newEventTitle, setNewEventTitle] = useState('');
  const [draggedEvent, setDraggedEvent] = useState<string | null>(null);
  
  const { projects, loading: projectsLoading, getProjectTimelineEvents } = useProjectsTimeline();

  const events = data?.events || [];
  const viewMode = data?.viewMode || 'week';
  const startDate = data?.startDate || new Date().toISOString().split('T')[0];
  const linkedProjectId = data?.linkedProjectId;

  // دمج أحداث المشروع المرتبط مع الأحداث المخصصة
  const allEvents = useCallback(() => {
    const customEvents = events.filter(e => e.type === 'custom' || !e.type);
    
    if (linkedProjectId) {
      const projectEvents = getProjectTimelineEvents(linkedProjectId);
      return [...projectEvents.map(e => ({ ...e, type: e.type as TimelineEvent['type'] })), ...customEvents];
    }
    
    return customEvents;
  }, [events, linkedProjectId, getProjectTimelineEvents]);

  const getDateRange = useCallback(() => {
    const start = new Date(startDate);
    const dates: Date[] = [];
    const count = viewMode === 'day' ? 7 : viewMode === 'week' ? 4 : 6;
    
    for (let i = 0; i < count; i++) {
      const date = new Date(start);
      if (viewMode === 'day') {
        date.setDate(start.getDate() + i);
      } else if (viewMode === 'week') {
        date.setDate(start.getDate() + (i * 7));
      } else {
        date.setMonth(start.getMonth() + i);
      }
      dates.push(date);
    }
    return dates;
  }, [startDate, viewMode]);

  const formatDate = (date: Date) => {
    if (viewMode === 'month') {
      return date.toLocaleDateString('ar-SA', { month: 'short', year: 'numeric' });
    }
    return date.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' });
  };

  const addEvent = () => {
    if (!newEventTitle.trim()) return;
    
    const newEvent: TimelineEvent = {
      id: generateId(),
      title: newEventTitle.trim(),
      date: startDate,
      color: COLORS[events.length % COLORS.length],
      layer: 0,
      type: 'custom',
    };
    
    onUpdate({ events: [...events, newEvent] });
    setNewEventTitle('');
  };

  const updateEvent = (id: string, updates: Partial<TimelineEvent>) => {
    onUpdate({
      events: events.map(e => e.id === id ? { ...e, ...updates } : e)
    });
  };

  const deleteEvent = (id: string) => {
    // لا يمكن حذف أحداث المشروع المرتبط
    const event = events.find(e => e.id === id);
    if (event?.projectId && event.type !== 'custom') return;
    
    onUpdate({ events: events.filter(e => e.id !== id) });
  };

  const handleDragStart = (eventId: string) => {
    // لا يمكن سحب أحداث المشروع المرتبط
    const event = allEvents().find(e => e.id === eventId);
    if (event?.projectId && event.type !== 'custom') return;
    
    setDraggedEvent(eventId);
  };

  const handleDragOver = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    if (draggedEvent) {
      updateEvent(draggedEvent, { date: date.toISOString().split('T')[0] });
      setDraggedEvent(null);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const current = new Date(startDate);
    const offset = viewMode === 'day' ? 7 : viewMode === 'week' ? 28 : 6;
    
    if (direction === 'prev') {
      current.setDate(current.getDate() - offset);
    } else {
      current.setDate(current.getDate() + offset);
    }
    
    onUpdate({ startDate: current.toISOString().split('T')[0] });
  };

  const changeViewMode = (mode: 'day' | 'week' | 'month') => {
    onUpdate({ viewMode: mode });
  };

  const linkProject = (projectId: string) => {
    if (projectId === 'none') {
      onUpdate({ linkedProjectId: undefined });
    } else {
      onUpdate({ linkedProjectId: projectId });
      
      // الانتقال لتاريخ بداية المشروع
      const project = projects.find(p => p.id === projectId);
      if (project?.start_date) {
        onUpdate({ startDate: project.start_date });
      }
    }
  };

  const getEventsForDate = (date: Date) => {
    return allEvents().filter(event => {
      const eventDate = new Date(event.date);
      if (viewMode === 'month') {
        return eventDate.getMonth() === date.getMonth() && 
               eventDate.getFullYear() === date.getFullYear();
      }
      if (viewMode === 'week') {
        const weekStart = new Date(date);
        const weekEnd = new Date(date);
        weekEnd.setDate(weekEnd.getDate() + 6);
        return eventDate >= weekStart && eventDate <= weekEnd;
      }
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const dateRange = getDateRange();
  const linkedProject = linkedProjectId ? projects.find(p => p.id === linkedProjectId) : null;

  return (
    <div className="w-full h-full flex flex-col bg-background rounded-lg border border-border overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="p-3 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">الخط الزمني</h3>
          </div>
          
          <div className="flex items-center gap-1">
            {(['day', 'week', 'month'] as const).map((mode) => (
              <Button
                key={mode}
                size="sm"
                variant={viewMode === mode ? 'default' : 'ghost'}
                onClick={() => changeViewMode(mode)}
                className="text-xs h-7 px-2"
              >
                {mode === 'day' ? 'يوم' : mode === 'week' ? 'أسبوع' : 'شهر'}
              </Button>
            ))}
          </div>
        </div>

        {/* ربط المشروع */}
        <div className="flex gap-2 mb-2">
          <Select value={linkedProjectId || 'none'} onValueChange={linkProject}>
            <SelectTrigger className="flex-1 h-8 text-sm">
              <div className="flex items-center gap-2">
                {linkedProjectId ? <Link2 className="h-3 w-3 text-primary" /> : <Unlink className="h-3 w-3 text-muted-foreground" />}
                <SelectValue placeholder="ربط بمشروع..." />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">بدون ربط</SelectItem>
              {projectsLoading ? (
                <div className="flex items-center justify-center p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex items-center gap-2">
                      <span>{project.name}</span>
                      {project.phases.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          ({project.phases.length} مرحلة)
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* معلومات المشروع المرتبط */}
        {linkedProject && (
          <div className="p-2 bg-primary/10 rounded-md mb-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium text-primary">{linkedProject.name}</span>
              <span className="text-muted-foreground">
                {linkedProject.phases.length} مرحلة
              </span>
            </div>
            {linkedProject.start_date && linkedProject.end_date && (
              <div className="text-muted-foreground mt-1">
                {new Date(linkedProject.start_date).toLocaleDateString('ar-SA')} - {new Date(linkedProject.end_date).toLocaleDateString('ar-SA')}
              </div>
            )}
          </div>
        )}

        {/* Add Event */}
        <div className="flex gap-2">
          <Input
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
            placeholder="أضف حدث مخصص..."
            className="flex-1 h-8 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && addEvent()}
          />
          <Button size="sm" onClick={addEvent} className="h-8">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/20">
        <Button size="sm" variant="ghost" onClick={() => navigateDate('next')} className="h-7">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-foreground">
          {formatDate(dateRange[0])} - {formatDate(dateRange[dateRange.length - 1])}
        </span>
        <Button size="sm" variant="ghost" onClick={() => navigateDate('prev')} className="h-7">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Timeline Grid */}
      <div className="flex-1 overflow-auto p-3">
        <div className="flex gap-2 min-w-max">
          {dateRange.map((date, idx) => (
            <div
              key={idx}
              className="flex-1 min-w-[140px] bg-muted/20 rounded-lg border border-border/50 overflow-hidden"
              onDragOver={(e) => handleDragOver(e, date)}
              onDrop={(e) => handleDrop(e, date)}
            >
              {/* Date Header */}
              <div className="p-2 bg-muted/40 border-b border-border/50 text-center">
                <span className="text-xs font-medium text-foreground">
                  {formatDate(date)}
                </span>
              </div>

              {/* Events */}
              <div className="p-2 space-y-2 min-h-[120px]">
                {getEventsForDate(date).map((event) => {
                  const isProjectEvent = event.projectId && event.type !== 'custom';
                  
                  return (
                    <div
                      key={event.id}
                      draggable={!isProjectEvent}
                      onDragStart={() => handleDragStart(event.id)}
                      className={cn(
                        "p-2 rounded-md transition-all",
                        isProjectEvent ? "cursor-default" : "cursor-move hover:shadow-md hover:scale-[1.02]",
                        draggedEvent === event.id && "opacity-50"
                      )}
                      style={{ backgroundColor: `${event.color}20`, borderRight: `3px solid ${event.color}` }}
                    >
                      <div className="flex items-start gap-1">
                        {!isProjectEvent && (
                          <GripVertical className="h-3 w-3 mt-0.5 text-muted-foreground shrink-0" />
                        )}
                        {isProjectEvent && (
                          <Link2 className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">
                            {event.title}
                          </p>
                          {event.description && (
                            <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                              {event.description}
                            </p>
                          )}
                          {event.type && event.type !== 'custom' && (
                            <span className={cn(
                              "text-[9px] px-1 py-0.5 rounded mt-1 inline-block",
                              event.type === 'project_start' && "bg-green-100 text-green-700",
                              event.type === 'project_end' && "bg-red-100 text-red-700",
                              event.type === 'phase' && "bg-blue-100 text-blue-700"
                            )}>
                              {event.type === 'project_start' ? 'بداية' : event.type === 'project_end' ? 'نهاية' : 'مرحلة'}
                            </span>
                          )}
                        </div>
                        {!isProjectEvent && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteEvent(event.id)}
                            className="h-5 w-5 p-0 opacity-0 hover:opacity-100 shrink-0"
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="p-2 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{allEvents().length} حدث</span>
          <span>
            {linkedProjectId ? 'مرتبط بمشروع' : 'اسحب الأحداث لتغيير التاريخ'}
          </span>
        </div>
      </div>
    </div>
  );
};
