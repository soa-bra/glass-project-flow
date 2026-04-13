import React, { useState } from 'react';

interface AITaskAssistantProps {
  projectId: string;
}

export const AITaskAssistant: React.FC<AITaskAssistantProps> = ({ projectId }) => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const aiFeatures = [
    {
      id: 'calendar',
      title: 'مساعد التقويم',
      description: 'جدولة تلقائية ذكية للمهام',
      icon: '📅',
      status: 'active'
    },
    {
      id: 'docs',
      title: 'مساعد الوثائق',
      description: 'إرفاق القوالب المناسبة للمهام',
      icon: '📄',
      status: 'active'
    },
    {
      id: 'planner',
      title: 'مخطط المهام',
      description: 'ترتيب الأولويات تلقائياً',
      icon: '🎯',
      status: 'active'
    },
    {
      id: 'reschedule',
      title: 'إعادة الجدولة التلقائية',
      description: 'تعديل المواعيد عند التأخير',
      icon: '⏰',
      status: 'active'
    },
    {
      id: 'assign',
      title: 'التوزيع الذكي',
      description: 'توزيع المهام حسب الخبرة والتوفر',
      icon: '👥',
      status: 'active'
    },
    {
      id: 'advisor',
      title: 'مستشار التأخير',
      description: 'تحذيرات مبكرة من التأخيرات المحتملة',
      icon: '⚠️',
      status: 'warning'
    }
  ];

  const suggestions = [
    {
      id: '1',
      type: 'calendar',
      title: 'تم اكتشاف تضارب في المواعيد',
      description: 'هناك تضارب بين مهمة "تطوير API" و "اختبار الأمان" ليوم الثلاثاء',
      action: 'إعادة جدولة',
      priority: 'high'
    },
    {
      id: '2',
      type: 'assign',
      title: 'اقتراح إعادة توزيع المهام',
      description: 'أحمد محمد محمل بنسبة 120% - يُنصح بإعادة توزيع مهمتين',
      action: 'إعادة توزيع',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'advisor',
      title: 'تحذير من تأخير محتمل',
      description: 'مهمة "اختبار الأمان" قد تتأخر بسبب انتظار مراجعة الكود',
      action: 'اتخاذ إجراء',
      priority: 'urgent'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#f1b5b9';
      case 'high': return '#fbe2aa';
      case 'medium': return '#a4e2f6';
      default: return '#bdeed3';
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'warning' ? '⚠️' : '✅';
  };

  return (
    <div className="rounded-[24px] bg-[#FFFFFF] border border-[#DADCE0] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-black">مساعد الذكاء الاصطناعي</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#bdeed3] rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-black">نشط</span>
        </div>
      </div>

      {/* AI Features Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {aiFeatures.map(feature => (
          <div
            key={feature.id}
            className={`p-4 bg-transparent border border-black/10 rounded-3xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
              activeFeature === feature.id ? 'ring-2 ring-black' : ''
            }`}
            onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">{feature.icon}</span>
              <span className="text-sm">{getStatusIcon(feature.status)}</span>
            </div>
            <h4 className="text-sm font-bold text-black mb-1">{feature.title}</h4>
            <p className="text-xs font-normal text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* AI Suggestions */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-black">الاقتراحات الذكية</h4>
        
        {suggestions.map(suggestion => (
          <div
            key={suggestion.id}
            className="flex items-center justify-between p-4 bg-transparent border border-black/10 rounded-full"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getPriorityColor(suggestion.priority) }}
              />
              <div>
                <h5 className="text-sm font-bold text-black">{suggestion.title}</h5>
                <p className="text-xs font-normal text-gray-400">{suggestion.description}</p>
              </div>
            </div>
            
            <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black/80 transition-colors">
              {suggestion.action}
            </button>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-black/10">
        <div className="flex flex-wrap gap-2">
          <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black/80 transition-colors">
            🤖 إنشاء مهام بالذكاء الاصطناعي
          </button>
          <button className="bg-transparent border border-black/10 text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-black/5 transition-colors">
            📊 تحليل الأداء
          </button>
          <button className="bg-transparent border border-black/10 text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-black/5 transition-colors">
            🎯 تحسين التوزيع
          </button>
        </div>
      </div>
    </div>
  );
};