
import React from 'react';
import { 
  BarChart3, 
  FileText, 
  TrendingUp, 
  Users, 
  AlertCircle,
  Target
} from 'lucide-react';

interface AISuggestedWidgetProps {
  type: 'kpi' | 'reports' | 'alerts' | 'analytics' | 'team' | 'goals';
  title: string;
  className?: string;
}

const widgetConfig = {
  kpi: {
    icon: TrendingUp,
    color: '#8B5CF6',
    bgColor: 'bg-purple-500/20',
    content: {
      main: '94%',
      sub: 'معدل الإنجاز الشهري',
      detail: '+12% من الشهر السابق'
    }
  },
  reports: {
    icon: FileText,
    color: '#3B82F6',
    bgColor: 'bg-blue-500/20',
    content: {
      main: '8',
      sub: 'تقارير جاهزة للمراجعة',
      detail: '3 تقارير جديدة اليوم'
    }
  },
  alerts: {
    icon: AlertCircle,
    color: '#EF4444',
    bgColor: 'bg-red-500/20',
    content: {
      main: '5',
      sub: 'تنبيهات تحتاج متابعة',
      detail: '2 تنبيهات عاجلة'
    }
  },
  analytics: {
    icon: BarChart3,
    color: '#10B981',
    bgColor: 'bg-green-500/20',
    content: {
      main: '↗️',
      sub: 'الأداء في تحسن مستمر',
      detail: 'زيادة 18% هذا الأسبوع'
    }
  },
  team: {
    icon: Users,
    color: '#6366F1',
    bgColor: 'bg-indigo-500/20',
    content: {
      main: '23',
      sub: 'عضو فريق نشط',
      detail: '5 أعضاء جدد هذا الشهر'
    }
  },
  goals: {
    icon: Target,
    color: '#059669',
    bgColor: 'bg-emerald-500/20',
    content: {
      main: '7/10',
      sub: 'أهداف محققة',
      detail: '3 أهداف متبقية'
    }
  }
};

export const AISuggestedWidget: React.FC<AISuggestedWidgetProps> = ({
  type,
  title,
  className = ''
}) => {
  const config = widgetConfig[type];
  const Icon = config.icon;

  return (
    <div className={`
      ${className}
      rounded-2xl p-4 relative overflow-hidden
      bg-white/40 backdrop-blur-[20px] border border-white/30
      shadow-sm hover:shadow-md transition-all duration-300
      cursor-pointer group
    `}>
      
      {/* المحتوى */}
      <div className="relative z-10">
        {/* رأس البطاقة */}
        <div className="flex items-center justify-between mb-4">
          <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center`}>
            <Icon size={16} style={{color: config.color}} />
          </div>
          <h3 className="text-sm font-medium text-gray-800 font-arabic">
            {title}
          </h3>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {config.content.main}
          </div>
          <div className="text-xs text-gray-600 font-arabic">
            {config.content.sub}
          </div>
        </div>

        {/* التفاصيل الإضافية */}
        <div className="p-2 rounded-lg bg-white/30">
          <div className="text-xs text-gray-700 font-arabic">
            {config.content.detail}
          </div>
        </div>

        {/* مؤشر التفاعل */}
        <div className="mt-3 pt-2 border-t border-white/20">
          <div className="flex items-center justify-center gap-1 text-xs text-gray-500 group-hover:text-gray-700 transition-colors font-arabic">
            <span>عرض التفاصيل</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
