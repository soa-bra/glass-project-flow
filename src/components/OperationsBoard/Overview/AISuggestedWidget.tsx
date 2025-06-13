
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
    gradient: 'from-blue-500 to-blue-600',
    content: {
      main: '94%',
      sub: 'معدل الإنجاز الشهري',
      trend: '+12% من الشهر السابق'
    }
  },
  reports: {
    icon: FileText,
    gradient: 'from-purple-500 to-purple-600',
    content: {
      main: '8',
      sub: 'تقارير جاهزة للمراجعة',
      trend: '3 تقارير جديدة اليوم'
    }
  },
  alerts: {
    icon: AlertCircle,
    gradient: 'from-orange-500 to-red-500',
    content: {
      main: '5',
      sub: 'تنبيهات تحتاج متابعة',
      trend: '2 تنبيهات عاجلة'
    }
  },
  analytics: {
    icon: BarChart3,
    gradient: 'from-green-500 to-emerald-600',
    content: {
      main: '↗️',
      sub: 'الأداء في تحسن مستمر',
      trend: 'زيادة 18% هذا الأسبوع'
    }
  },
  team: {
    icon: Users,
    gradient: 'from-indigo-500 to-blue-600',
    content: {
      main: '23',
      sub: 'عضو فريق نشط',
      trend: '5 أعضاء جدد هذا الشهر'
    }
  },
  goals: {
    icon: Target,
    gradient: 'from-pink-500 to-rose-600',
    content: {
      main: '7/10',
      sub: 'أهداف محققة',
      trend: '3 أهداف متبقية'
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
      rounded-2xl p-4 text-white shadow-lg 
      bg-gradient-to-br ${config.gradient}
      hover:shadow-xl transition-all duration-300
      flex flex-col justify-between
    `}>
      
      {/* رأس البطاقة */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-arabic font-semibold opacity-90">
          {title}
        </h3>
        <Icon size={20} className="opacity-80" />
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-2xl font-bold mb-1">
          {config.content.main}
        </div>
        
        <div className="text-sm opacity-90 mb-2">
          {config.content.sub}
        </div>
        
        <div className="text-xs opacity-75">
          {config.content.trend}
        </div>
      </div>

      {/* مؤشر التفاعل */}
      <div className="mt-3 pt-3 border-t border-white/20">
        <button className="text-xs opacity-75 hover:opacity-100 transition-opacity">
          عرض التفاصيل ←
        </button>
      </div>
    </div>
  );
};
