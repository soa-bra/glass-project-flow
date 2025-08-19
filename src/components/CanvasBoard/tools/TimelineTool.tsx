import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Calendar, Plus, Move } from 'lucide-react';
import { toast } from 'sonner';

interface TimelinePoint {
  id: string;
  date: string;
  title: string;
  description?: string;
  connectedElementId?: string;
  position: number; // 0-100 percentage
}

interface TimelineElement {
  id: string;
  startDate: string;
  endDate: string;
  title: string;
  points: TimelinePoint[];
  position: { x: number; y: number };
  length: number;
  orientation: 'horizontal' | 'vertical';
}

interface TimelineToolProps {
  selectedTool: string;
  onCreateTimeline: (timeline: TimelineElement) => void;
  onCreateGanttChart: (gantt: any) => void;
}

const TimelineTool: React.FC<TimelineToolProps> = ({
  selectedTool,
  onCreateTimeline,
  onCreateGanttChart
}) => {
  const [timelineTitle, setTimelineTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [timelineType, setTimelineType] = useState<'simple' | 'gantt'>('simple');
  const [points, setPoints] = useState<TimelinePoint[]>([]);
  const [newPointTitle, setNewPointTitle] = useState('');
  const [newPointDate, setNewPointDate] = useState('');

  if (selectedTool !== 'timeline') return null;

  const handleAddPoint = () => {
    if (!newPointTitle.trim() || !newPointDate) return;

    const newPoint: TimelinePoint = {
      id: `point-${Date.now()}`,
      date: newPointDate,
      title: newPointTitle,
      position: calculatePosition(newPointDate)
    };

    setPoints(prev => [...prev, newPoint].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setNewPointTitle('');
    setNewPointDate('');
    toast.success('تمت إضافة النقطة الزمنية');
  };

  const calculatePosition = (date: string): number => {
    if (!startDate || !endDate) return 50;
    
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const current = new Date(date).getTime();
    
    if (current < start) return 0;
    if (current > end) return 100;
    
    return ((current - start) / (end - start)) * 100;
  };

  const handleCreateTimeline = () => {
    if (!timelineTitle.trim() || !startDate || !endDate) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (timelineType === 'gantt') {
      handleCreateGanttChart();
      return;
    }

    const timeline: TimelineElement = {
      id: `timeline-${Date.now()}`,
      startDate,
      endDate,
      title: timelineTitle,
      points: points.map(p => ({ ...p, position: calculatePosition(p.date) })),
      position: { x: 100, y: 100 },
      length: 400,
      orientation
    };

    onCreateTimeline(timeline);
    resetForm();
    toast.success('تم إنشاء الخط الزمني');
  };

  const handleCreateGanttChart = () => {
    const ganttData = {
      id: `gantt-${Date.now()}`,
      title: timelineTitle,
      startDate,
      endDate,
      tasks: points.map((point, index) => ({
        id: point.id,
        name: point.title,
        start: point.date,
        end: points[index + 1]?.date || endDate,
        progress: Math.random() * 100,
        dependencies: []
      })),
      position: { x: 100, y: 100 }
    };

    onCreateGanttChart(ganttData);
    resetForm();
    toast.success('تم إنشاء مخطط جانت');
  };

  const resetForm = () => {
    setTimelineTitle('');
    setStartDate('');
    setEndDate('');
    setPoints([]);
    setNewPointTitle('');
    setNewPointDate('');
  };

  const removePoint = (pointId: string) => {
    setPoints(prev => prev.filter(p => p.id !== pointId));
    toast.success('تم حذف النقطة');
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-sm border-black/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-500" />
          أداة الخط الزمني
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* نوع الخط الزمني */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">نوع الخط الزمني</label>
          <Select value={timelineType} onValueChange={(value: 'simple' | 'gantt') => setTimelineType(value)}>
            <SelectTrigger className="font-arabic">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simple">خط زمني بسيط</SelectItem>
              <SelectItem value="gantt">مخطط جانت</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* عنوان الخط الزمني */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">العنوان</label>
          <Input
            value={timelineTitle}
            onChange={(e) => setTimelineTitle(e.target.value)}
            placeholder="عنوان الخط الزمني"
            className="font-arabic"
          />
        </div>

        {/* التواريخ */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm font-medium font-arabic mb-2 block">تاريخ البداية</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium font-arabic mb-2 block">تاريخ النهاية</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* الاتجاه */}
        <div>
          <label className="text-sm font-medium font-arabic mb-2 block">الاتجاه</label>
          <Select value={orientation} onValueChange={(value: 'horizontal' | 'vertical') => setOrientation(value)}>
            <SelectTrigger className="font-arabic">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="horizontal">أفقي</SelectItem>
              <SelectItem value="vertical">عمودي</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* إضافة نقاط زمنية */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">النقاط الزمنية</h4>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={newPointTitle}
                onChange={(e) => setNewPointTitle(e.target.value)}
                placeholder="عنوان النقطة"
                className="font-arabic flex-1"
              />
              <Input
                type="date"
                value={newPointDate}
                onChange={(e) => setNewPointDate(e.target.value)}
                className="w-32"
              />
              <Button onClick={handleAddPoint} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* عرض النقاط المضافة */}
        {points.length > 0 && (
          <div className="max-h-40 overflow-y-auto space-y-1">
            {points.map((point) => (
              <div key={point.id} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                <div className="font-arabic">
                  <div className="font-medium">{point.title}</div>
                  <div className="text-gray-500 text-xs">{point.date}</div>
                </div>
                <Button
                  onClick={() => removePoint(point.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* زر الإنشاء */}
        <Button 
          onClick={handleCreateTimeline} 
          className="w-full"
          disabled={!timelineTitle.trim() || !startDate || !endDate}
        >
          <Calendar className="w-4 h-4 mr-2" />
          {timelineType === 'gantt' ? 'إنشاء مخطط جانت' : 'إنشاء خط زمني'}
        </Button>

        {/* معلومات إضافية */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium font-arabic mb-1">ميزات الخط الزمني:</h4>
          <ul className="text-xs text-blue-800 font-arabic space-y-1">
            <li>• ربط العناصر بالنقاط الزمنية</li>
            <li>• سحب وإفلات للجدولة</li>
            <li>• مستويات زمنية متعددة</li>
            <li>• تصدير كمخطط جانت</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineTool;