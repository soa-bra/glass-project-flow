import React from 'react';
import { BarChart3, FileText, TrendingUp, Users, AlertCircle, Target } from 'lucide-react';
interface AISuggestedWidgetProps {
  type: 'kpi' | 'reports' | 'alerts' | 'analytics' | 'team' | 'goals';
  title: string;
  className?: string;
}
const widgetConfig = {
  kpi: {
    icon: TrendingUp,
    content: {
      main: '94%',
      sub: 'معدل الإنجاز الشهري',
      trend: '+12% من الشهر السابق'
    }
  },
  reports: {
    icon: FileText,
    content: {
      main: '8',
      sub: 'تقارير جاهزة للمراجعة',
      trend: '3 تقارير جديدة اليوم'
    }
  },
  alerts: {
    icon: AlertCircle,
    content: {
      main: '5',
      sub: 'تنبيهات تحتاج متابعة',
      trend: '2 تنبيهات عاجلة'
    }
  },
  analytics: {
    icon: BarChart3,
    content: {
      main: '↗️',
      sub: 'الأداء في تحسن مستمر',
      trend: 'زيادة 18% هذا الأسبوع'
    }
  },
  team: {
    icon: Users,
    content: {
      main: '23',
      sub: 'عضو فريق نشط',
      trend: '5 أعضاء جدد هذا الشهر'
    }
  },
  goals: {
    icon: Target,
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
  return <div className={`
      ${className}
      rounded-3xl p-5
      bg-white/80 backdrop-blur-xl border border-white/30
      shadow-lg hover:shadow-xl transition-all duration-300
      flex flex-col justify-between
    `}>
      
      {/* رأس البطاقة */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-arabic font-bold text-gray-800">
          {title}
        </h3>
        
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-2xl font-bold mb-2 text-gray-900">
          {config.content.main}
        </div>
        
        <div className="text-sm text-gray-600 mb-3">
          {config.content.sub}
        </div>
        
        <div className="text-xs text-gray-500">
          {config.content.trend}
        </div>
      </div>

      {/* مؤشر التفاعل */}
      <div className="mt-4 pt-3 border-t border-gray-200/50">
        <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
          عرض التفاصيل ←
        </button>
      </div>
    </div>;
};