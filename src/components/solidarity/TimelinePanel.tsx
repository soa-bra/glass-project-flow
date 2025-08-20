import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, Circle, ChevronDown, ChevronRight, Plus } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  date: Date;
  status: 'completed' | 'current' | 'upcoming';
  description?: string;
}

interface TimelinePanelProps {
  isVisible: boolean;
  onToggle: () => void;
}

const TimelinePanel: React.FC<TimelinePanelProps> = ({ isVisible, onToggle }) => {
  // Mock data - في التطبيق الحقيقي، ستأتي من API
  const [milestones] = useState<Milestone[]>([
    {
      id: '1',
      title: 'بداية المشروع',
      date: new Date('2024-01-15'),
      status: 'completed',
      description: 'إطلاق المشروع والتخطيط الأولي'
    },
    {
      id: '2',
      title: 'تشكيل الفريق',
      date: new Date('2024-02-01'),
      status: 'completed',
      description: 'اختيار أعضاء الفريق وتوزيع الأدوار'
    },
    {
      id: '3',
      title: 'مرحلة التنفيذ',
      date: new Date('2024-02-15'),
      status: 'current',
      description: 'بداية تنفيذ الأنشطة الأساسية'
    },
    {
      id: '4',
      title: 'المراجعة الوسطية',
      date: new Date('2024-03-15'),
      status: 'upcoming',
      description: 'مراجعة التقدم والتعديلات المطلوبة'
    },
    {
      id: '5',
      title: 'إنجاز المشروع',
      date: new Date('2024-04-30'),
      status: 'upcoming',
      description: 'استكمال جميع الأنشطة والتسليم'
    }
  ]);

  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-accent-green" />;
      case 'current':
        return <Clock size={16} className="text-accent-blue" />;
      case 'upcoming':
        return <Circle size={16} className="text-ink/40" />;
    }
  };

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return 'border-accent-green bg-accent-green/5';
      case 'current':
        return 'border-accent-blue bg-accent-blue/5';
      case 'upcoming':
        return 'border-ink/20 bg-ink/5';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCurrentProgress = () => {
    const completed = milestones.filter(m => m.status === 'completed').length;
    const total = milestones.length;
    return (completed / total) * 100;
  };

  return (
    <div className="absolute bottom-4 left-4 z-10">
      <div className="bg-white/90 backdrop-blur-sm border border-border rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between p-4 hover:bg-panel/30 transition-all"
        >
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-ink/70" />
            <span className="text-sm font-medium text-ink">الخط الزمني</span>
          </div>
          {isVisible ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Panel Content */}
        {isVisible && (
          <div className="border-t border-border p-4 max-w-sm">
            {/* Progress Overview */}
            <div className="mb-4 p-3 bg-panel/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-ink">تقدم المشروع</span>
                <span className="text-xs text-ink/70">{getCurrentProgress().toFixed(0)}%</span>
              </div>
              <div className="w-full bg-ink/10 rounded-full h-2">
                <div 
                  className="bg-accent-green h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getCurrentProgress()}%` }}
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-ink">المعالم الزمنية</span>
                <button className="text-accent-green hover:text-accent-green/80">
                  <Plus size={14} />
                </button>
              </div>
              
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="relative">
                  {/* Timeline Line */}
                  {index < milestones.length - 1 && (
                    <div className="absolute right-2 top-6 w-0.5 h-8 bg-ink/20" />
                  )}
                  
                  {/* Milestone */}
                  <div className={`relative p-3 border rounded-lg ${getStatusColor(milestone.status)}`}>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getStatusIcon(milestone.status)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="text-xs font-medium text-ink line-clamp-1">
                            {milestone.title}
                          </h4>
                          <span className="text-xs text-ink/60 whitespace-nowrap mr-2">
                            {formatDate(milestone.date)}
                          </span>
                        </div>
                        
                        {milestone.description && (
                          <p className="text-xs text-ink/70 line-clamp-2">
                            {milestone.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelinePanel;